import express from 'express';

import { addAuthMiddleware } from '../middleware/auth';
import prisma from '../lib/db';
const router: express.Router = express.Router();

router.get('/', addAuthMiddleware, async (req, res) => {
	const userId = req.user && req.user.userId
	const campaigns = await prisma.campaign.findMany({
		where: {gmId:Number(userId)},
		include: {
			worlds: true
		}
	})
	res.json(campaigns)
})

router.get('/:id', async (req, res) => {
	const {id}: {id?: string} = req.params
	const campaign = await prisma.campaign.findUnique({
		where: {id:Number(id)},
		include: {
			worlds: true
		}
	})
	res.json(campaign)
})

export default router;