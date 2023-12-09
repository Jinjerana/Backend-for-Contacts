import express from 'express';

import usersController from '../../controllers/usersController.js';

import authenticate from '../../middlewares/authenticate.js';

import uploadTmp from '../../middlewares/uploadTmp.js';

const usersRouter = express.Router();

usersRouter.post('/signup', usersController.signup);

usersRouter.post('/signin', usersController.signin);

usersRouter.get('/current', authenticate, usersController.getCurrent);

usersRouter.post('/signout', authenticate, usersController.signout);

usersRouter.patch(
	'/avatars',
	authenticate,
	uploadTmp.single('avatar'),
	usersController.updateAvatar
);

export default usersRouter;
