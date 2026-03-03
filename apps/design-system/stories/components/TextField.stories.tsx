import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextInput } from '@template/ui'

const meta: Meta<typeof TextInput> = {
  title: 'Forms/TextInput',
  component: TextInput,
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
type Story = StoryObj<typeof TextInput>

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const ErrorState: Story = {
  args: {
    placeholder: 'Enter text...',
    state: 'error',
  },
}

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled',
    disabled: true,
  },
}
