import createError from 'http-errors';
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
	catch (e: any) {
		next(createError(e.statusCode, e.message));
	}
}

export const fetchUserController = async (req: any, res: Response, next: NextFunction) => {
	try {
		const user = await fetchUser(req);
		res.status(200).json({
			status: 200,
			message: 'User profile fetched succesfully',
			user
		})
	}
	catch (e: any) {
		next(createError(e.statuscode, e.message))
	}
}

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await deleteUser(req);
		res.status(200).json({
			status: 200,
			message: 'User deleted succesfully',
		})
	}
	catch (e: any) {
		next(createError(e.statusCode, e.message));
	}
}

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await updateUser(req);
		res.status(200).json({
			status: 200,
			message: 'User updated succesfully',
			data: user
		})
	}
	catch (e: any) {
		next(createError(e.statusCode, e.message));
	}
}

export const updateUserPasswordController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await updateUserPassword(req);
		res.status(200).json({
			status: 200,
			message: 'User updated succesfully',
			data: user
		})
	}
	catch (e: any) {
		next(createError(e.statusCode, e.message));
	}
}