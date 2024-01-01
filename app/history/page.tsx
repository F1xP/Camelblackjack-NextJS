import { prisma } from '@/lib/prisma';
import Navigation from './_components/Navigation';
import { Header } from '../_components/ui/Header';
import GameHistoryTable from './_components/GameHistoryTable';
import { GameHistoryData } from '@/types/types';

export default async function History() {
  const gameHistory: GameHistoryData[] | null = await prisma.game.findMany({
    where: {
      active: false,
    },
    select: {
      id: true,
      state: true,
      hashedSeed: true,
      payout: true,
      createdAt: true,
    },
  });

  return (
    <>
      <Header className="mb-4 self-start">History</Header>
      <GameHistoryTable ganeHistory={gameHistory} />
      <Navigation dataLength={gameHistory.length} />
    </>
  );
}
