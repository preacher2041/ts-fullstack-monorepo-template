import z from 'zod'

import { RegistrationForm } from './RegistrationForm'

const registrationFormSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'First name is required'),
	email: z.email({
		pattern: z.regexes.html5Email,
		error: 'Email address must be a valid email',
	}),
	dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
	username: z.string().min(1, 'First name is required'),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const RegistrationContainer = () => {
	return (
		<div>
			<RegistrationForm registrationFormSchema={registrationFormSchema} />
		</div>
	)
}
