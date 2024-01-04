'use client';
import { useSearchParams } from 'next/navigation';
import { GameHistoryData } from '@/types/types';
import GameHistoryHead from './GameHistoryHead';

const GameHistoryTable: React.FC<{
  ganeHistory: GameHistoryData[] | null;
}> = ({ ganeHistory }) => {
  const searchParams = useSearchParams();

  const currentPage: string = searchParams.get('page')?.toString() || '1';
  const currentRows: string = searchParams.get('rows')?.toString() || '5';
  const currentFilter: string = searchParams.get('filter')?.toString() || 'date';
  const currentOrder: string = searchParams.get('order')?.toString() || 'desc';

  const startIndex: number = (Number(currentPage) - 1) * Number(currentRows);
  const endIndex: number = startIndex + Number(currentRows);

  const dataToDisplay = ganeHistory
    ?.slice()
    .sort((a, b) => {
      if (currentFilter === 'date')
        return currentOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (currentFilter === 'bet') {
        const totalBetA = a.state.player[1]
          ? a.state.player.map((player) => player.amount).reduce((a, b) => a + b)
          : a.state.player[0].amount;
        const totalBetB = b.state.player[1]
          ? b.state.player.map((player) => player.amount).reduce((a, b) => a + b)
          : b.state.player[0].amount;
        return currentOrder === 'asc' ? totalBetA - totalBetB : totalBetB - totalBetA;
      }
      if (currentFilter === 'payout') return currentOrder === 'asc' ? a.payout - b.payout : b.payout - a.payout;
      return 0;
    })
    ?.slice(startIndex, endIndex);

  return (
    <div className="w-full overflow-auto min-w-[320px] border-[0.5px] border-secondary dark:border-dark_secondary">
      <table className="table-auto w-full text-left text-accent">
        <GameHistoryHead />
        <tbody>
          {dataToDisplay?.map((game, index: number) => (
            <tr
              key={index}
              className="border-t-[0.5px] transition-all duration-300 border-secondary dark:border-dark_secondary text-text dark:text-dark_text font-semibold w-full hover:bg-secondary dark:hover:bg-dark_secondary">
              <td className="px-4 py-2">{game.id}</td>
              <td className="px-4 py-2">{game.hashedSeed}</td>
              <td className="px-4 py-2">{new Date(game.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-2">
                {game.state.player[1]
                  ? game.state.player.map((player) => player.amount).reduce((a, b) => a + b)
                  : game.state.player[0].amount}
              </td>
              <td className="px-4 py-2">{game.payout}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GameHistoryTable;
