import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';

import User from '../models/users.js';

import HttpError from '../helpers/HttpError.js';

import ctrlWrapper from '../Wrapper/ctrlWrapper.js';

const { JWT_SECRET } = process.env;

dotenv.config();

const authenticate = async (req, res, next) => {
	const { authorization } = req.headers;
	console.log(authorization);
	if (!authorization) {
		throw new HttpError(401, 'Authorization header not found');
	}
	const [bearer, token] = authorization.split(' ');
	if (bearer !== 'Bearer') {
		throw new HttpError(401, 'Invalid signature');
	}
	try {
		const { contactId } = jwt.verify(token, JWT_SECRET);
		const user = await User.findById(contactId);
		if (!user || !user.token || user.token !== token) {
			throw new HttpError(401, 'User not found');
		}
		req.user = user;
		next();
	} catch (error) {
		console.log(error);
		throw new HttpError(401, 'Unauthorized');
	}
};

export default ctrlWrapper(authenticate);
