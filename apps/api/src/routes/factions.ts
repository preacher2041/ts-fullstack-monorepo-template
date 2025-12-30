import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (_req, res) => {
	const factions = await prisma.faction.findMany({
		include: {
			leader: true,
			notableMembers: true,
			location: true,
		}
	})
	res.json(factions)
})

router.get('/:id', async (req, res) => {
	const {id}: {id?:String} = req.params
	const faction = await prisma.faction.findUnique({
		where: {id:Number(id)},
		include: {
			leader: true,
			notableMembers: true,
			location: true
		}
	})
	res.json(faction)
})

export default router;