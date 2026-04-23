import z from 'zod'
import { useNavigate } from '@tanstack/react-router'

import { useRegisterMutation } from '@/features/Auth/api'
import { RegistrationForm } from './RegistrationForm'
import { RegistrationFormValues } from '../../types'

const registrationFormSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.email({
		pattern: z.regexes.html5Email,
		error: 'Email address must be a valid email',
	}),
	dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
	username: z.string().min(1, 'Username name is required'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const RegistrationContainer = () => {
	const navigate = useNavigate()
	const { mutate: register, isPending, isError } = useRegisterMutation()

	const handleSubmit = (values: RegistrationFormValues) => {
		register(values, { onSuccess: () => navigate({ to: '/' }) })
	}

	return (
		<div>
			<RegistrationForm
				registrationFormSchema={registrationFormSchema}
				onSubmit={handleSubmit}
				isPending={isPending}
				isError={isError}
			/>
		</div>
	)
}
