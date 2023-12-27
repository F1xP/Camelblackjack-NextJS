'use client';

import { ThemeProvider as ThProvider } from 'next-themes';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThProvider
      attribute="class"
      defaultTheme="system"
      enableSystem>
      {children}
    </ThProvider>
  );
}
