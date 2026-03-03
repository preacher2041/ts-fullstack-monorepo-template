import { AnyFieldMeta } from '@tanstack/react-form'

type FieldErrorProps = {
	meta: AnyFieldMeta
	name: string
	hideErrors?: boolean
}

export const FieldErrors = ({ meta, name, hideErrors }: FieldErrorProps) => {
	if (hideErrors) return null

	const uniqueErrors = [...new Set(meta.errors.map((err) => err.message))]
	if (uniqueErrors.length === 0) return null

	return (
		<div id={`${name}-error`}>
			{uniqueErrors.map((message, index) => (
				<p key={index} className='mt-2'>
					{message}
				</p>
			))}
		</div>
	)
}
