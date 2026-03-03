import { FieldErrors, Label, useFieldContext } from '..'
import { TextInput, type TextInputProps } from './TextInput'

export type TextFieldProps = {
	label: string
	labelClassName?: string
} & Omit<TextInputProps, 'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'state'>

export const TextField = ({
	label,
	labelClassName,
	...inputProps
}: TextFieldProps) => {
	const field = useFieldContext<string>()

	const hideErrors = !field.state.meta.isTouched
	const hasErrors = field.state.meta.errors.length > 0 && !hideErrors

	return (
		<>
			<Label htmlFor={field.name} className={labelClassName}>
				{label}
			</Label>
			<TextInput
				name={field.name}
				id={field.name}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				state={hasErrors ? 'error' : 'default'}
				aria-invalid={hasErrors ? 'true' : 'false'}
				aria-errormessage={hasErrors ? `${field.name}-error` : ''}
				{...inputProps}
			/>
			<FieldErrors
				name={field.name}
				meta={field.state.meta}
				hideErrors={hideErrors}
			/>
		</>
	)
}
