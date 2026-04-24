import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../lib/db', () => ({
	default: {
		user: {
			findUnique: vi.fn(),
		},
	},
}))

vi.mock('bcryptjs', () => ({
	default: {
		compareSync: vi.fn(),
		hashSync: vi.fn(),
	},
}))

import { loginUser } from '../auth.services'
import prisma from '../../lib/db'
import bcrypt from 'bcryptjs'

const mockUser = {
	id: 'user-1',
	email: 'test@example.com',
	password: 'hashedpassword',
	username: 'testuser',
	firstName: 'Test',
	lastName: 'User',
	dob: new Date('1990-01-01'),
	createdAt: new Date(),
	updatedAt: new Date(),
}

describe('loginuser', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('throws 404 when user is not found', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

		await expect(
			loginUser({
				email: 'test@example.com',
				password: 'password',
			})
		).rejects.toMatchObject({ status: 404 })
	})

	it('throws 401 when password does not match', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
		vi.mocked(bcrypt.compareSync).mockReturnValue(false)

		await expect(
			loginUser({
				email: 'test@example.com',
				password: 'wrongpassword',
			})
		).rejects.toMatchObject({ status: 401 })
	})

	it('returns data on valid credentials', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
		vi.mocked(bcrypt.compareSync).mockReturnValue(true)

		const result = await loginUser({
			email: 'test@example.com',
			password: 'password',
		})

		expect(result).toEqual({
			id: mockUser.id,
			email: mockUser.email,
			username: mockUser.username,
		})
	})
})
