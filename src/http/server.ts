import fastify from 'fastify';
import { setupMongo } from '../database';
import { articlesRoutes } from './controllers/articles/route';

export const app = fastify();

setupMongo()
	.then(() => {
		app.register(articlesRoutes);

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
