import * as React from 'react'

import { Input, type InputProps } from '../Input'

export type DateFieldProps = InputProps

const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
	(props, ref) => <Input type='date' ref={ref} {...props} />
)

DateField.displayName = 'DateField'

export { DateField }
