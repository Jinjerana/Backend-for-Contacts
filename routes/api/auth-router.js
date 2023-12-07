import express from 'express';

import usersController from '../../controllers/usersController.js';

import authenticate from '../../middlewares/authenticate.js';

import upload from '../../middlewares/upload.js';

const usersRouter = express.Router();

usersRouter.post('/signup', usersController.signup);

usersRouter.post('/signin', usersController.signin);

usersRouter.get('/current', authenticate, usersController.getCurrent);

usersRouter.post('/signout', authenticate, usersController.signout);

usersRouter.patch(
	'/avatars',
	authenticate,
	upload.single('avatarUrl'),
	usersController.updateAvatar
);

export default usersRouter;
