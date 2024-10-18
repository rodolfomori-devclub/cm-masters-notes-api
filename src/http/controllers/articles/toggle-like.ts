import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { findArticleById } from './find';

export async function toggleLike(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		id: z.string().length(24),
	});

	const params = paramsSchema.parse(request.params);

	const article = await findArticleById(params.id);

	const bodySchema = z.object({
		fingerprint: z.string().length(32),
	});

	const data = bodySchema.parse(request.body);

	const findLike = article.likes.find((like) => like === data.fingerprint);

	if (findLike) {
		await Article.findByIdAndUpdate(params.id, {
			$pull: {
				likes: data.fingerprint,
			},
		});

		return reply.status(204).send();
	}

	await Article.findByIdAndUpdate(params.id, {
		$push: {
			likes: data.fingerprint,
		},
	});

	return reply.status(204).send();
}
