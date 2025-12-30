import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (_req, res) => {
	const worlds = await prisma.world.findMany({
		include: {
			npcs: true,
			faction: true,
			location: true,
			pantheon: true,
		}		
	})
	res.json(worlds)
})

router.get('/:id', async (req, res) => {
	const {id}: {id?: string} = req.params
	const world = await prisma.world.findUnique({
		where: {id:Number(id)},
		include: {
			npcs: true,
			faction: true,
			location: true,
			pantheon: true,
		}		
	})
	res.json(world)
})

export default router;