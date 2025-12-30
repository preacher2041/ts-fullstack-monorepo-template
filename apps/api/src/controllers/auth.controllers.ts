import createError from 'http-errors';
import { NextFunction, Request, Response } from 'express';

import { loginUser } from '../services/auth.services';

export const getCurrentSessionController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = req.session.user;
		const authenticated = data ? true : false;
		
		res.status(200).json({
			authenticated
		})
	}

	catch (e: any) {
		next(createError(e.statusCode, e.message))
	}
} 

export const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const data = await loginUser(req.body)

		req.session.user = data;
		res.status(200).json({
			status: 200,
			message: 'Account login successful',
			userId: data.id
		})
	}
	catch (e: any) {
		next(createError(e.statusCode, e.message))
	}
}

export const logoutUserController = (_req: Request, res: Response) => {
	res.clearCookie('MySessionID')
	res.status(200).json({
		status: 200,
		message: 'Account logout successful',
	})
}