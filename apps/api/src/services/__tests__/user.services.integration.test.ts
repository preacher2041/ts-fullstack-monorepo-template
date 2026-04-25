import { describe, it, expect } from 'vitest'
import { createUser, deleteUser, fetchUser } from '../users.services'
import { loginUser } from '../auth.services'

const testUser = {
	email: 'integration@test.com',
	password: 'password123',
	username: 'integrationuser',
	firstName: 'Integration',
	lastName: 'Test',
	dob: new Date('1990-01-01'),
}

describe('createUser + fetchUser', () => {
	it('persists a user and retrieves them by id', async () => {
		const user = await createUser({ ...testUser })
		const fetchedUser = await fetchUser(user.id)

		expect(fetchedUser.email).toEqual(user.email)
		expect(fetchedUser.username).toEqual(user.username)
	})

	it('does not return a password on create', async () => {
		const user = await createUser({ ...testUser })
		expect(user).not.toHaveProperty('password')
	})
})

describe('fetchUser', () => {
	it('throws a 404 for an unknown id', async () => {
		await expect(fetchUser('non-existent-id')).rejects.toMatchObject({
			status: 404,
		})
	})
})

describe('loginUser', () => {
	it('returns a uer without a password when credentials are correct', async () => {
		await createUser({ ...testUser })
		const loggedInUser = await loginUser({
			email: testUser.email,
			password: testUser.password,
		})

		expect(loggedInUser).toHaveProperty('email', testUser.email)
		expect(loggedInUser).not.toHaveProperty('password')
	})

	it('throws a 401 error when password is incorrect', async () => {
		await createUser({ ...testUser })
		await expect(
			loginUser({
				email: testUser.email,
				password: 'wrongpassword',
			})
		).rejects.toMatchObject({
			status: 401,
		})
	})

	it('throws a 404 error when email is not found', async () => {
		await expect(
			loginUser({
				email: 'non-existent@test.com',
				password: 'password123',
			})
		).rejects.toMatchObject({
			status: 404,
		})
	})
})

describe('deleteUser', () => {
	it('deletes a user so they can no longer be fetched', async () => {
		const user = await createUser({ ...testUser })
		await deleteUser(user.id, user.id)
		await expect(fetchUser(user.id)).rejects.toMatchObject({
			status: 404,
		})
	})

	it('throws a 403 when userId does not match sessionId', async () => {
		const user = await createUser({ ...testUser })
		await expect(
			deleteUser(user.id, 'different-session-id')
		).rejects.toMatchObject({
			status: 403,
		})
	})
})
