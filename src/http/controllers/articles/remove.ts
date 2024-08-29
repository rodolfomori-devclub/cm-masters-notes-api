import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { NotFoundError } from '../../../errors/not-found-error';

export async function remove(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		id: z.string().length(24),
	});

	const params = schema.parse(request.params);

	const findArticle = await Article.findById(params.id);

	if (!findArticle) {
		throw new NotFoundError('Article does not exists.');
	}

	await Article.findByIdAndDelete(params.id);

	return reply.status(204).send();
}
