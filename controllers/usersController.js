import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import gravatar from 'gravatar';
import crypto from 'crypto';

import User from '../models/users.js';
import jwt from 'jsonwebtoken';

import generateAvatarUrl from '../middlewares/gravatar.js';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../Wrapper/ctrlWrapper.js';

import { userSignupSchema, userSigninSchema } from '../schemas/auth-schemas.js';

dotenv.config();

const { JWT_SECRET } = process.env;

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
	console.log(newUser);

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

// const updateAvatar = async (req, res) => {
// 	const { avatarURL } = req.user;

// 	const result = await User.findOneAndUpdate(avatarURL, req.body);
// 	if (error) {
// 		throw new HttpError(401, `Not authorized`);
// 	}
// 	res.json(result);
// };

const updateAvatar = async (req, res) => {
	const { _id } = req.user;
	console.log(_id);
	const { avatar } = req.body;
	console.log(req.body);

	// const { _id: avatarURL } = req.user;

	const result = await User.findByIdAndUpdate(_id, { avatar });
	if (error) {
		throw new HttpError(401, `Not authorized`);
	}
	res.json(result);
};

// const updateAvatar = async (req, res) => {
// 	const { avatar } = req.body;
// 	console.log(req.params);
// 	// const { _id: avatarURL } = req.user;

// 	const result = await User.findOneAndUpdate(avatar, req.body);
// 	if (error) {
// 		throw new HttpError(401, `Not authorized`);
// 	}
// 	res.json(result);
// };

// const updateByIdFavorite = async (req, res) => {
// 	const { contactId } = req.params;
// 	const { _id: owner } = req.user;
// 	const { error } = contactFavoriteSchema.validate(req.body);
// 	const result = await Contact.findOneAndUpdate(
// 		{ _id: contactId, owner },
// 		req.body
// 	);
// 	if (error) {
// 		throw new HttpError(404, `Contact with id=${contactId} not found`);
// 	}
// 	res.json(result);
// };

export default {
	signup: ctrlWrapper(signup),
	signin: ctrlWrapper(signin),
	getCurrent: ctrlWrapper(getCurrent),
	signout: ctrlWrapper(signout),
	updateAvatar: ctrlWrapper(updateAvatar),
};
