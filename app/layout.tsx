import type { Metadata } from 'next';
import { GeistSans } from 'geist/font';
import { getServerSession } from 'next-auth';
import SessionProvider from './components/SessionProvider';
import Navbar from './components/Navbar';
import { authOptions } from '../lib/authOptions';
import { NextUIProvider } from '../lib/nextui';
import './globals.css';
import { ToasterProvider, useToaster } from './components/Toast';

export const metadata: Metadata = {
  title: 'Camel Blackjack',
  description: 'Camel Blackjack built with NextJS',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${GeistSans.className} bg-background font-sans`}>
        <ToasterProvider>
          <NextUIProvider>
            <SessionProvider
              session={session}
              refetchInterval={5 * 60}
              refetchOnWindowFocus={true}>
              <div id="portal-root"></div>
              <Navbar />
              {children}
            </SessionProvider>
          </NextUIProvider>
        </ToasterProvider>
      </body>
    </html>
  );
}
