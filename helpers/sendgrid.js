import sgMail from '@sendgrid/mail';

import User from '../models/users.js';

import dotenv from 'dotenv';

dotenv.config();

const { SENDGRID_API_TOKEN, SENDGRID_EMAIL_FROM, BASE_URL } = process.env;

sgMail.setApiKey(SENDGRID_API_TOKEN);

const sendgrid = (req, res) => {
	const { verificationToken } = req.params;

	const msg = {
		to: 'jararew306@hupoi.com',
		from: SENDGRID_EMAIL_FROM, // Use the email address or domain you verified above
		subject: 'Test Email',
		text: 'Nest Email with Node.js',
		html: `<a target='_blank' href='${BASE_URL}/users/verify/${verificationToken}'>Click to verify</a>`,
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
};

export default sendgrid;
