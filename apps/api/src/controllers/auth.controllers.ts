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

	catch (e: unknown) {
		next(e);
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
	catch (e: unknown) {
		next(e);
	}
}

export const logoutUserController = (req: Request, res: Response, next: NextFunction) => {
	req.session.destroy((err) => {
		if (err) return next(err);
		res.clearCookie('MySessionID');
		res.status(200).json({
			status: 200,
			message: 'Account logout successful',
		});
	});
}