import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '@template/ui'

const meta: Meta<typeof Checkbox> = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  parameters: {
    controls: { expanded: true },
  },
  argTypes: {
    checked: {
      control: 'select',
      options: [true, false, 'indeterminate'],
    },
    defaultChecked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    onCheckedChange: { action: 'onCheckedChange' },
  },
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
  args: {
    defaultChecked: false,
  },
}

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
}

export const Indeterminate: Story = {
  args: {
    checked: 'indeterminate',
    onCheckedChange: () => {},
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const DisabledChecked: Story = {
  args: {
    defaultChecked: true,
    disabled: true,
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Checkbox />
      <Checkbox defaultChecked />
      <Checkbox checked="indeterminate" onCheckedChange={() => {}} />
      <Checkbox disabled />
      <Checkbox defaultChecked disabled />
    </div>
  ),
}
