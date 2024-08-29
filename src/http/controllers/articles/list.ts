import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		title: z.string().max(255).optional(),
	});

	const filters = schema.parse(request.query);

	const { title } = filters;

	const articles = await Article.find(
		{
			...(title && {
				title: {
					$regex: title,
					$options: 'i',
				},
			}),
		},
		{
			content: 0,
		},
	);

	return reply.status(200).send({ data: articles });
}
