import * as React from 'react'

import { Input, type InputProps } from '../Input'

export type TextFieldProps = InputProps

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
	(props, ref) => <Input type='text' ref={ref} {...props} />
)

TextField.displayName = 'TextField'

export { TextField }
