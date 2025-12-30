import { NextFunction, Response } from 'express';
import createError from 'http-errors';

export const addAuthMiddleware = async (req: any, _res: Response, next: NextFunction) => {
	if (!req.cookies) {
		return next(createError.Unauthorized('Access token is required'))
	}

	const {MySessionID} = req.cookies
	if (!MySessionID) {
		return next(createError.Unauthorized())
	}

	if (!req.session.user) {
		return next(createError.Unauthorized())
	}

	next();
}
