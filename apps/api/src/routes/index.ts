import {  NextFunction, Request, Response, Router } from 'express'
import createError from 'http-errors'

import auth from './auth'
import campaigns from './campaigns'
import factions from './factions'
import locations from './locations'
import npcs from './npcs'
import pantheons from './pantheons'
import users from './users'
import worlds from './worlds'

const router = Router()

router.use('/auth', auth);
router.use('/campaign', campaigns)
router.use('/faction', factions)
router.use('/location', locations)
router.use('/npc', npcs)
router.use('/pantheon', pantheons)
router.use('/user', users)
router.use('/world', worlds)

router.use( async (_req, _res, next) => {
    next(createError.NotFound('Route not Found'))
})

router.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
	res.status(err.status || 500).json({
		status: err.status || 500,
		message: err.message
	})
})

export default router
