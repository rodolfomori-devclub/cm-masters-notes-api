import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';

export async function listMy(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		title: z.string().max(255).optional(),
		tags: z.string().max(255).optional(),
		page: z.coerce.number().positive().optional(),
	});

	const filters = schema.parse(request.query);

	const { title, tags, page } = filters;

	const pageLimit = 10;
	const pageNumber = page ?? 1;
	const offset = pageLimit * (pageNumber - 1);

	const query = {
		'author._id': (request.user as Record<string, unknown>).id as string,
		...(title && {
			title: {
				$regex: title,
				$options: 'i',
			},
		}),
		...(tags && {
			tags: {
				$all: tags.split(',').map((tag) => tag.toLowerCase().trim()),
			},
		}),
	};

	const articles = await Article.find(query, {
		content: 0,
	})
		.skip(offset)
		.limit(pageLimit);

	const articlesCount = await Article.find(query).countDocuments();

	return reply.status(200).send({
		data: articles,
		page: {
			number: pageNumber,
			totalPages: Math.ceil(articlesCount / pageLimit),
			items: articles.length,
			totalItems: articlesCount,
		},
	});
}
