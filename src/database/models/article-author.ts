import { Schema, Types } from 'mongoose';

export const ArticleAuthorSchema = new Schema(
	{
		id: Types.ObjectId,
		name: String,
	},
	{ timestamps: true, versionKey: false },
);
