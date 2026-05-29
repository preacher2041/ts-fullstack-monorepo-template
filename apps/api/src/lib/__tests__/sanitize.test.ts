import { describe, it, expect } from 'vitest'
import { sanitizeError } from '../sanitize'

describe('sanitizeError', () => {
	it('should return null, undefined, or primitive values unchanged', () => {
		expect(sanitizeError(null)).toBeNull()
		expect(sanitizeError(undefined)).toBeUndefined()
		expect(sanitizeError(123)).toBe(123)
		expect(sanitizeError(true)).toBe(true)
	})

	it('should redact sensitive object fields', () => {
		const obj = {
			username: 'lee',
			password: 'super-secret-password',
			sessionToken: 'abcd1234',
			nested: {
				secretKey: 'my-private-key',
				regular: 'hello',
			},
		}

		const result = sanitizeError(obj) as any
		expect(result.username).toBe('lee')
		expect(result.password).toBe('[REDACTED]')
		expect(result.sessionToken).toBe('[REDACTED]')
		expect(result.nested.secretKey).toBe('[REDACTED]')
		expect(result.nested.regular).toBe('hello')
	})

	it('should sanitize elements in an array', () => {
		const arr = [{ password: '123' }, { username: 'lee', token: '456' }]

		const result = sanitizeError(arr) as any[]
		expect(result[0].password).toBe('[REDACTED]')
		expect(result[1].token).toBe('[REDACTED]')
		expect(result[1].username).toBe('lee')
	})

	it('should redact connection strings in strings', () => {
		const rawString =
			'Failed to connect to postgresql://user:password123@localhost:5432/my-db'
		expect(sanitizeError(rawString)).toBe(
			'Failed to connect to postgresql://user:[REDACTED]@localhost:5432/my-db'
		)
	})

	it('should redact sensitive keywords in inline JSON strings', () => {
		const jsonString =
			'{"message": "error", "password": "my-secret-password"}'
		expect(sanitizeError(jsonString)).toBe(
			'{"message": "error", "password": "[REDACTED]"}'
		)
	})

	it('should sanitize Error message, stack trace, and custom fields', () => {
		const err = new Error(
			'Database postgresql://admin:root@localhost:5432/db failed with password check'
		)
		;(err as any).password = 'admin-pass'
		;(err as any).safeVal = 'ok'

		const result = sanitizeError(err) as Error & Record<string, any>

		expect(result.message).toBe(
			'Database postgresql://admin:[REDACTED]@localhost:5432/db failed with password check'
		)
		expect(result.stack).toContain(
			'postgresql://admin:[REDACTED]@localhost:5432/db'
		)
		expect(result.password).toBe('[REDACTED]')
		expect(result.safeVal).toBe('ok')
	})

	it('should handle circular references safely', () => {
		const circularObj: any = {
			name: 'circular',
			password: '123',
		}
		circularObj.self = circularObj

		const result = sanitizeError(circularObj) as any
		expect(result.name).toBe('circular')
		expect(result.password).toBe('[REDACTED]')
		expect(result.self).toBe('[CIRCULAR]')
	})
})
