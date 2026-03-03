import * as React from 'react'
import { Label as LabelPrimitive } from 'radix-ui'

import { cn } from '../../../utils'

export interface LabelProps
	extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {}

const Label = React.forwardRef<
	React.ComponentRef<typeof LabelPrimitive.Root>,
	LabelProps
>(({ className, ...props }, ref) => (
	<LabelPrimitive.Root
		ref={ref}
		className={cn(
			'text-sm font-medium text-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
			className
		)}
		{...props}
	/>
))

Label.displayName = 'Label'

export { Label }
