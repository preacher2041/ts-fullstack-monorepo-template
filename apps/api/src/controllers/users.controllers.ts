import { NextFunction, Request, Response } from 'express'

import {
	createUser,
	deleteUser,
	fetchUser,
	updateUser,
	updateUserPassword,
} from '../services/users.services'

export const createUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await createUser(req.body)
		await new Promise<void>((resolve, reject) =>
			req.session.regenerate((err) => (err ? reject(err) : resolve()))
		)
		req.session.user = user

		res.status(200).json({
			status: 200,
			message: 'User created successfully',
			data: user,
		})
	} catch (e: unknown) {
		next(e)
	}
}

export const fetchUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await fetchUser(req.session.user!.id)
		res.status(200).json({
			status: 200,
			message: 'User profile fetched successfully',
			user,
		})
	} catch (e: unknown) {
		next(e)
	}
}

export const deleteUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		await deleteUser(req.params.id, req.session.user!.id)
		res.status(200).json({
			status: 200,
			message: 'User deleted successfully',
		})
	} catch (e: unknown) {
		next(e)
	}
}

export const updateUserController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await updateUser(
			req.params.id,
			req.session.user!.id,
			req.body
		)
		res.status(200).json({
			status: 200,
			message: 'User updated successfully',
			data: user,
		})
	} catch (e: unknown) {
		next(e)
	}
}

export const updateUserPasswordController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await updateUserPassword(
			req.params.id,
			req.session.user!.id,
			req.body.current_password,
			req.body.new_password
		)
		res.status(200).json({
			status: 200,
			message: 'User updated successfully',
			data: user,
		})
	} catch (e: unknown) {
		next(e)
	}
}
