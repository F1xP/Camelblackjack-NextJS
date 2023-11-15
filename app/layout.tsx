import type { Metadata } from 'next';
import { GeistSans } from 'geist/font';
import { getServerSession } from 'next-auth';
import SessionProvider from './components/SessionProvider';
import Navbar from './components/Navbar';
import { NextUIProvider } from '@/lib/nextui';
import { ToastsDisplay, ToastsProvider } from './components/Toasts';
import { nextAuthOptions } from './api/auth/[...nextauth]/route';
import './globals.css';

export const metadata: Metadata = {
  title: 'Camel Blackjack',
  description: 'Camel Blackjack built with NextJS',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(nextAuthOptions);

  return (
    <html lang="en">
      <body className={`${GeistSans.className} font-sans`}>
        <ToastsProvider>
          <NextUIProvider>
            <SessionProvider
              session={session}
              refetchInterval={5 * 60}
              refetchOnWindowFocus={true}>
              <div id="portal-root"></div>
              <ToastsDisplay />
              <Navbar />
              <main className="bg-background flex min-h-screen gap-2 flex-col items-center justify-center py-10 px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64">
                <span className="mt-2"></span>
                {children}
              </main>
            </SessionProvider>
          </NextUIProvider>
        </ToastsProvider>
      </body>
    </html>
  );
}
