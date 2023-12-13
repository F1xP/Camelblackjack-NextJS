import { prisma } from '@/lib/prisma';
import LeaderboardTable from './_components/LeaderboardTable';
import Navigation from './_components/Navigation';
import { Header } from '../_components/Header';

export default async function Leaderboard() {
  const leaderboardData = await prisma.user.findMany();

  return (
    <>
      <Header className="mb-4 self-start">Leaderboard</Header>
      <LeaderboardTable leaderboardData={leaderboardData} />
      <Navigation leaderboardData={leaderboardData} />
    </>
  );
}
