import type { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { User } from '../../../database/models/user';
import { BadRequestError } from '../../../errors/bad-request-error';
import { NotFoundError } from '../../../errors/not-found-error';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		title: z.string().max(255),
		subtitle: z.string().max(500),
		content: z.string(),
		tags: z.array(z.string().max(255)),
	});

	const data = schema.parse(request.body);

	const { title, content, subtitle, tags } = data;

	const slug = slugify(title, {
		replacement: '-',
		remove: undefined,
		lower: true,
		strict: true,
		locale: 'vi',
		trim: true,
	});

	const author = await User.findById(
		new Types.ObjectId((request.user as Record<string, unknown>).id as string),
	);

	if (!author) {
		throw new NotFoundError('User does not exists.');
	}

	author.password = undefined;

	const uniqueSlug = `${slug}-${author._id}`;

	const findArticles = await Article.find({ slug: uniqueSlug });

	if (findArticles.length > 0) {
		throw new BadRequestError('Article title already exists.');
	}

	const createdArticle = await Article.create({
		slug: uniqueSlug,
		title,
		subtitle,
		content,
		tags: tags.map((tag) => tag.toLowerCase().trim()),
		author,
	});

	return reply.status(201).send(createdArticle);
}
