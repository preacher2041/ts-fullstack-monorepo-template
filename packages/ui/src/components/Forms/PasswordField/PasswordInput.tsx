import * as React from 'react'

import { Input, type InputProps } from '../Input'

export type PasswordInputProps = InputProps

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	(props, ref) => <Input type='password' ref={ref} {...props} />
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
