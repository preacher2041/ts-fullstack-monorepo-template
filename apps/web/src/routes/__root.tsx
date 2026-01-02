import { createRootRoute, Outlet } from '@tanstack/react-router'
import { MainNav } from '@/components'

export const Route = createRootRoute({
	component: () => (
		<>
			<MainNav />
			<Outlet />
		</>
	),
})
