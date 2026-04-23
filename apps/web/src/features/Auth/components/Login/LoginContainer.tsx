import { useNavigate } from '@tanstack/react-router'
import { loginSchema } from '@template/schemas'

import { useLoginMutation } from '@/features/Auth/api'
import { LoginForm } from './LoginForm'

export const LoginContainer = () => {
	const navigate = useNavigate()
	const { mutate: login, isPending, isError } = useLoginMutation()
	const handleSubmit = (values: { email: string; password: string }) => {
		login(values, {
			onSuccess: () => {
				navigate({ to: '/' })
			},
		})
	}
	return (
		<div>
			<LoginForm
				loginFormSchema={loginSchema}
				onSubmit={handleSubmit}
				isPending={isPending}
				isError={isError}
			/>
		</div>
	)
}
