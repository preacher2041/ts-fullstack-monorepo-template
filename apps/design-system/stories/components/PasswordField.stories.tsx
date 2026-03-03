import type { Meta, StoryObj } from '@storybook/react-vite'
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
