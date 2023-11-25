import User from '../models/users.js';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../Wrapper/ctrlWrapper.js';

import { userSignupSchema, userSigninSchema } from '../schemas/auth-schemas.js';

const signup = async (req, res) => {
	const newUser = await User.create(req.body);

	res.status(201).json({
		email: newUser.email,
		subscription: newUser.subscription,
	});
};

export default {
	signup: ctrlWrapper(signup),
};
