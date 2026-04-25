import type { Meta, StoryObj } from '@storybook/react-vite'
import { within, userEvent, expect, waitFor } from 'storybook/test'
import { PasswordInput } from '@template/ui'

const meta: Meta<typeof PasswordInput> = {
  title: 'Forms/PasswordInput',
  component: PasswordInput,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    state: {
      control: 'select',
      options: ['default', 'error'],
    },
  },
}

export default meta
type Story = StoryObj<typeof PasswordInput>

export const Default: Story = {
  args: {
    placeholder: 'Enter password...',
  },
}

export const ErrorState: Story = {
  args: {
    placeholder: 'Enter password...',
    state: 'error',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Enter password...',
    disabled: true,
  },
}

export const ShowHideToggle: Story = {
  args: {
    placeholder: 'Enter password...',
    'aria-label': 'Password',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    const input = canvas.getByLabelText('Password')
    
    await expect(input).toHaveAttribute('type', 'password')

    await userEvent.click(canvas.getByRole('button', { name: 'Show password' }))

    await waitFor(() =>
      expect(input).toHaveAttribute('type', 'text')
    )

    await userEvent.click(canvas.getByRole('button', { name: 'Hide password' }))

    await waitFor(() =>
      expect(input).toHaveAttribute('type', 'password')
    )
  }
}