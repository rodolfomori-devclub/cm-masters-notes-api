import type { FastifyInstance } from 'fastify';
import { create } from './create';
import { find } from './find';
import { list } from './list';
import { remove } from './remove';
import { toggleLike } from './toggle-like';
import { update } from './update';

export async function articlesRoutes(app: FastifyInstance) {
	app.post('/articles', create);
	app.get('/articles', list);
	app.delete('/articles/:id', remove);
	app.get('/articles/:id', find);
	app.put('/articles/:id', update);
	app.patch('/articles/:id/likes', toggleLike);
}
