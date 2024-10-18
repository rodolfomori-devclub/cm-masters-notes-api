import type { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { z } from 'zod';
import { Article } from '../../../database/models/article';
import { ForbiddenError } from '../../../errors/forbidden-error';
import { findArticleById } from './find';

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		id: z.string().length(24),
	});

	const params = paramsSchema.parse(request.params);

	const article = await findArticleById(params.id);

	// TODO use logged user
	const user = {
		_id: new Types.ObjectId('66cfb76f0f7bd289c7b3e6bd'),
		name: 'Agustinho Neto',
	};

	if (String(article.author?._id) !== user._id.toString()) {
		throw new ForbiddenError('This article is from another author.');
	}

	const bodySchema = z.object({
		title: z.string().max(255).optional(),
		subtitle: z.string().max(500).optional(),
		content: z.string().optional(),
		tags: z.array(z.string()).optional(),
	});

	const data = bodySchema.parse(request.body);

	const updateData: z.infer<typeof bodySchema> & { slug?: string } = {
		...data,
	};

	if (data.title) {
		const slug = slugify(data.title, {
			replacement: '-',
			remove: undefined,
			lower: true,
			strict: true,
			locale: 'vi',
			trim: true,
		});

		updateData.slug = `${slug}-${user._id}`;
	}

	const updatedArticle = await Article.findByIdAndUpdate(
		params.id,
		updateData,
		{
			new: true,
		},
	);

	return reply.status(200).send(updatedArticle);
}
