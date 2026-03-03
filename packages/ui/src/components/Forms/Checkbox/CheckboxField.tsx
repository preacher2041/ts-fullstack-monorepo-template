import React from 'react'

import {
	Checkbox,
	CheckboxProps,
	FieldErrors,
	Label,
	useFieldContext,
} from '..'
import { cn } from '../../../utils'

export const sizes = {
	lg: 'w-[24px] h-[24px] rounded',
	sm: '',
}

type CheckboxFieldProps = {
	boxSize: keyof typeof sizes
	className?: string
	label: string
	labelClassName?: string
} & Omit<CheckboxProps, 'checked' | 'onCheckedChange'>

export const CheckboxField = ({
	boxSize,
	className,
	labelClassName,
	...inputProps
}: CheckboxFieldProps) => {
	const field = useFieldContext<string>()

	// Hide error messages until the field has been touched
	const hideErrors = !field.state.meta.isTouched
	const hasErrors = field.state.meta.errors.length > 0 && !hideErrors

	return (
		<>
			<Checkbox
				name={field.name}
				id={field.name}
				className={cn('', sizes[boxSize || 'sm'], className)}
				value={'true'}
				onCheckedChange={(checked) =>
					field.handleChange(checked === true ? 'true' : 'false')
				}
				aria-invalid={hasErrors ? 'true' : 'false'}
				aria-errormessage={hasErrors ? `${field.name}-error` : ''}
				checked={field.state.value === 'true'}
				{...inputProps}
			/>
			<Label
				htmlFor={field.name}
				className={cn('mb-2 !inline-block', labelClassName)}
			/>
			<FieldErrors
				name={field.name}
				meta={field.state.meta}
				hideErrors={hideErrors}
			/>
		</>
	)
}
