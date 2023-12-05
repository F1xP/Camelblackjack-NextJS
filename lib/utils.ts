import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const getErrorMessage = (error: unknown): string => {
  let message: string;
  if (error instanceof Error) message = error.message;
  else if (error && typeof error === 'object' && 'message' in error) message = String(error.message);
  else if (typeof error === 'string') message = error;
  else message = 'An unexpected error occured';
  return message;
};

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
