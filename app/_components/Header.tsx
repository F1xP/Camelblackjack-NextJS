import React, { HTMLAttributes } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const headerVariants = cva('small-caps font-sans font-bold text-left', {
  variants: {
    variant: {
      default: 'text-accent',
    },
    size: {
      xs: 'text-xl',
      sm: 'text-2xl',
      md: 'text-3xl',
      lg: 'text-4xl',
      xl: 'text-5xl',
      default: 'text-4xl lg:text-5xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface HeaderProps extends HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headerVariants> {}

export const Header = React.forwardRef<HTMLHeadingElement, HeaderProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    return (
      <h1
        className={cn(headerVariants({ variant, size, className }))}
        ref={ref}
        {...props}>
        {children}
      </h1>
    );
  }
);

Header.displayName = 'Header';
