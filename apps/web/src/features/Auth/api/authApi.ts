import {
	queryOptions,
	useMutation,
	useQueryClient,
} from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'

import { LoginCredentials, MeResponse, RegistrationCredentials } from '../types'

export const authKeys = {
	all: () => ['auth'] as const,
	me: () => ['auth', 'me'] as const,
	session: () => ['auth', 'session'] as const,
}

export const sessionQuery = queryOptions({
	queryKey: authKeys.session(),
	queryFn: async () => {
		try {
			return await apiClient<{ authenticated: boolean }>('/auth/session')
		} catch {
			return { authenticated: false }
		}
	},
	retry: false,
})

export const meQuery = queryOptions({
	queryKey: authKeys.me(),
	queryFn: () => apiClient<MeResponse>('/users/me'),
})

export const useLoginMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (credentials: LoginCredentials) =>
			apiClient('/auth/login', {
				method: 'POST',
				body: JSON.stringify(credentials),
			}),
		onSuccess: () =>
			queryClient.setQueryData(authKeys.session(), {
				authenticated: true,
			}),
	})
}

export const useLogoutMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: () =>
			apiClient('/auth/logout', {
				method: 'POST',
			}),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: authKeys.all() }),
	})
}

export const useRegisterMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (credentials: RegistrationCredentials) =>
			apiClient('/users', {
				method: 'POST',
				body: JSON.stringify(credentials),
			}),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: authKeys.me() }),
	})
}
