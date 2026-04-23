import express from 'express'
import {
	createUserSchema,
	updateUserSchema,
	updateUserPasswordSchema,
} from '@template/schemas'

import {
	createUserController,
	deleteUserController,
	fetchUserController,
	updateUserController,
	updateUserPasswordController,
} from '../controllers/users.controllers'
import { addAuthMiddleware } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router: express.Router = express.Router()

router.post('/', validate(createUserSchema), createUserController)
router.get('/me', addAuthMiddleware, fetchUserController)
router.put(
	'/:id',
	addAuthMiddleware,
	validate(updateUserSchema),
	updateUserController
)
router.patch(
	'/:id/password',
	addAuthMiddleware,
	validate(updateUserPasswordSchema),
	updateUserPasswordController
)
router.delete('/:id', addAuthMiddleware, deleteUserController)

export default router
