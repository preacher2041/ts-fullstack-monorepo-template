import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmailInput } from '@template/ui'

const meta: Meta<typeof EmailInput> = {
  title: 'Forms/EmailInput',
  component: EmailInput,
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
type Story = StoryObj<typeof EmailInput>

export const Default: Story = {
  args: {
    placeholder: 'you@example.com',
  },
}

export const ErrorState: Story = {
  args: {
    placeholder: 'you@example.com',
    state: 'error',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'you@example.com',
    disabled: true,
  },
}
