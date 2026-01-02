import express from 'express';

import prisma from '../lib/db';
const router = express.Router();

router.get('/', async (_req, res) => {
	const locations = await prisma.location.findMany({
		include: {
			locationTypes: true,
			child: true,
			parent: true,
			factions: true,
			npcs: true,
			deities: true
		}
	})
	res.json(locations)
})

router.get('/:id', async (req, res) => {
	const {id}: {id?:String} = req.params
	const location = await prisma.location.findUnique({
		where: {id:Number(id)},
		include: {
			locationTypes: true,
			child: true,
			parent: true,
			factions: true,
			npcs: true,
			deities: true
		}
	})
	res.json(location)
})

router.get('/types', async (_req, res) => {
	const locationTypes = await prisma.locationType.findMany({
		include: {
			location: true
		}
	})
	res.json(locationTypes)
})

router.get('/types/:id', async (req, res) => {
	const {id}: {id: String} = req.params
	const locationType = await prisma.locationType.findUnique({
		where: {id:Number(id)},
		include: {
			location: true
		}
	})
	res.json(locationType)
})

export default router;