import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label, TextInput } from '@template/ui'

const meta: Meta<typeof Label> = {
  title: 'Forms/Label',
  component: Label,
  parameters: {
    controls: { expanded: true },
  },
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
  args: {
    children: 'Email address',
  },
}

export const WithInput: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label htmlFor="email">Email address</Label>
      <TextInput id="email" placeholder="you@example.com" />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-1.5 w-80">
      <Label htmlFor="email-disabled">Email address</Label>
      <TextInput id="email-disabled" placeholder="you@example.com" disabled />
    </div>
  ),
}
