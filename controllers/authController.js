import User from '../models/users';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../Wrapper/ctrlWrapper.js';

import { userSignupSchema, userSigninSchema } from '../schemas/auth-schemas';

const signup = async (req, res) => {};

export default {
	signup: ctrlWrapper(signup),
};
