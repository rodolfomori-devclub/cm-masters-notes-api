import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { NotFoundError } from '../../../errors/not-found-error';

export async function findArticleById(id: string) {
	const article = await Article.findById(id);

	if (!article) {
		throw new NotFoundError('Article does not exists.');
	}

	return article;
}

export async function find(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		id: z.string().length(24),
	});

	const params = schema.parse(request.params);

	const article = await findArticleById(params.id);

	return reply.status(200).send(article);
}
