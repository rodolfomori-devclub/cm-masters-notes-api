import type { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { ForbiddenError } from '../../../errors/forbidden-error';
import { findArticleById } from './find';

export async function remove(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		id: z.string().length(24),
	});

	const params = schema.parse(request.params);

	const article = await findArticleById(params.id);

	// TODO use logged user
	const user = {
		_id: new Types.ObjectId('66cfb76f0f7bd289c7b3e6bd'),
		name: 'Agustinho Neto',
	};

	if (String(article.author?._id) !== user._id.toString()) {
		throw new ForbiddenError('This article is from another author.');
	}

	await Article.findByIdAndDelete(params.id);

	return reply.status(204).send();
}
