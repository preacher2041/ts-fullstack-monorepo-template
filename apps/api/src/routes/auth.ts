import express from 'express'
import { loginSchema } from '@template/schemas'

import {
	getCurrentSessionController,
	loginUserController,
	logoutUserController,
} from '../controllers/auth.controllers'
import { addAuthMiddleware } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router: express.Router = express.Router()

router.post('/login', validate(loginSchema), loginUserController)
router.post('/logout', logoutUserController)
router.get('/session', addAuthMiddleware, getCurrentSessionController)

export default router
