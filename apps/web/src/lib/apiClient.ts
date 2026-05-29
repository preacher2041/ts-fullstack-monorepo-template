import { router } from './router'

export const apiClient = async <T>(
	path: string,
	options?: RequestInit
): Promise<T> => {
	const res = await fetch(
		`${import.meta.env.VITE_API_URL}${import.meta.env.VITE_API_URL_PREFIX}${path}`,
		{
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers,
			},
			credentials: 'include',
		}
	)
	if (res.status === 401) {
		router.navigate({ to: '/login' })
		throw new Error('Unauthorized')
	}

	if (!res.ok) {
		const contentType = res.headers.get('content-type')?.toLowerCase()
		let isJson = false
		let jsonError: unknown

		if (contentType?.includes('application/json')) {
			try {
				jsonError = await res.json()
				isJson = true
			} catch {
				// Fallback if JSON parsing fails
			}
		}

		if (isJson) {
			throw jsonError
		}

		let text = ''
		try {
			text = await res.text()
		} catch {
			// Fallback if reading text fails
		}

		throw {
			status: res.status,
			message: text || res.statusText || 'An error occurred',
		}
	}
	return res.json()
}
