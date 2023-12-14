import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Jimp from 'jimp';
import { nanoid } from 'nanoid';

import sgMail from '@sendgrid/mail';

import fs from 'fs/promises';
import path from 'path';

import User from '../models/users.js';
import jwt from 'jsonwebtoken';

import generateAvatarUrl from '../helpers/gravatar.js';

import HttpError from '../helpers/HttpError.js';

import sendgrid from '../helpers/sendgrid.js';

import ctrlWrapper from '../Wrapper/ctrlWrapper.js';

dotenv.config();

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve('public', 'avatars');

const signup = async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	if (user) {
		throw new HttpError(409, 'Email in use');
	}

	const hashPassword = await bcrypt.hash(password, 10);
	const verificationToken = nanoid();

	const avatar = generateAvatarUrl(email, {
		defaultImage: 'monsterid',
	});

	const newUser = await User.create({
		...req.body,
		password: hashPassword,
		verificationToken,
		avatarUrl: avatar,
	});

	await sendgrid();

	res.status(201).json({
		email: newUser.email,
		subscription: newUser.subscription,
	});
};

const verify = async (req, res) => {
	const { verificationToken } = req.params;

	const user = await User.findOne({ verificationToken });
	if (!user) {
		throw new HttpError(404, 'User not found');
	}

	await User.findOneAndUpdate(user._id, {
		verify: true,
		verificationToken: '',
	});

	res.json({ message: 'Verification successful' });
};

const resendVerify = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw new HttpError(400, 'missing required field email');
	}
	if (user.verify) {
		throw new HttpError(400, 'Verification has already been passed');
	}
	await sendgrid();

	res.json({
		message: 'Verification successful',
	});
};

const signin = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw new HttpError(401, 'email or password is wrong');
	}

	if (!user.verify) {
		throw new HttpError(401, 'email not verify');
	}

	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw new HttpError(401, 'email or password is wrong');
	}

	const payload = {
		contactId: user._id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		token,
		user: {
			email,
		},
	});
};

const getCurrent = async (req, res) => {
	const { email } = req.user;
	res.json({
		email,
	});
};

const signout = async (req, res) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: '' });

	res.json({
		message: 'Signout success',
	});
};

const updateAvatar = async (req, res) => {
	const { _id } = req.user;

	const { path: oldPath, filename } = req.file;

	const newPath = path.join(avatarsPath, filename);

	(await Jimp.read(oldPath)).resize(250, 250).write(oldPath);

	await fs.rename(oldPath, newPath);
	const avatarUrl = path.join('avatars', filename);

	await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true });
	if (error) {
		throw new HttpError(401, `Not authorized`);
	}
	res.status(200).json({ avatarUrl });
};

export default {
	signup: ctrlWrapper(signup),
	signin: ctrlWrapper(signin),
	getCurrent: ctrlWrapper(getCurrent),
	signout: ctrlWrapper(signout),
	updateAvatar: ctrlWrapper(updateAvatar),
	verify: ctrlWrapper(verify),
	resendVerify: ctrlWrapper(resendVerify),
};
