import express from 'express';

const authRouter = express.Router();

import authController from '../../controllers/authController.js';

import authenticate from '../../middlewares/authenticate.js';

authRouter.post('/signup', authController.signup);

authRouter.post('/signin', authController.signin);

authRouter.get('/current', authenticate, authController.getCurrent);

authRouter.post('/signout', authenticate, authController.signout);

export default authRouter;
