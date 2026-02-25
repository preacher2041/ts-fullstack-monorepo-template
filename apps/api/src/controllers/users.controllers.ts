import createError, { isHttpError } from 'http-errors';
import { NextFunction, Request, Response } from 'express';

import { createUser, deleteUser, fetchUser, updateUser, updateUserPassword } from '../services/users.services';

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await createUser(req.body);
		req.session.user = user

		res.status(200).json({
			status: 200,
			message: 'User created successfully',
			data: user
		})
	}
	catch (e: unknown) {
		next(isHttpError(e) ? e : createError(500));
	}
}

export const fetchUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await fetchUser(req);
		res.status(200).json({
			status: 200,
			message: 'User profile fetched successfully',
			user
		})
	}
	catch (e: unknown) {
		next(isHttpError(e) ? e : createError(500))
	}
}

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await deleteUser(req);
		res.status(200).json({
			status: 200,
			message: 'User deleted successfully',
		})
	}
	catch (e: unknown) {
		next(isHttpError(e) ? e : createError(500));
	}
}

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await updateUser(req);
		res.status(200).json({
			status: 200,
			message: 'User updated successfully',
			data: user
		})
	}
	catch (e: unknown) {
		next(isHttpError(e) ? e : createError(500));
	}
}

export const updateUserPasswordController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await updateUserPassword(req);
		res.status(200).json({
			status: 200,
			message: 'User updated successfully',
			data: user
		})
	}
	catch (e: unknown) {
		next(isHttpError(e) ? e : createError(500));
	}
}