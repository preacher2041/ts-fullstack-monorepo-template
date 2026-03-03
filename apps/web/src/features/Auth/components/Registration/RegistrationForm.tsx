import { type ZodType } from 'zod'

import { useAppForm } from '@template/ui'

type RegistrationFormValues = {
	firstName: string
	lastName: string
	email: string
	dob: string
	username: string
	password: string
}

type RegistrationFormProps = {
	registrationFormSchema: ZodType<
		RegistrationFormValues,
		RegistrationFormValues
	>
}

export const RegistrationForm = ({
	registrationFormSchema,
}: RegistrationFormProps) => {
	const defaultValues: RegistrationFormValues = {
		firstName: '',
		lastName: '',
		email: '',
		dob: '',
		username: '',
		password: '',
	}

	const form = useAppForm({
		defaultValues,
		validators: {
			onChange: registrationFormSchema,
		},
		onSubmit: ({ value }) => {
			alert(JSON.stringify(value, null, 2))
		},
	})

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault()
				void form.handleSubmit()
			}}>
			<div>
				<form.AppField name='firstName'>
					{(field) => <field.TextField label='First Name' />}
				</form.AppField>
				<form.AppField name='lastName'>
					{(field) => <field.TextField label='Last Name' />}
				</form.AppField>
				<form.AppField name='email'>
					{(field) => <field.EmailField label='Email' />}
				</form.AppField>
				<form.AppField name='dob'>
					{(field) => <field.DateField label='Date of birth' />}
				</form.AppField>
				<form.AppField name='username'>
					{(field) => <field.TextField label='Username' />}
				</form.AppField>
				<form.AppField name='password'>
					{(field) => <field.PasswordField label='Password' />}
				</form.AppField>
			</div>
			<div>
				<form.AppForm>
					<form.SubmitButton>Register</form.SubmitButton>
				</form.AppForm>
			</div>
		</form>
	)
}
