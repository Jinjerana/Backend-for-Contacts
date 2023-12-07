import express from 'express';

const usersRouter = express.Router();

import usersController from '../../controllers/usersController.js';

import authenticate from '../../middlewares/authenticate.js';

import upload from '../../middlewares/upload.js';

// import gravatar from '../../middlewares/gravatar.js';

usersRouter.post('/signup', upload.single('avatar'), usersController.signup);

usersRouter.post('/signin', usersController.signin);

usersRouter.get('/current', authenticate, usersController.getCurrent);

usersRouter.post('/signout', authenticate, usersController.signout);

usersRouter.patch('/avatars', usersController.updateAvatar);

export default usersRouter;
