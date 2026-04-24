import bcrypt from 'bcryptjs'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
	createUser,
	fetchUser,
	updateUser,
	updateUserPassword,
	deleteUser,
} from '../users.services'
import prisma from '../../lib/db'
import { mock } from 'node:test'
import { email } from 'zod'

vi.mock('../../lib/db', () => ({
	default: {
		user: {
			findUnique: vi.fn(),
			create: vi.fn(),
			update: vi.fn(),
			delete: vi.fn(),
		},
	},
}))

vi.mock('bcryptjs', () => ({
	default: {
		hashSync: vi.fn((val: string) => `hashed-${val}`),
		compareSync: vi.fn(),
	},
}))

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

beforeEach(() => {
	vi.clearAllMocks()
})

describe('createUser', () => {
	it('creates a new user with hashed password', async () => {
		vi.mocked(prisma.user.create).mockResolvedValue(mockUser)

		await createUser({
			...mockUser,
			password: 'password',
		})

		expect(bcrypt.hashSync).toHaveBeenCalledWith('password', 8)
	})

	it('returns a user without a pasword', async () => {
		vi.mocked(prisma.user.create).mockResolvedValue(mockUser)

		const result = await createUser({
			...mockUser,
			password: 'password',
		})

		expect(result).not.toHaveProperty('password')
		expect(result).toMatchObject({
			id: mockUser.id,
			username: mockUser.username,
			email: mockUser.email,
		})
	})
})

describe('fetchUser', () => {
	it('throws 404 when user is not found', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

		await expect(fetchUser('missing-id')).rejects.toMatchObject({
			status: 404,
		})
	})

	it('returns user without password', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)

		const result = await fetchUser(mockUser.id)

		expect(result).not.toHaveProperty(mockUser.password)
		expect(result).toMatchObject({
			username: mockUser.username,
			email: mockUser.email,
		})
	})
})

describe('updateUser', () => {
	it('throws 403 when userId does not match sessionId', async () => {
		await expect(
			updateUser(mockUser.id, 'other-session-id', {})
		).rejects.toMatchObject({ status: 403 })
	})

	it('returns update user without password', async () => {
		vi.mocked(prisma.user.update).mockResolvedValue({
			...mockUser,
			username: 'updatedUser',
		})

		const result = await updateUser(mockUser.id, mockUser.id, {
			username: 'updatedUser',
		})

		expect(result).not.toHaveProperty('password')
		expect(result.username).toBe('updatedUser')
	})
})

describe('updateUserPassword', () => {
	it('throws 403 when userId does not match sessionId', async () => {
		await expect(
			updateUserPassword(
				mockUser.id,
				'other-session.id',
				mockUser.password,
				'newpassword'
			)
		).rejects.toMatchObject({ status: 403 })
	})

	it('throws 404 when user is not found', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

		await expect(
			updateUserPassword(
				mockUser.id,
				mockUser.id,
				mockUser.password,
				'newpassword'
			)
		).rejects.toMatchObject({ status: 404 })
	})

	it('throws a 401 when current password does not match', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
		vi.mocked(bcrypt.compareSync).mockReturnValue(false)

		await expect(
			updateUserPassword(
				mockUser.id,
				mockUser.id,
				'wrongpassword',
				'newpassword'
			)
		).rejects.toMatchObject({ status: 401 })
	})

	it('updates password when credentials are valid', async () => {
		vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser)
		vi.mocked(bcrypt.compareSync).mockReturnValue(true)

		await updateUserPassword(
			mockUser.id,
			mockUser.id,
			mockUser.password,
			'newpassword'
		)

		expect(prisma.user.update).toHaveBeenCalledWith(
			expect.objectContaining({
				where: { id: mockUser.id },
			})
		)
	})
})

describe('deleteUser', () => {
	it('throws 403 when userId does not match sessionId', async () => {
		await expect(
			deleteUser(mockUser.id, 'other-sessionid')
		).rejects.toMatchObject({ status: 403 })
	})

	it('deletes the user when ownership matches', async () => {
		vi.mocked(prisma.user.delete).mockResolvedValue(mockUser)

		await deleteUser(mockUser.id, mockUser.id)

		expect(prisma.user.delete).toHaveBeenCalledWith({
			where: { id: mockUser.id },
		})
	})
})
