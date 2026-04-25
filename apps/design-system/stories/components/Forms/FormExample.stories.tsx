import type { Meta, StoryObj } from '@storybook/react-vite'
import {within, userEvent, expect, waitFor} from 'storybook/test'
import { useAppForm, SubmitButton } from '@template/ui'

const BasicForm = () => {
  const form = useAppForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      alert(JSON.stringify(value, null, 2))
    },
  })

  return (
    <form.AppForm>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className='flex flex-col gap-4 w-80'>
        <form.AppField
          name='name'
          validators={{
            onMount: ({ value }) => !value ? 'Name is required' : undefined,
            onChange: ({ value }) =>
              !value ? 'Name is required' : undefined,
          }}>
          {(field) => <field.TextField label='Name' />}
        </form.AppField>

        <form.AppField
          name='email'
          validators={{
            onMount: ({ value }) => !value ? 'Email is required' : undefined,
            onChange: ({ value }) =>
              !value ? 'Email is required' : undefined,
          }}>
          {(field) => <field.EmailField label='Email' />}
        </form.AppField>

        <form.AppField
          name='password'
          validators={{
            onMount: ({ value }) => !value ? 'Password is required' : undefined,
            onChange: ({ value }) => {
              if (!value) return 'Password is required'
              if (value.length < 8) return 'Password must be at least 8 characters'
              return undefined
            },
          }}>
          {(field) => <field.PasswordField label='Password' />}
        </form.AppField>

        <SubmitButton>Submit</SubmitButton>
      </form>
    </form.AppForm>
  )
}

const meta: Meta<typeof BasicForm> = {
  title: 'Forms/Examples/BasicForm',
  component: BasicForm,
  parameters: {
    controls: { disable: true },
  },
}

export default meta
type Story = StoryObj<typeof BasicForm>

export const Default: Story = {}

export const FilledForm: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Name'), 'John Doe')
    await userEvent.type(canvas.getByLabelText('Email'), 'john.doe@example.com')
    await userEvent.type(canvas.getByLabelText('Password'), 'password123')

    await expect(canvas.queryByText('Name is required')).not.toBeInTheDocument()
    await expect(canvas.queryByText('Email is required')).not.toBeInTheDocument()
    await expect(canvas.queryByText('Password must be at least 8 characters')).not.toBeInTheDocument()
  }
}

export const RequiredFieldValidation: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    const nameInput = canvas.getByLabelText('Name')

    await userEvent.type(nameInput, 'John Doe')
    await userEvent.clear(nameInput)
    await userEvent.tab() // Trigger validation

    await expect(canvas.getByText('Name is required')).toBeInTheDocument()
  }
}

export const ShortPasswordValidation: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    const passwordInput = canvas.getByLabelText('Password')

    await userEvent.type(passwordInput, 'short')
    await userEvent.tab() // Trigger validation

    await expect(canvas.getByText('Password must be at least 8 characters')).toBeInTheDocument()
  }
}

export const DisabledOnMount: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: 'Submit' })).toBeDisabled()
  }
}

export const EnabledWhenValid: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Name'), 'John Doe')
    await userEvent.type(canvas.getByLabelText('Email'), 'john.doe@example.com')
    await userEvent.type(canvas.getByLabelText('Password'), 'password123')

    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Submit' })).toBeEnabled()
    )
  }
}

export const DisabledWhenPartiallyFilled: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Name'), 'John Doe')
    await userEvent.type(canvas.getByLabelText('Email'), 'john.doe@example.com')

    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Submit' })).toBeDisabled()
    )
  }
}

export const DisableWithInvalidData: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Name'), 'John Doe')
    await userEvent.type(canvas.getByLabelText('Email'), 'john.doe@example.com')
    await userEvent.type(canvas.getByLabelText('Password'), 'short')

    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Submit' })).toBeDisabled()
    )
  }
}

export const DisabledAfterDeletingData: Story = {
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    await userEvent.type(canvas.getByLabelText('Name'), 'John Doe')
    await userEvent.type(canvas.getByLabelText('Email'), 'john.doe@example.com')
    await userEvent.type(canvas.getByLabelText('Password'), 'password123')

    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Submit' })).toBeEnabled()
    )

    await userEvent.clear(canvas.getByLabelText('Password'))

    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Submit' })).toBeDisabled()
    )
  }
}
