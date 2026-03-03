import { createFileRoute } from '@tanstack/react-router'

import { RegistrationView } from '@/features'

export const Route = createFileRoute('/_auth/registration')({
	component: RegistrationView,
})
