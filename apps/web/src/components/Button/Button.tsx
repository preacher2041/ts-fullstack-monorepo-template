import React from 'react';
import { Button } from '@radix-ui/themes';

export interface ButtonProps {
    children: React.ReactNode;
    size?: '1' | '2' | '3' | '4';
    variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost';
    color?: 'gray' | 'gold' | 'bronze' | 'brown' | 'yellow' | 'amber' | 'orange' | 'tomato' | 'red' | 'ruby' | 'crimson' | 'pink' | 'plum' | 'purple' | 'violet' | 'iris' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'jade' | 'green' | 'lime' | 'mint' | 'sky';
    highContrast?: boolean;
    radius?: 'none' | 'small' | 'medium' | 'large' | 'full'
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}

export const ButtonContainer = (props: ButtonProps) => {
   const { children, size = '2', variant = 'solid', color = 'gold', highContrast = false, radius = 'medium', loading = false, disabled = false, onClick } = props;
    return (
      <Button
        size={size}
        variant={variant}
        color={color}
        highContrast={highContrast}
        radius={radius}
        loading={loading}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </Button>
    );
}