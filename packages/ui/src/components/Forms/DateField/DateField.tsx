import { FieldErrors, Label, useFieldContext } from '..'
import { DateInput, type DateInputProps } from './DateInput'

export type DateFieldProps = {
	label: string
	labelClassName?: string
} & Omit<DateInputProps, 'value' | 'onChange' | 'onBlur' | 'name' | 'id' | 'state'>

export const DateField = ({
	label,
	labelClassName,
	...inputProps
}: DateFieldProps) => {
	const field = useFieldContext<string>()

	const hideErrors = !field.state.meta.isTouched
	const hasErrors = field.state.meta.errors.length > 0 && !hideErrors

	return (
		<>
			<Label htmlFor={field.name} className={labelClassName}>
				{label}
			</Label>
			<DateInput
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
