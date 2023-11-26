import express from 'express';

const authRouter = express.Router();

import authController from '../../controllers/authController.js';

export default authRouter;

authRouter.post('/signup', authController.signup);

authRouter.post('/signin', authController.signin);
