import { loginSchema } from '@template/schemas'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { LoginForm } from './LoginForm'

const defaultProps = {
	loginFormSchema: loginSchema,
	isPending: false,
	isError: false,
}

describe('LoginForm', () => {
	it('renders the email and password fields', () => {
		render(<LoginForm {...defaultProps} onSubmit={vi.fn()} />)
		expect(screen.getByLabelText('Email')).toBeInTheDocument()
		expect(screen.getByLabelText('Password')).toBeInTheDocument()
	})

	it('submit button is disabled on initial render', () => {
		render(<LoginForm {...defaultProps} onSubmit={vi.fn()} />)
		expect(screen.getByRole('button', { name: /login/i })).toBeDisabled()
	})

	it('calls onSubmit with form values when submitted with valid inputs', async () => {
		const onSubmit = vi.fn()
		const user = userEvent.setup()
		render(<LoginForm {...defaultProps} onSubmit={onSubmit} />)

		await user.type(screen.getByLabelText('Email'), 'test@example.com')
		await user.type(screen.getByLabelText('Password'), 'password')
		await user.click(screen.getByRole('button', { name: 'Login' }))

		expect(onSubmit).toHaveBeenCalledWith({
			email: 'test@example.com',
			password: 'password',
		})
	})

	it('submit button remains disabled with invalid inputs', async () => {
		const user = userEvent.setup()
		render(<LoginForm {...defaultProps} onSubmit={vi.fn()} />)

		await user.type(screen.getByLabelText('Email'), 'invalid-email')
		await user.type(screen.getByLabelText('Password'), 'password')

		expect(screen.getByRole('button', { name: 'Login' })).toBeDisabled()
	})

	it('shows a validation error for an invalid email', async () => {
		const user = userEvent.setup()
		render(<LoginForm {...defaultProps} onSubmit={vi.fn()} />)

		await user.type(screen.getByLabelText('Email'), 'invalid-email')
		await user.type(screen.getByLabelText('Password'), 'password')

		expect(
			screen.getByText('Email address must be a valid email')
		).toBeInTheDocument()
	})

	it('shows a validation error when password is too short', async () => {
		const user = userEvent.setup()
		render(<LoginForm {...defaultProps} onSubmit={vi.fn()} />)

		await user.type(screen.getByLabelText('Email'), 'test@example.com')
		await user.type(screen.getByLabelText('Password'), 'short')

		expect(
			screen.getByText('Password must be at least 8 characters long')
		).toBeInTheDocument()
	})
})
