import type { Metadata } from 'next';
import { GeistSans } from 'geist/font';
import Navbar from './components/Navbar';
import { getServerSession } from 'next-auth';
import SessionProvider from './components/SessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Camel Blackjack',
  description: 'Camel Blackjack built with NextJS',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${GeistSans.className} bg-background font-sans`}>
        <SessionProvider session={session}>
          <div id="side-navbar-portal-root"></div>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
