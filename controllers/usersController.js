import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import gravatar from 'gravatar';
import crypto from 'crypto';
import Jimp from 'jimp';

import fs from 'fs/promises';
import path from 'path';

import User from '../models/users.js';
import jwt from 'jsonwebtoken';

import generateAvatarUrl from '../helpers/gravatar.js';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../Wrapper/ctrlWrapper.js';

import { userSignupSchema, userSigninSchema } from '../schemas/auth-schemas.js';

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

	const avatar = generateAvatarUrl(email, {
		defaultImage: 'monsterid',
	});

	const newUser = await User.create({
		...req.body,
		password: hashPassword,
		avatarUrl: avatar,
	});

	res.status(201).json({
		email: newUser.email,
		subscription: newUser.subscription,
	});
};

const signin = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw new HttpError(401, 'email or password is wrong');
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
			// subscription,
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
	console.log(req.file);

	const newPath = path.join(avatarsPath, filename);

	(await Jimp.read(oldPath)).resize(250, 250).write(oldPath);

	await fs.rename(oldPath, newPath);
	const avatarUrl = path.join('avatars', filename);

	await User.findByIdAndUpdate(_id, { avatarUrl }, { new: true });
	if (error) {
		throw new HttpError(401, `Not authorized`);
	}
	res.status(200).json({ avatarUrl });
	// res.json(result);
};

export default {
	signup: ctrlWrapper(signup),
	signin: ctrlWrapper(signin),
	getCurrent: ctrlWrapper(getCurrent),
	signout: ctrlWrapper(signout),
	updateAvatar: ctrlWrapper(updateAvatar),
};
