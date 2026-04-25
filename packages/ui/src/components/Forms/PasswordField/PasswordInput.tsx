import * as React from 'react'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'

import { cn } from '../../../utils'
import { Input, type InputProps } from '../Input'

export type PasswordInputProps = InputProps

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	({ className, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false)

		return (
			<div className='relative'>
				<Input
					type={showPassword ? 'text' : 'password'}
					ref={ref}
					className={cn('pr-10', className)}
					{...props}
				/>
				<button
					type='button'
					className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
					onClick={() => setShowPassword((prev) => !prev)}
					aria-label={
						showPassword ? 'Hide password' : 'Show password'
					}
					tabIndex={-1}>
					{showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
				</button>
			</div>
		)
	}
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
