import { Button } from '../../Button'
import { useFormContext } from '../Form'

type SubmitButtonProps = {
	children: string
	isDisabled?: boolean
}

export const SubmitButton = ({ children, isDisabled }: SubmitButtonProps) => {
	const form = useFormContext()

	return (
		<form.Subscribe
			selector={(state) => ({
				canSubmit: state.canSubmit,
			})}>
			{({ canSubmit }) => (
				<Button
					type='submit'
					disabled={!canSubmit || isDisabled}
					size='lg'>
					{children}
				</Button>
			)}
		</form.Subscribe>
	)
}
