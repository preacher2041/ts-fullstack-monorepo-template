import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../../utils'

const inputVariants = cva(
	'flex w-full rounded-md border px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
	{
		variants: {
			size: {
				sm: 'h-8 px-2 text-xs',
				md: 'h-10',
				lg: 'h-12 px-4 text-base',
			},
			state: {
				default:
					'border-border focus-visible:border-primary focus-visible:ring-ring/20',
				error: 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20',
			},
		},
		defaultVariants: {
			size: 'md',
			state: 'default',
		},
	}
)

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
		VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, size, state, ...props }, ref) => (
		<input
			className={cn(inputVariants({ size, state, className }))}
			ref={ref}
			{...props}
		/>
	)
)

Input.displayName = 'Input'

export { Input, inputVariants }
