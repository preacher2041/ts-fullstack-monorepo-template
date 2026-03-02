import {  NextFunction, Request, Response, Router } from 'express'
import createError, { isHttpError } from 'http-errors'

import auth from './auth'
import users from './users'

const router: Router = Router()

router.use('/auth', auth);
router.use('/user', users)

router.use( async (_req, _res, next) => {
    next(createError.NotFound('Route not Found'))
})

router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
	const status = isHttpError(err) ? err.status : 500;
	const message = err instanceof Error ? err.message : 'Internal Server Error';
	res.status(status).json({ status, message });
})

export default router
