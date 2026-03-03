import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { CheckboxField } from '../Checkbox'
import { DateField } from '../DateField'
import { EmailField } from '../EmailField'
import { PasswordField } from '../PasswordField'
import { TextField } from '../TextField'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
	createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		CheckboxField,
		DateField,
		EmailField,
		PasswordField,
		TextField,
	},
	formComponents: {},
	fieldContext,
	formContext,
})
