'use client';
import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';

export default function ThProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return <ThemeProvider>{children}</ThemeProvider>;
}
