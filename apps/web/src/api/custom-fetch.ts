import { apiClient } from '../lib/apiClient'

export const customFetch = <T>(
	url: string,
	config: RequestInit & {
		params?: Record<string, unknown>
	}
): Promise<T> => {
	let finalUrl = url
	if (config.params) {
		const searchParams = new URLSearchParams()
		Object.entries(config.params).forEach(([key, val]) => {
			if (val !== undefined && val !== null) {
				searchParams.append(key, String(val))
			}
		})
		const queryString = searchParams.toString()
		if (queryString) {
			finalUrl += `?${queryString}`
		}
	}

	// Exclude non-standard `params` from RequestInit options
	const fetchOptions = { ...config }
	delete fetchOptions.params

	return apiClient<T>(finalUrl, fetchOptions)
}
