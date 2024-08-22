import fastify from 'fastify';

const app = fastify();

app.get('/', (_, reply) => {
	return reply.status(200).send({ message: 'Hello World!' });
});

app
	.listen({
		host: '0.0.0.0',
		port: 4000,
	})
	.then(() => {
		console.log('🚀 Server is running at port 4000...');
	});
