import * as React from 'react'

import { Input, type InputProps } from '../Input'

export type PasswordFieldProps = InputProps

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
	(props, ref) => <Input type='password' ref={ref} {...props} />
)

PasswordField.displayName = 'PasswordField'

export { PasswordField }
