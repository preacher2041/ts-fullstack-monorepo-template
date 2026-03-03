import { createFileRoute } from '@tanstack/react-router'

import { Register } from '@/features'

export const Route = createFileRoute('/register')({
	component: Register,
})
