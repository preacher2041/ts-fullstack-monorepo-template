import { StrictMode } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'

import { router, queryClient } from '../lib'

import '@/index.css'

export const AppProvider = () => {
	return (
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>
	)
}
