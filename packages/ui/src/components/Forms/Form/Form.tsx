import { createFormHook } from '@tanstack/react-form'
import { CheckboxField } from '../Checkbox'
import { DateField } from '../DateField'
import { EmailField } from '../EmailField'
import { PasswordField } from '../PasswordField'
import { SubmitButton } from '../SubmitButton'
import { TextField } from '../TextField'
import { fieldContext, formContext } from './formContexts'

export { fieldContext, useFieldContext, formContext, useFormContext } from './formContexts'

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		CheckboxField,
		DateField,
		EmailField,
		PasswordField,
		TextField,
	},
	formComponents: { SubmitButton },
	fieldContext,
	formContext,
})
