import {Meta, StoryObj} from '@storybook/react-vite';

import {Counter} from '@template/ui';

const meta: Meta<typeof Counter> = {
  title: 'Components/Counter',
  component: Counter,
  parameters: {
    control: {
        expanded: true,
    }
  }
};

export default meta;

export const Default: StoryObj<typeof Counter> = {
    args: {}
}