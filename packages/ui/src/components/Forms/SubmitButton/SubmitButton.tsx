import { Button } from '../../Button'
import { useFormContext } from '../Form/formContexts'

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
				isDefaultValue: state.isDefaultValue,
			})}>
			{({ canSubmit, isDefaultValue }) => (
				<Button
					type='submit'
					disabled={isDefaultValue || !canSubmit || isDisabled}
					size='lg'>
					{children}
				</Button>
			)}
		</form.Subscribe>
	)
}
