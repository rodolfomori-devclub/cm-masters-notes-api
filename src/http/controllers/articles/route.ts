import type { FastifyInstance } from 'fastify';
import { create } from './create';
import { list } from './list';
import { remove } from './remove';

export async function articlesRoutes(app: FastifyInstance) {
	app.post('/articles', create);
	app.get('/articles', list);
	app.delete('/articles/:id', remove);
}
