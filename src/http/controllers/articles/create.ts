import type { FastifyReply, FastifyRequest } from 'fastify';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { Article } from '../../../database/models/article';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	// TODO validar dados de entrada do artigo

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const { title, subtitle, content, tags } = request.body as any; // TODO tipar dados de entrada do artigo

	const slug = slugify(title, {
		replacement: '-',
		remove: undefined,
		lower: true,
		strict: true,
		locale: 'vi',
		trim: true,
	});

	const author = {
		id: new Types.ObjectId(),
		name: 'Agustinho Neto',
	};

	// TODO verificar se slug já foi criado;

	const createdArticle = await Article.create({
		slug: `${slug}-${author.id}`, // TODO melhorar hash do slug
		title,
		subtitle,
		content,
		tags,
		author,
	});

	return reply.status(201).send(createdArticle);
}
