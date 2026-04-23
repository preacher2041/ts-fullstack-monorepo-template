import z from 'zod'
import { useNavigate } from '@tanstack/react-router'

import { useLoginMutation } from '@/features/Auth/api'
import { LoginForm } from './LoginForm'

const loginFormSchema = z.object({
	email: z.email({
		pattern: z.regexes.html5Email,
		error: 'Email address must be a valid email',
	}),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
})

export const LoginContainer = () => {
	const navigate = useNavigate()
	const { mutate: login, isPending, isError } = useLoginMutation()
	const handleSubmit = (values: { email: string; password: string }) => {
		console.log('handleSubmit called')
		login(values, {
			onSuccess: () => {
				console.log('OnSuccess fired')
				navigate({ to: '/' })
			},
			onError: (error) => {
				console.log('onError fired', error)
			},
		})
	}
	return (
		<div>
			<LoginForm
				loginFormSchema={loginFormSchema}
				onSubmit={handleSubmit}
				isPending={isPending}
				isError={isError}
			/>
		</div>
	)
}
