import { createUserSchema } from '@template/schemas'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { RegistrationForm } from './RegistrationForm'

const defaultProps = {
	registrationFormSchema: createUserSchema,
	isPending: false,
	isError: false,
}

describe('RegistrationForm', () => {
	it('renders all registration fields', () => {
		render(<RegistrationForm {...defaultProps} onSubmit={vi.fn()} />)
		expect(screen.getByLabelText('First Name')).toBeInTheDocument()
		expect(screen.getByLabelText('Last Name')).toBeInTheDocument()
		expect(screen.getByLabelText('Date of birth')).toBeInTheDocument()
		expect(screen.getByLabelText('Username')).toBeInTheDocument()
		expect(screen.getByLabelText('Email')).toBeInTheDocument()
		expect(screen.getByLabelText('Password')).toBeInTheDocument()
	})

	it('submit button is disabled on initial render', () => {
		render(<RegistrationForm {...defaultProps} onSubmit={vi.fn()} />)
		expect(screen.getByRole('button', { name: /register/i })).toBeDisabled()
	})

	it('calls onSubmit with form values when submitted with valid inputs', async () => {
		const onSubmit = vi.fn()
		const user = userEvent.setup()
		render(<RegistrationForm {...defaultProps} onSubmit={onSubmit} />)

		await user.type(screen.getByLabelText('First Name'), 'John')
		await user.type(screen.getByLabelText('Last Name'), 'Doe')
		await user.type(screen.getByLabelText('Date of birth'), '1990-01-01')
		await user.type(screen.getByLabelText('Username'), 'johndoe')
		await user.type(screen.getByLabelText('Email'), 'johndoe@example.com')
		await user.type(screen.getByLabelText('Password'), 'password123')

		await user.click(screen.getByRole('button', { name: /register/i }))

		expect(onSubmit).toHaveBeenCalledWith({
			firstName: 'John',
			lastName: 'Doe',
			dob: '1990-01-01',
			username: 'johndoe',
			email: 'johndoe@example.com',
			password: 'password123',
		})
	})

	it('shows a validation error for an invalid email', async () => {
		const user = userEvent.setup()
		render(<RegistrationForm {...defaultProps} onSubmit={vi.fn()} />)

		await user.type(screen.getByLabelText('Email'), 'invalid-email')
		await user.tab()
		expect(
			screen.getByText('Email address must be a valid email')
		).toBeInTheDocument()
	})

	it('shows a validation error when password is too short', async () => {
		const user = userEvent.setup()
		render(<RegistrationForm {...defaultProps} onSubmit={vi.fn()} />)

		await user.type(screen.getByLabelText('Password'), 'short')
		await user.tab()
		expect(
			screen.getByText('Password must be at least 8 characters long')
		).toBeInTheDocument()
	})

	it('shows a validation error when a requried field is cleared', async () => {
		const user = userEvent.setup()
		render(<RegistrationForm {...defaultProps} onSubmit={vi.fn()} />)

		await user.type(screen.getByLabelText('First Name'), 'John')
		await user.clear(screen.getByLabelText('First Name'))

		expect(screen.getByText('First name is required')).toBeInTheDocument()
	})
})
