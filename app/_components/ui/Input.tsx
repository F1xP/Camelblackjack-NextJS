import React, { InputHTMLAttributes } from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const inputVariants = cva('outline-none transition-all duration-300', {
  variants: {
    variant: {
      default:
        'font-mono bg-primary dark:bg-dark_primary font-bold border-[1.8px] border-secondary dark:border-dark_secondary dark:focus:border-accent focus:border-accent text-text dark:text-dark_text',
      transparent:
        'bg-transparent text-text dark:text-dark_text border-[1.8px] border-secondary dark:border-dark_secondary dark:focus:border-accent focus:border-accent',
    },
    size_: {
      xs: 'p-0.5 text-xsm rounded-xsm',
      sm: 'p-0.5 text-sm rounded-sm',
      md: 'p-1 text-md rounded-sm',
      lg: 'p-1 text-lg rounded-sm',
      xl: 'p-2 text-xl rounded-md',
    },
  },
  defaultVariants: {
    variant: 'default',
    size_: 'lg',
  },
});

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

export const Input: React.FC<InputProps> = ({ className, children, variant, size_, ...props }) => {
  return (
    <input
      className={cn(inputVariants({ variant, size_, className }))}
      {...props}>
      {children}
    </input>
  );
};
