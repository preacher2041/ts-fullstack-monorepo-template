import { Slot as SlotPrimitive } from 'radix-ui'
import { forwardRef, Ref, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

const buttonVariants = cva(
	'inline-flex items-center rounded-sm font-medium transition-colors',
	{
		variants: {
			variant: {
				primary: 'bg-primary text-white hover:bg-primary/90',
				secondary: 'bg-secondary text-white hover:bg-secondary/90',
				ghost: 'bg-transparent text-primary hover:bg-primary/10',
			},
			size: {
				sm: 'px-3 py-1.5 text-sm',
				md: 'px-4 py-2',
				lg: 'px-5 py-3 text-lg',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'md',
		},
	}
)

export interface ButtonProps
	extends
		ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		if (asChild) {
			return (
				<SlotPrimitive.Root
					className={cn(buttonVariants({ variant, size, className }))}
					ref={ref as Ref<HTMLElement>}
					{...props}
				/>
			)
		} else {
			return (
				<button
					className={cn(buttonVariants({ variant, size, className }))}
					ref={ref}
					{...props}
				/>
			)
		}
	}
)

Button.displayName = 'Button'

export { buttonVariants }
