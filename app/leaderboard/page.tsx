import { prisma } from '@/lib/prisma';
import LeaderboardTable from './_components/LeaderboardTable';
import { Header } from '../_components/ui/Header';
import { UserLeaderboardData } from '@/types/types';
import TableNavigation from '../_components/ui/TableNavigation';

export default async function Leaderboard() {
  const leaderboardData: Omit<UserLeaderboardData, 'winRate'>[] | null = await prisma.user.findMany();

  const leaderboardDataWithWinRate: UserLeaderboardData[] = leaderboardData?.map((user) => ({
    ...user,
    winRate: user.games !== 0 ? Number(((user.wins / user.games) * 100).toFixed(0)) : 0,
  }));
  return (
    <>
      <Header className="mb-4 self-start">Leaderboard</Header>
      <LeaderboardTable leaderboardData={leaderboardDataWithWinRate} />
      <TableNavigation dataLength={leaderboardDataWithWinRate.length} />
    </>
  );
}
