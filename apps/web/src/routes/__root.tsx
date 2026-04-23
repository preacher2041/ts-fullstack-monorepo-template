import {
	createRootRouteWithContext,
	Outlet,
	redirect,
} from '@tanstack/react-router'
import { MainLayout } from '@/components'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { sessionQuery } from '@/features/Auth/api'

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
	beforeLoad: async ({ context, location }) => {
		const { authenticated } =
			await context.queryClient.ensureQueryData(sessionQuery)

		const isAuthRoute = ['/login', '/register'].includes(location.pathname)

		if (!authenticated && !isAuthRoute) {
			throw redirect({ to: '/login' })
		}

		if (authenticated && isAuthRoute) {
			throw redirect({ to: '/' })
		}
	},
	component: RootComponent,
})
