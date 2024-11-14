import type { FastifyInstance } from 'fastify';
import { verifyJWT } from '../../middlewares/verify-jwt';
import { create } from './create';
import { find } from './find';
import { list } from './list';
import { remove } from './remove';
import { toggleLike } from './toggle-like';
import { update } from './update';

export async function articlesRoutes(app: FastifyInstance) {
	app.get('/articles', list);
	app.get('/articles/:id', find);
	app.patch('/articles/:id/likes', toggleLike);

	app.post('/articles', { onRequest: verifyJWT }, create);
	app.delete('/articles/:id', { onRequest: verifyJWT }, remove);
	app.put('/articles/:id', { onRequest: verifyJWT }, update);
}
