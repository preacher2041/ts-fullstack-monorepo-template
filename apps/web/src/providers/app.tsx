import { StrictMode } from 'react'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from '@/routeTree.gen'
import { Theme } from '@radix-ui/themes'

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
        <Theme>
          <RouterProvider router={router} />
        </Theme>
      </StrictMode>
    )
}