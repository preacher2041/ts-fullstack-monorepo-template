import express from 'express';

import { createUserController, deleteUserController, fetchUserController, updateUserController, updateUserPasswordController } from '../controllers/users.controllers';
import { addAuthMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/create', createUserController);

router.get('/me', addAuthMiddleware, fetchUserController);

router.put('/:id', addAuthMiddleware, updateUserController)

router.patch('/:id/password', addAuthMiddleware, updateUserPasswordController)

router.delete('/:id', addAuthMiddleware, deleteUserController)

export default router;