import {  NextFunction, Request, Response, Router } from 'express'
import createError, { isHttpError } from 'http-errors'

import auth from './auth'
import users from './users'
import { mapPrismaError } from '../lib/prismaError'

const router: Router = Router()

router.use('/auth', auth);
router.use('/user', users)

router.use( async (_req, _res, next) => {
    next(createError.NotFound('Route not Found'))
})

router.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
	const mapped = mapPrismaError(err);
	const resolved = mapped ?? (isHttpError(err) ? err : createError(500));

	if (resolved.status >= 500) {
		console.error(`[${req.method} ${req.path}]`, err);
	}

	res.status(resolved.status).json({ status: resolved.status, message: resolved.message });
})

export default router
