import * as React from 'react'

import { Input, type InputProps } from '../Input'

export type EmailInputProps = InputProps

const EmailInput = React.forwardRef<HTMLInputElement, EmailInputProps>(
	(props, ref) => <Input type='email' ref={ref} {...props} />
)

EmailInput.displayName = 'EmailInput'

export { EmailInput }
