import { hash } from 'bcryptjs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { User } from '../../../database/models/user';
import { BadRequestError } from '../../../errors/bad-request-error';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const schema = z.object({
		fullName: z.string().max(255),
		email: z.string().email(),
		password: z.string().min(8).max(255),
	});

	const data = schema.parse(request.body);

	const { email, fullName, password } = data;

	const [userAlreadyExists] = await User.find({ email });

	if (userAlreadyExists) {
		throw new BadRequestError('User already exists.');
	}

	const passwordHash = await hash(password, 6);

	const createdUser = await User.create({
		email,
		fullName,
		password: passwordHash,
	});

	createdUser.password = undefined;

	return reply.status(201).send(createdUser);
}
