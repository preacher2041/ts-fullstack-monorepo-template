import * as React from 'react'

import { Input, type InputProps } from '../Input'

export type DateInputProps = InputProps

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
	(props, ref) => <Input type='date' ref={ref} {...props} />
)

DateInput.displayName = 'DateInput'

export { DateInput }
