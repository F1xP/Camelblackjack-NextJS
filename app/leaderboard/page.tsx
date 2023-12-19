import { prisma } from '@/lib/prisma';
import LeaderboardTable from './_components/LeaderboardTable';
import Navigation from './_components/Navigation';
import { Header } from '../_components/Header';

export default async function Leaderboard() {
  const leaderboardData = await prisma.user.findMany();

  const leaderboardDataWithWinRate = leaderboardData?.map((item) => ({
    ...item,
    winRate: (item.wins / item.games) * 100 || 0,
  }));

  return (
    <>
      <Header className="mb-4 self-start">Leaderboard</Header>
      <LeaderboardTable leaderboardData={leaderboardDataWithWinRate} />
      <Navigation leaderboardData={leaderboardDataWithWinRate} />
    </>
  );
}
