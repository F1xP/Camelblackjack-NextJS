'use client';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { LeaderboardDataProps } from '@/types/types';
import LeaderboardHead from './LeaderboardHead';

const LeaderboardTable: React.FC<{ leaderboardData: LeaderboardDataProps }> = ({ leaderboardData }) => {
  const searchParams = useSearchParams();

  const currentPage: string = searchParams.get('page')?.toString() || '1';
  const currentRows: string = searchParams.get('rows')?.toString() || '5';
  const currentFilter: string = searchParams.get('filter')?.toString() || 'coins';
  const currentOrder: string = searchParams.get('order')?.toString() || 'desc';

  const startIndex: number = (Number(currentPage) - 1) * Number(currentRows);
  const endIndex: number = startIndex + Number(currentRows);

  const dataToDisplay =
    currentFilter === 'coins'
      ? leaderboardData
          ?.sort((a, b) => (currentOrder === 'desc' ? a.games - b.games : b.games - a.games))
          ?.slice(startIndex, endIndex)
          ?.map((item) => ({ ...item, winRate: (item.wins / item.games) * 100 || 0 }))
      : currentFilter === 'games'
      ? leaderboardData
          ?.sort((a, b) => (currentOrder === 'desc' ? a.games - b.games : b.games - a.games))
          ?.slice(startIndex, endIndex)
          ?.map((item) => ({ ...item, winRate: (item.wins / item.games) * 100 || 0 }))
      : currentFilter === 'win'
      ? leaderboardData
          ?.sort((a, b) => (currentOrder === 'desc' ? a.games - b.games : b.games - a.games))
          ?.slice(startIndex, endIndex)
          ?.map((item) => ({ ...item, winRate: (item.wins / item.games) * 100 || 0 }))
      : leaderboardData
          ?.sort((a, b) => (currentOrder === 'desc' ? a.games - b.games : b.games - a.games))
          ?.slice(startIndex, endIndex)
          ?.map((item) => ({ ...item, winRate: (item.wins / item.games) * 100 || 0 }));

  return (
    <div className="w-full overflow-auto min-w-[320px] border-[0.5px] border-secondary">
      <table className="table-auto w-full text-left text-accent">
        <LeaderboardHead />
        <tbody>
          {dataToDisplay?.map((player: any, index: number) => (
            <>
              <tr
                key={index}
                className="border-t-[0.5px] border-secondary text-text font-semibold flex w-full">
                <td className="px-4 py-2 ordinal flex-1">
                  <p className="relative text-lg small-caps">
                    {index + 1}
                    {index + (1 % 10) === 1 && index + (1 % 100) !== 11 ? (
                      <span className="absolute -top-2">st</span>
                    ) : index + (1 % 10) === 2 && index + (1 % 100) !== 12 ? (
                      <span className="absolute -top-2">nd</span>
                    ) : index + (1 % 10) === 3 && index + (1 % 100) !== 13 ? (
                      <span className="absolute -top-2">rd</span>
                    ) : (
                      <span className="absolute -top-2">th</span>
                    )}
                  </p>
                </td>
                <td className="px-4 py-2 flex flex-row gap-1 items-center justify-start flex-1 overflow-hidden">
                  <Image
                    className="rounded-full"
                    src={player.image}
                    alt={''}
                    width={38}
                    height={38}
                  />
                  {player.name}
                </td>
                <td className="px-4 py-2 flex-1">{player.coins}</td>
                <td className="px-4 py-2 flex-1">{player.games}</td>
                <td className="px-4 py-2 flex-1">{`${(player.wins / player.games) * 100}%`}</td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
