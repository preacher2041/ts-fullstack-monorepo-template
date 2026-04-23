import { type ZodType } from 'zod'

import { useAppForm } from '@template/ui'
import { LoginFormValues } from '../../types'

type LoginFormProps = {
	loginFormSchema: ZodType<LoginFormValues, LoginFormValues>
	onSubmit: (values: LoginFormValues) => void
	isPending: boolean
	isError: boolean
}

export const LoginForm = ({ loginFormSchema, onSubmit }: LoginFormProps) => {
	const defaultValues: LoginFormValues = {
		email: '',
		password: '',
	}

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: loginFormSchema,
		},
		onSubmit: ({ value }) => {
			onSubmit(value)
		},
	})

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				void form.handleSubmit()
			}}>
			<div>
				<form.AppField name='email'>
					{(field) => <field.EmailField label='Email' />}
				</form.AppField>
				<form.AppField name='password'>
					{(field) => <field.PasswordField label='Password' />}
				</form.AppField>
			</div>
			<div>
				<form.AppForm>
					<form.SubmitButton>Login</form.SubmitButton>
				</form.AppForm>
			</div>
		</form>
	)
}
