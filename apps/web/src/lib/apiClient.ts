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

	if (!res.ok) throw await res.json()
	return res.json()
}
