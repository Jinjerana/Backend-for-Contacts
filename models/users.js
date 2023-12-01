import { Schema, model } from 'mongoose';

import { handleSaveError, preUpdate } from './hooks.js';

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
	{
		password: {
			type: String,
			minLength: 4,
			required: [true, 'Set password for user'],
		},
		email: {
			type: String,
			match: emailRegexp,
			required: [true, 'Email is required'],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ['starter', 'pro', 'business'],
			default: 'starter',
		},

		token: {
			type: String,
		},
	},
	{ versionKey: false, timestamps: true }
);

userSchema.post('save', handleSaveError);

userSchema.pre('findOneAndUpdate', preUpdate);

userSchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', userSchema);

export default User;
