import * as React from 'react'
import { Checkbox as CheckboxPrimitive } from 'radix-ui'

import { cn } from '../../../utils'

export interface CheckboxProps
	extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
	className?: string
}

const Checkbox = React.forwardRef<
	React.ComponentRef<typeof CheckboxPrimitive.Root>,
	CheckboxProps
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		className={cn(
			'group inline-flex h-4 w-4 shrink-0 appearance-none items-center justify-center rounded-sm border border-border shadow-sm transition-colors',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 focus-visible:border-primary',
			'disabled:cursor-not-allowed disabled:opacity-50',
			'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white',
			'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-white',
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator className='flex items-center justify-center text-current'>
			{/* checkmark — shown when checked */}
			<svg
				viewBox='0 0 10 10'
				className='h-3 w-3 group-data-[state=indeterminate]:hidden'
				fill='none'
				stroke='currentColor'
				strokeWidth={1.5}
			>
				<path d='M1.5 5l2.5 2.5 4.5-4.5' strokeLinecap='round' strokeLinejoin='round' />
			</svg>
			{/* minus — shown when indeterminate */}
			<svg
				viewBox='0 0 10 10'
				className='hidden h-3 w-3 group-data-[state=indeterminate]:block'
				fill='none'
				stroke='currentColor'
				strokeWidth={1.5}
			>
				<path d='M2 5h6' strokeLinecap='round' />
			</svg>
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
))

Checkbox.displayName = 'Checkbox'

export { Checkbox }
