import { useNavigate } from '@tanstack/react-router'
import { createUserSchema } from '@template/schemas'

import { useRegisterMutation } from '@/features/Auth/api'
import { RegistrationForm } from './RegistrationForm'
import { RegistrationFormValues } from '../../types'

export const RegistrationContainer = () => {
	const navigate = useNavigate()
	const { mutate: register, isPending, isError } = useRegisterMutation()

	const handleSubmit = (values: RegistrationFormValues) => {
		register(values, { onSuccess: () => navigate({ to: '/' }) })
	}

	return (
		<div>
			<RegistrationForm
				registrationFormSchema={createUserSchema}
				onSubmit={handleSubmit}
				isPending={isPending}
				isError={isError}
			/>
		</div>
	)
}
