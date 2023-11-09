import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentUser();
  if (!session) {
    <main className="flex min-h-screen flex-col items-center gap-2 justify-center py-10 px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64">
      <p className="text-text">Unautorized, redirecting...</p>
    </main>;
    redirect('/');
  }

  return <> {children}</>;
}
