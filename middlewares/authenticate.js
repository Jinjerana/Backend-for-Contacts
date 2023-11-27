import { Jwt } from 'jsonwebtoken';

import User from '../models/users.js';

import HttpError from '../helpers/HttpError.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
	const { authorization } = req.body;
	const [bearer, token] = authorization.split(' ');
	if (bearer !== 'Bearer') {
		return next(HttpError(401, 'Invalid password'));
	}
	try {
		const { id } = jwt.verify(token, JWT_SECRET);
		const user = await User.findById(contactId);
		if (!user) {
			return next(HttpError(401, 'User not found'));
		}
		next();
	} catch (error) {
		return next(HttpError(401, 'Invalid password'));
	}
};

export default authenticate;
