import type { FastifyInstance } from 'fastify';
import { create } from './create';

export async function articlesRoutes(app: FastifyInstance) {
	app.post('/articles', create);
}
