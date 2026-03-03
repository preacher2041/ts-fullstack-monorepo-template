import type { Meta, StoryObj } from '@storybook/react-vite'
import { DateInput } from '@template/ui'

const meta: Meta<typeof DateInput> = {
  title: 'Forms/DateInput',
  component: DateInput,
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
type Story = StoryObj<typeof DateInput>

export const Default: Story = {
  args: {},
}

export const WithValue: Story = {
  args: {
    defaultValue: '2024-01-15',
  },
}

export const ErrorState: Story = {
  args: {
    state: 'error',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
