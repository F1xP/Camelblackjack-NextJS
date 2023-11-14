import { prisma } from '@/lib/authOptions';
import LeaderboardTable from './(components)/LeaderboardTable';
import Navigation from './(components)/Navigation';

export default async function Leaderboard() {
  const leaderboardData = await prisma.user.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 justify-center py-10 px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64">
      <h1 className="text-5xl text-accent font-bold font-sans text-left w-full small-caps">Leaderboard</h1>
      <div className="w-full overflow-auto min-w-[320px] border-[0.5px] border-secondary">
        <LeaderboardTable leaderboardData={leaderboardData} />
      </div>
      <Navigation leaderboardData={leaderboardData} />
    </main>
  );
}
