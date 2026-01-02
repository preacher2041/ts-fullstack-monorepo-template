import bcrypt from 'bcryptjs';
import createError from 'http-errors';

import prisma from '../lib/db';

export const loginUser = async (data: any) => {
	const {email, password} = data;
	const user = await prisma.user.findUnique({
		where: {
			email
		}
	});

	if (!user) {
		throw createError.NotFound('User not found');
	}

	const checkPassword = bcrypt.compareSync(password, user.password);
	if (!checkPassword) throw createError.Unauthorized('Email address or password not valid');

	return {
		username: user.username,
		email: user.email,
		id: user.id,
	}
}