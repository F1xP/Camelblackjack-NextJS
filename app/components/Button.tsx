import React, { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'flex justify-center items-center disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-white text-secondary_bg hover:text-background hover:-translate-y-1 hover:bg-text font-extrabold font-sans duration-1000',
        transparent: 'font-mono border-2 border-secondary font-bold text-text hover:bg-secondary',
        outlined: 'font-mono text-lg bg-secondary border border-secondary font-bold text-text hover:border-text',
      },
      size: {
        xs: 'py-1 px-4 text-xs rounded-sm',
        sm: 'py-1.5 px-6 text-sm rounded-sm',
        md: 'py-1.5 px-8 text-md rounded-md',
        lg: 'py-2 px-10 text-lg rounded-md',
        xl: 'py-2 px-12 text-xl rounded-md',
        default:
          'py-1 px-4 text-xs sm:py-2 sm:px-6 text-sm md:py-2 md:px-8 text-md lg:py-2 lg:px-10 text-lg xl:py-2 xl:px-12 text-xl rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  href?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, href, variant, size, ...props }, ref) => {
    if (href) {
      return (
        <Link
          href={href}
          className={cn(buttonVariants({ variant, size, className }))}>
          {children}
        </Link>
      );
    }
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}>
        {children}
      </button>
    );
  }
);
