import {Meta, StoryObj} from '@storybook/react-vite';

import {Header} from '@template/ui';

const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    control: {
        expanded: true,
    }
  }
};

export default meta;

export const Default: StoryObj<typeof Header> = {
    args: {
      title: 'Template',
    }
}