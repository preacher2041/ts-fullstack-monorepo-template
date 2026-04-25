import { AnyFieldMeta } from '@tanstack/react-form'

type FieldErrorProps = {
	meta: AnyFieldMeta
	name: string
	hideErrors?: boolean
}

export const FieldErrors = ({ meta, name, hideErrors }: FieldErrorProps) => {
	if (hideErrors) return null

	const uniqueErrors = [
		...new Set(meta.errors.filter(Boolean).map((err) => String(err))),
	]
	if (uniqueErrors.length === 0) return null

	return (
		<div id={`${name}-error`}>
			{uniqueErrors.map((message, index) => (
				<p key={index} className='text-destructive'>
					{message}
				</p>
			))}
		</div>
	)
}
