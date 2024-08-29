import type { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { BadRequestError } from '../../../errors/bad-request-error';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		title: z.string().max(255),
		subtitle: z.string().max(500),
		content: z.string(),
		tags: z.array(z.string()),
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

	const author = {
		_id: new Types.ObjectId('66cfb76f0f7bd289c7b3e6bd'),
		name: 'Agustinho Neto',
	};

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
		tags,
		author,
	});

	return reply.status(201).send(createdArticle);
}
