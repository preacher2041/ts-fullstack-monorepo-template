import express from 'express';

import { getCurrentSessionController, loginUserController, logoutUserController } from '../controllers/auth.controllers';

import { addAuthMiddleware } from '../middleware/auth';

const router = express.Router();

router.post('/login', loginUserController);
router.post('/logout', logoutUserController);
router.get('/session', addAuthMiddleware, getCurrentSessionController);

export default router;