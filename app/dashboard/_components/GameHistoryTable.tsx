'use client';
import { useSearchParams } from 'next/navigation';
import { Game } from '@/types/types';
import GameHistoryHead from './GameHistoryHead';

const GameHistoryTable: React.FC<{ ganeHistory: Game[] }> = ({ ganeHistory }) => {
  const searchParams = useSearchParams();

  const currentPage: string = searchParams.get('page')?.toString() || '1';
  const currentRows: string = searchParams.get('rows')?.toString() || '5';
  const currentFilter: string = searchParams.get('filter')?.toString() || 'coins';
  const currentOrder: string = searchParams.get('order')?.toString() || 'desc';

  const startIndex: number = (Number(currentPage) - 1) * Number(currentRows);
  const endIndex: number = startIndex + Number(currentRows);

  const compensation = Number(Number(currentPage) - 1) * Number(currentRows);

  const dataToDisplay = ganeHistory?.slice(startIndex, endIndex);

  return (
    <div className="w-full overflow-auto min-w-[320px] border-[0.5px] border-secondary">
      <table className="table-auto w-full text-left text-accent">
        <GameHistoryHead />
        <tbody>
          {dataToDisplay?.map((game: Game, index: number) => (
            <tr
              key={index}
              className="border-t-[0.5px] transition-all duration-300 border-secondary text-text font-semibold w-full hover:bg-secondary">
              <td className="px-4 py-2">{game.id}</td>
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
