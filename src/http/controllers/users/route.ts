import type { FastifyInstance } from 'fastify';
import { create } from './create';

export async function usersRoutes(app: FastifyInstance) {
	app.post('/users', create);
}
