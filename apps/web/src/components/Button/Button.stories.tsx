import type { Meta, StoryObj } from '@storybook/react';
import { Theme } from '@radix-ui/themes';

import { ButtonContainer as Button } from './Button';

const meta: Meta<typeof Button> = {
    component: Button,
    decorators: [
        (Story) => (
            <Theme accentColor="gold">
                <Story />
            </Theme>
        ),
    ],
    title: 'Components/Button',
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args:{
        children: 'Button',
        size: '2',
        variant: 'solid',
        color: 'gold',
        highContrast: false,
        radius: 'medium',
        loading: false,
        disabled: false,
    }
}