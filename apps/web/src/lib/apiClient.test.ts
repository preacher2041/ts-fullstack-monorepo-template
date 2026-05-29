import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from './apiClient'

// Mock the router
vi.mock('./router', () => ({
	router: {
		navigate: vi.fn(),
	},
}))

import { router } from './router'

describe('apiClient', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		vi.stubEnv('VITE_API_URL', 'http://localhost:3000')
		vi.stubEnv('VITE_API_URL_PREFIX', '/api/v1')
	})

	it('should make a successful JSON request and return parsed JSON', async () => {
		const mockResponse = { data: 'success' }
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			json: async () => mockResponse,
		})
		vi.stubGlobal('fetch', fetchMock)

		const result = await apiClient<typeof mockResponse>('/test')

		expect(fetchMock).toHaveBeenCalledWith(
			'http://localhost:3000/api/v1/test',
			{
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			}
		)
		expect(result).toEqual(mockResponse)
	})

	it('should handle 401 Unauthorized by navigating to login and throwing Error', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 401,
			headers: new Headers({ 'content-type': 'application/json' }),
		})
		vi.stubGlobal('fetch', fetchMock)

		await expect(apiClient('/test')).rejects.toThrow('Unauthorized')
		expect(router.navigate).toHaveBeenCalledWith({ to: '/login' })
	})

	it('should handle JSON error responses by throwing the parsed JSON directly', async () => {
		const errorResponse = {
			error: 'Invalid credentials',
			code: 'INVALID_CREDS',
		}
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 400,
			headers: new Headers({
				'content-type': 'application/json; charset=utf-8',
			}),
			json: async () => errorResponse,
		})
		vi.stubGlobal('fetch', fetchMock)

		await expect(apiClient('/test')).rejects.toEqual(errorResponse)
	})

	it('should handle HTML error responses gracefully by throwing standard error shape', async () => {
		const htmlContent = '<html><body>502 Bad Gateway</body></html>'
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 502,
			statusText: 'Bad Gateway',
			headers: new Headers({ 'content-type': 'text/html' }),
			text: async () => htmlContent,
			json: async () => {
				throw new SyntaxError(
					'Unexpected token < in JSON at position 0'
				)
			},
		})
		vi.stubGlobal('fetch', fetchMock)

		await expect(apiClient('/test')).rejects.toEqual({
			status: 502,
			message: htmlContent,
		})
	})

	it('should handle text error responses gracefully by throwing standard error shape', async () => {
		const textContent = 'Internal Server Error'
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			statusText: 'Internal Server Error',
			headers: new Headers({ 'content-type': 'text/plain' }),
			text: async () => textContent,
			json: async () => {
				throw new SyntaxError('Unexpected token I in JSON')
			},
		})
		vi.stubGlobal('fetch', fetchMock)

		await expect(apiClient('/test')).rejects.toEqual({
			status: 500,
			message: textContent,
		})
	})

	it('should handle missing content-type header correctly by throwing standard error shape', async () => {
		const textContent = 'Fallback plain text'
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			statusText: 'Internal Server Error',
			headers: new Headers(), // No content-type
			text: async () => textContent,
		})
		vi.stubGlobal('fetch', fetchMock)

		await expect(apiClient('/test')).rejects.toEqual({
			status: 500,
			message: textContent,
		})
	})

	it('should fallback to statusText if body reading fails', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 503,
			statusText: 'Service Unavailable',
			headers: new Headers({ 'content-type': 'text/plain' }),
			text: async () => {
				throw new Error('Stream error')
			},
		})
		vi.stubGlobal('fetch', fetchMock)

		await expect(apiClient('/test')).rejects.toEqual({
			status: 503,
			message: 'Service Unavailable',
		})
	})

	it('should fallback to default error message if everything else is missing', async () => {
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
			headers: new Headers(),
			text: async () => {
				throw new Error('Stream error')
			},
		})
		vi.stubGlobal('fetch', fetchMock)

		await expect(apiClient('/test')).rejects.toEqual({
			status: 500,
			message: 'An error occurred',
		})
	})

	it('should handle json content-type but malformed json correctly', async () => {
		const malformedJson = '{malformed}'
		const fetchMock = vi.fn().mockResolvedValue({
			ok: false,
			status: 400,
			statusText: 'Bad Request',
			headers: new Headers({ 'content-type': 'application/json' }),
			json: async () => {
				throw new SyntaxError('Unexpected token m')
			},
			text: async () => malformedJson,
		})
		vi.stubGlobal('fetch', fetchMock)

		await expect(apiClient('/test')).rejects.toEqual({
			status: 400,
			message: malformedJson,
		})
	})
})
