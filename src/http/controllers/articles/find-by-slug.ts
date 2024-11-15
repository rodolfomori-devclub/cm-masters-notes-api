import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { NotFoundError } from '../../../errors/not-found-error';

export async function findBySlug(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		slug: z.string().max(279),
	});

	const params = schema.parse(request.params);

	const [article] = await Article.find({ slug: params.slug });

	if (!article) {
		throw new NotFoundError('Article does not exists.');
	}

	return reply.status(200).send(article);
}
