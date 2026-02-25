import express from 'express';

import prisma from '../lib/db';
const router: express.Router = express.Router();

router.get('/', async (_req, res) => {
	const pantheons = await prisma.pantheon.findMany({
		include: {
			deity: true
		}
	})
	res.json(pantheons)
})

router.get('/:id', async (req, res) => {
	const {id}: {id?:string} = req.params
	const pantheon = await prisma.pantheon.findUnique({
		where: {id:Number(id)},
		include: {
			deity: true
		}
	})
	res.json(pantheon)
})

router.get('/deities', async (_req, res) => {
	const deities = await prisma.deity.findMany({
		include: {
			alignment: true,
			pantheon: true,
		}
	})
	res.json(deities)
})

router.get('/deities/:id', async (req, res) => {
	const {id}: {id?:string} = req.params
	const deity = await prisma.deity.findUnique({
		where: {id:Number(id)},
		include: {
			alignment: true,
			pantheon: true,
		}
	})
	res.json(deity)
})


router.get('/alignments', async (_req, res) => {
	const alignment = await prisma.alignment.findMany({
		include: {
			deities: true
		}
	})
	res.json(alignment)
})

router.get('/alignments/:id', async (req, res) => {
	const {id}: {id?:string} = req.params
	const alignment = await prisma.alignment.findUnique({
		where: {id:Number(id)},
		include: {
			deities: true
		}
	})
	res.json(alignment)
})

export default router;