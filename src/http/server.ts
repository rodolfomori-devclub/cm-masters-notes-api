import fastify from 'fastify';
import { ZodError } from 'zod';
import { setupMongo } from '../database';
import { AppError } from '../errors/app-error';
import { articlesRoutes } from './controllers/articles/route';

export const app = fastify();

setupMongo()
	.then(() => {
		app.register(articlesRoutes);

		app.setErrorHandler((error, _, reply) => {
			if (error instanceof ZodError) {
				return reply
					.status(400)
					.send({ message: 'Validation error.', issues: error.format() });
			}

			if (error instanceof AppError) {
				return reply.status(error.statusCode).send({ message: error.message });
			}

			console.log(error);

			return reply.status(500).send({ message: 'Internal server error.' });
		});

		app
			.listen({
				host: '0.0.0.0',
				port: 4000,
			})
			.then(() => {
				console.log('🚀 Server is running at port 4000...');
			});
	})
	.catch((err) => {
		console.log(err);
	});
