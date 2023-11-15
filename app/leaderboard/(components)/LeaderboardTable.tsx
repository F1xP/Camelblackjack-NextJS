'use client';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { LeaderboardDataProps } from '@/types/types';

const LeaderboardTable: React.FC<{ leaderboardData: LeaderboardDataProps }> = ({ leaderboardData }) => {
  const searchParams = useSearchParams();

  const currentPage: string = searchParams.get('page')?.toString() || '1';
  const currentRows: string = searchParams.get('rows')?.toString() || '5';

  const startIndex: number = (Number(currentPage) - 1) * Number(currentRows);
  const endIndex: number = startIndex + Number(currentRows);

  const dataToDisplay = leaderboardData?.slice(startIndex, endIndex);

  return (
    <div className="w-full overflow-auto min-w-[320px] border-[0.5px] border-secondary">
      <table className="table-auto w-full text-left text-accent">
        <thead>
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Coins</th>
            <th className="px-4 py-2">Games Played</th>
            <th className="px-4 py-2">Win Rate</th>
          </tr>
        </thead>
        <tbody>
          {dataToDisplay?.map((player: any, index: number) => (
            <tr
              key={index}
              className="border-t-[0.5px] border-secondary text-text font-semibold">
              <td className="px-4 py-2 ordinal">
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
              <td className="px-4 py-2 flex flex-row gap-1 items-center">
                <Image
                  className="rounded-full"
                  src={player.image}
                  alt={''}
                  width={38}
                  height={38}
                />
                <p>{player.name}</p>
              </td>
              <td className="px-4 py-2">{player.coins}</td>
              <td className="px-4 py-2">{player.games}</td>
              <td className="px-4 py-2">{`${(player.wins / player.games) * 100}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>{' '}
    </div>
  );
};

export default LeaderboardTable;
