import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import createError from 'http-errors';

import 'dotenv/config';

const prisma = new PrismaClient();

export const createUser = async (data: any) => {
	data.password = bcrypt.hashSync(data.password, 8);
	const user = await prisma.user.create({
		data
	})

	return user;
}

export const fetchUser = async (req: any) => {
	const userId = parseInt(req.session.user.id);
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});

	if (!user) {
		throw createError.NotFound('User not found');
	}

	return {
		username: user.username,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		dob: user.dob,
	};
}

export const updateUser = async (req: any) => {
	const userId = parseInt(req.params.id);
	const user = await prisma.user.update({
		where: {
			id: userId
		},
		data: {
			username: req.body.username,
			email: req.body.email,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			dob: req.body.dob
		}
	});

	if (!user) {
		throw createError.NotFound('User not found');
	}

	return {
		username: user.username,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		dob: user.dob,
	};;
}

export const updateUserPassword = async (req: any) => {
	const {current_password, new_password} = req.body;
	const userId = parseInt(req.params.id);
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	});

	if (!user) {
		throw createError.NotFound('User not found');
	}

	const checkPassword = bcrypt.compareSync(current_password, user.password);
	
	if (!checkPassword) {
		throw createError.Unauthorized('Passwords do not match');
	} else {

		await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				password: bcrypt.hashSync(new_password, 8)
			}
		})
	}
}

export const deleteUser = async (req: any) => {
	const userId = parseInt(req.params.id);
	const user = await prisma.user.delete({
		where: {
			id: userId
		}
	});

	if (!user) {
		throw createError.NotFound('User not found');
	}
}