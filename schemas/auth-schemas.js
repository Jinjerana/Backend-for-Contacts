import Joi from 'joi';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const userSignupSchema = Joi.object({
	password: Joi.string().min(6).required().messages({
		'any.required': `"password" is a required field`,
		'string.base': `"password" should be a type of 'text'`,
	}),
	email: Joi.string().required().pattern(emailRegexp).messages({
		'any.required': `"email" is a required field`,
		'string.base': `"email" should be a type of 'text'`,
	}),
	// subscription: Joi.string().required().messages({
	// 	'any.required': `"subscription" is a required field`,
	// 	'string.base': `"subscription" should be a type of 'text'`,
	// }),
});

export const userSigninSchema = Joi.object().keys({
	password: userSignupSchema.extract('password'),
	email: userSignupSchema.extract('email'),
});
