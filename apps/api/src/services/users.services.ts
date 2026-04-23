import bcrypt from 'bcryptjs'
import createError from 'http-errors'
import { Prisma } from '@prisma/client'

import prisma from '../lib/db'

export const createUser = async (data: Prisma.UserCreateInput) => {
	data.password = bcrypt.hashSync(data.password, 8)
	if (data.dob) {
		data.dob = new Date(data.dob as string)
	}
	const user = await prisma.user.create({
		data,
	})

	return {
		id: user.id,
		username: user.username,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		dob: user.dob,
	}
}

export const fetchUser = async (userId: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	})

	if (!user) {
		throw createError.NotFound('User not found')
	}

	return {
		username: user.username,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		dob: user.dob,
	}
}

export const updateUser = async (
	userId: string,
	sessionId: string,
	data: {
		username?: string
		email?: string
		firstName?: string
		lastName?: string
		dob?: string
	}
) => {
	if (userId !== sessionId) {
		throw createError.Forbidden('You can only update your own profile')
	}

	const user = await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			username: data.username,
			email: data.email,
			firstName: data.firstName,
			lastName: data.lastName,
			dob: data.dob ? new Date(data.dob) : undefined,
		},
	})

	if (!user) {
		throw createError.NotFound('User not found')
	}

	return {
		username: user.username,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		dob: user.dob,
	}
}

export const updateUserPassword = async (
	userId: string,
	sessionId: string,
	currentPassword: string,
	newPassword: string
) => {
	if (userId !== sessionId) {
		throw createError.Forbidden('You can only change your own password')
	}

	const user = await prisma.user.findUnique({
		where: {
			id: userId,
		},
	})

	if (!user) {
		throw createError.NotFound('User not found')
	}

	const checkPassword = bcrypt.compareSync(currentPassword, user.password)

	if (!checkPassword) {
		throw createError.Unauthorized('Passwords do not match')
	} else {
		await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				password: bcrypt.hashSync(newPassword, 8),
			},
		})
	}
}

export const deleteUser = async (userId: string, sessionId: string) => {
	if (userId !== sessionId) {
		throw createError.Forbidden('You can only update your own profile')
	}

	const user = await prisma.user.delete({
		where: {
			id: userId,
		},
	})

	if (!user) {
		throw createError.NotFound('User not found')
	}
}
