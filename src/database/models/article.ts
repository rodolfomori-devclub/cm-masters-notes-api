import { Schema, model } from 'mongoose';
import { ArticleAuthorSchema } from './article-author';

const ArticleSchema = new Schema(
	{
		slug: String,
		title: String,
		subtitle: String,
		content: String,
		tags: [String],
		author: ArticleAuthorSchema,
		likes: [String],
	},
	{ timestamps: true, versionKey: false },
);

export const Article = model('Article', ArticleSchema);
