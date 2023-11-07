import type { Metadata } from 'next';
import { GeistSans } from 'geist/font';
import { getServerSession } from 'next-auth';
import SessionProvider from './components/SessionProvider';
import Navbar from './components/Navbar';
import { authOptions } from './lib/authOptions';
import './globals.css';

export const metadata: Metadata = {
  title: 'Camel Blackjack',
  description: 'Camel Blackjack built with NextJS',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${GeistSans.className} bg-background font-sans`}>
        <SessionProvider
          session={session}
          refetchInterval={5 * 60}>
          <div id="side-navbar-portal-root"></div>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
