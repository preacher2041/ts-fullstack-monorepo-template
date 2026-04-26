import { AnyFieldMeta } from '@tanstack/react-form'

type FieldErrorProps = {
	meta: AnyFieldMeta
	name: string
	hideErrors?: boolean
}

export const FieldErrors = ({ meta, name, hideErrors }: FieldErrorProps) => {
	if (hideErrors) return null

	const uniqueErrors = [
		...new Set(
			meta.errors.filter(Boolean).map((err) => {
				if (typeof err === 'string') return err
				if (err && typeof err === 'object' && 'message' in err)
					return String(err.message)
				return String(err)
			})
		),
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
