import { Schema, Types } from 'mongoose';

export const ArticleAuthorSchema = new Schema(
	{
		_id: Types.ObjectId,
		name: String,
	},
	{ timestamps: false, versionKey: false, _id: false },
);
