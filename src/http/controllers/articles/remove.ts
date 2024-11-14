import type { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { User } from '../../../database/models/user';
import { ForbiddenError } from '../../../errors/forbidden-error';
import { NotFoundError } from '../../../errors/not-found-error';
import { findArticleById } from './find';

export async function remove(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		id: z.string().length(24),
	});

	const params = schema.parse(request.params);

	const article = await findArticleById(params.id);

	const user = await User.findById(
		new Types.ObjectId((request.user as Record<string, unknown>).id as string),
	);

	if (!user) {
		throw new NotFoundError('User does not exists.');
	}

	if (String(article.author?._id) !== user._id.toString()) {
		throw new ForbiddenError('This article is from another author.');
	}

	await Article.findByIdAndDelete(params.id);

	return reply.status(204).send();
}
