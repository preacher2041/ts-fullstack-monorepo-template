import { StrictMode } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from '@/routeTree.gen'

import '@/index.css'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export const AppProvider = () => {
	return (
		<StrictMode>
			<RouterProvider router={router} />
		</StrictMode>
	)
}
