import { compare } from 'bcryptjs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { User } from '../../../database/models/user';
import { UnauthorizedError } from '../../../errors/unauthorized-error';
import { app } from '../../server';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		email: z.string().email(),
		password: z.string(),
	});

	const data = schema.parse(request.body);

	const { email, password } = data;

	const [userExists] = await User.find({ email });

	if (!userExists) {
		throw new UnauthorizedError('Wrong credentials.');
	}

	const passwordMatches = await compare(password, String(userExists.password));

	if (!passwordMatches) {
		throw new UnauthorizedError('Wrong credentials.');
	}

	const token = app.jwt.sign({
		id: userExists._id.toString(),
	});

	return reply
		.status(201)
		.send({ token, fullName: userExists.fullName, email: userExists.email });
}
