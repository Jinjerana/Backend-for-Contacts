import bcrypt from 'bcryptjs';

import User from '../models/users.js';
import { Jwt } from 'jsonwebtoken';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../Wrapper/ctrlWrapper.js';

import { userSignupSchema, userSigninSchema } from '../schemas/auth-schemas.js';

const { JWT_SECRET } = process.env;

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

const signin = async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		throw new HttpError(401, 'email or password invalid');
	}
	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw new HttpError(401, 'Password is invalid');
	}

	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });

	res.json({
		token,
	});
};

export default {
	signup: ctrlWrapper(signup),
	signin: ctrlWrapper(signin),
};
