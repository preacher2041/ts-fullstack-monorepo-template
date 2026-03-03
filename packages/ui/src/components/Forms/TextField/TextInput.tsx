import * as React from 'react'

import { Input, type InputProps } from '../Input'

export type TextInputProps = InputProps

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
	(props, ref) => <Input type='text' ref={ref} {...props} />
)

TextInput.displayName = 'TextInput'

export { TextInput }
