import { createFileRoute } from '@tanstack/react-router'

import { LoginView } from '@/features'

export const Route = createFileRoute('/_auth/login')({
	component: LoginView,
})
