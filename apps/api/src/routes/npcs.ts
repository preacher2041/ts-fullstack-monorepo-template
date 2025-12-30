import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (_req, res) => {
	const npcs = await prisma.npc.findMany({
		include: {
			factionLed: true,
			factions: true,
			location: true,
		}
	})
	res.json(npcs)
})

router.get('/:id', async (req, res) => {
	const {id}: {id?:String} = req.params
	const npc = await prisma.npc.findUnique({
		where: {id:Number(id)},
		include: {
			factionLed: true,
			factions: true,
			location: true,
			relationship: true
		}
	})
	res.json(npc)
})

router.get('/relationships', async (_req, res) => {
	const relationships = await prisma.relationship.findMany({
		include: {
			relationshipType: true,
			npcs: true
		}
	})
	res.json(relationships)
})

router.get('/relationships/:id', async (req, res) => {
	const {id}: {id:String} = req.params
	const relationship = await prisma.relationship.findUnique({
		where: {id:Number(id)},
		include: {
			relationshipType: true,
			npcs: true
		}
	})
	res.json(relationship)
})

router.get('/relationship-types', async (_req, res) => {
	const relationshipTypes = await prisma.relationshipType.findMany({
		include: {
			relationship: {
				include: {
					npcs: true
				}
			}
		}
	})
	res.json(relationshipTypes)
})

router.get('/relationship-type/:id', async (req, res) => {
	const {id}: {id?: String} = req.params
	const relationshipType = await prisma.relationshipType.findUnique({
		where: {id:Number(id)},
		include: {
			relationship: {
				include: {
					npcs: true
				}
			}
		}
	})
	res.json(relationshipType)
})

export default router;