import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
	{
		fullName: String,
		email: String,
		password: String,
	},
	{ timestamps: true, versionKey: false },
);

export const User = model('User', UserSchema);
