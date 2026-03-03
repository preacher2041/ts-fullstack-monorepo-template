import * as React from 'react'

import { Input, type InputProps } from '../Input'

export type EmailFieldProps = InputProps

const EmailField = React.forwardRef<HTMLInputElement, EmailFieldProps>(
	(props, ref) => <Input type='email' ref={ref} {...props} />
)

EmailField.displayName = 'EmailField'

export { EmailField }
