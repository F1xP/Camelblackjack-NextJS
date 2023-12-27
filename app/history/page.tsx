import { prisma } from '@/lib/prisma';
import Navigation from './_components/Navigation';
import { Header } from '../_components/ui/Header';
import GameHistoryTable from './_components/GameHistoryTable';
// Game Bet ID / Date / Bet Amount / Multiplier / Payout
// Total Bets / Number of Wins / Number of Losses / Wagered

export default async function History() {
  const gameHistory = await prisma.game.findMany({
    where: {
      active: false,
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
