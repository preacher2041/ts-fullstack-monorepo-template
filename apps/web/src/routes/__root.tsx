import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { MainLayout } from '@/components'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'

const RootComponent = () => {
	return (
		<>
			<MainLayout>
				<Outlet />
			</MainLayout>
			<ReactQueryDevtools buttonPosition='bottom-left' />
			<TanStackRouterDevtools position='bottom-right' />
		</>
	)
}

export const Route = createRootRouteWithContext<{
	queryClient: QueryClient
}>()({
	component: RootComponent,
})
