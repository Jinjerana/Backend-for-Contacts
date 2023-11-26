import bcrypt from 'bcryptjs';

import User from '../models/users.js';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../Wrapper/ctrlWrapper.js';

import { userSignupSchema, userSigninSchema } from '../schemas/auth-schemas.js';

const signup = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (user) {
		throw new HttpError(409, 'Email in use');
	}

	const hashPassword = await bcrypt.hash(password, 10);

	const newUser = await User.create({ ...req.body, password: hashPassword });

	res.status(201).json({
		email: newUser.email,
		subscription: newUser.subscription,
	});
};

export default {
	signup: ctrlWrapper(signup),
};
