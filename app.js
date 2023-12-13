import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import { notFoundHandler } from './middlewares/notFoundHandler.js';

import { globalErrorHandler } from './middlewares/globalErrorHandler.js';

import contactsRouter from './routes/api/contacts.js';

// import authRouter from './routes/api/auth-router.js';
import usersRouter from './routes/api/auth-router.js';

dotenv.config();

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api/contacts', contactsRouter);
app.use('/users', usersRouter);

app.use((req, res) => {
	res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
	const { statusCode = 500, message = 'Server error' } = err;
	res.status(statusCode).json({ message });
});

app.use(notFoundHandler);

app.use(globalErrorHandler);

import sgMail from '@sendgrid/mail';

dotenv.config();

const { SENDGRID_API_TOKEN, SENDGRID_EMAIL_FROM } = process.env;

sgMail.setApiKey(SENDGRID_API_TOKEN);

const msg = {
	to: 'kocano5659@getmola.com',
	from: SENDGRID_EMAIL_FROM, // Use the email address or domain you verified above
	subject: 'Test Email',
	text: 'Nest Email with Node.js',
	html: '<strong>Test is easy to do anywhere, even with Node.js</strong>',
};
//ES6
sgMail
	.send(msg)
	.then(() => {
		console.log('Email sent');
	})
	.catch((error) => {
		console.error(error);
	});

export default app;
