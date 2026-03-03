import { createFileRoute } from '@tanstack/react-router'

import { Login } from '@/features'

export const Route = createFileRoute('/login')({
	component: Login,
})
