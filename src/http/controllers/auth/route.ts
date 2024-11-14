import type { FastifyInstance } from 'fastify';
import { create } from './create';

export async function authRoutes(app: FastifyInstance) {
	app.post('/auth', create);
}
