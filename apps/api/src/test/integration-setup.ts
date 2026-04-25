import { afterEach } from 'vitest'
import prisma from '../lib/db'

afterEach(async () => {
	await prisma.user.deleteMany()
})
