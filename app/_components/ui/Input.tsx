'use client';
import React, { InputHTMLAttributes, useRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const inputVariants = cva('outline-none transition-all duration-300', {
  variants: {
    variant: {
      default:
        'font-mono bg-primary dark:bg-dark_primary font-bold border-[1.8px] border-secondary dark:border-dark_secondary dark:focus:border-accent focus:border-accent text-text dark:text-dark_text placeholder-text/50 dark:placeholder-dark_text/50',
      transparent:
        'bg-transparent text-text dark:text-dark_text border-[1.8px] border-secondary dark:border-dark_secondary dark:focus:border-accent focus:border-accent placeholder-text/50 dark:placeholder-dark_text/50',
      none: '',
    },
    paddingRounding: {
      xs: 'p-0.5 rounded-xsm',
      sm: 'p-0.5 rounded-sm',
      md: 'p-1 rounded-sm',
      lg: 'p-2 rounded-sm',
      xl: 'p-2 rounded-md',
      none: '',
    },
    fontSize: {
      xs: 'text-xsm',
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
      none: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    fontSize: 'lg',
    paddingRounding: 'lg',
  },
});

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  forwardedRef?: React.Ref<HTMLInputElement>;
}

export const Input: React.FC<InputProps> = ({
  className,
  variant,
  fontSize,
  paddingRounding,
  forwardedRef,
  children,
  ...props
}) => {
  return (
    <div className="flex flex-row">
      <input
        ref={forwardedRef}
        className={cn('h-full w-full', inputVariants({ variant, fontSize, paddingRounding, className }))}
        {...props}
      />
      {children}
    </div>
  );
};
