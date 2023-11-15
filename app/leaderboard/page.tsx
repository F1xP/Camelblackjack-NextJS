import { prisma } from '@/lib/prisma';
import LeaderboardTable from './(components)/LeaderboardTable';
import Navigation from './(components)/Navigation';
import Header from '../components/Header';

export default async function Leaderboard() {
  const leaderboardData = await prisma.user.findMany();

  return (
    <>
      <Header text="Leaderboard" />
      <LeaderboardTable leaderboardData={leaderboardData} />
      <Navigation leaderboardData={leaderboardData} />
    </>
  );
}
