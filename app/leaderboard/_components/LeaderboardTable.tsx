'use client';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { UserLeaderboardData } from '@/types/types';
import LeaderboardHead from './LeaderboardHead';
import { BiSolidMedal } from 'react-icons/bi';
import { RiStarSFill } from 'react-icons/ri';
import Link from 'next/link';

const LeaderboardTable: React.FC<{ leaderboardData: UserLeaderboardData[] }> = ({ leaderboardData }) => {
  const searchParams = useSearchParams();

  const currentPage: string = searchParams.get('page')?.toString() || '1';
  const currentRows: string = searchParams.get('rows')?.toString() || '5';
  const currentFilter: string = searchParams.get('filter')?.toString() || 'coins';
  const currentOrder: string = searchParams.get('order')?.toString() || 'desc';

  const startIndex: number = (Number(currentPage) - 1) * Number(currentRows);
  const endIndex: number = startIndex + Number(currentRows);

  const compensation = Number(Number(currentPage) - 1) * Number(currentRows);

  const dataToDisplay = leaderboardData
    ?.slice()
    .sort((a, b) => {
      if (currentFilter === 'coins') return currentOrder === 'asc' ? a.coins - b.coins : b.coins - a.coins;
      if (currentFilter === 'games') return currentOrder === 'asc' ? a.games - b.games : b.games - a.games;
      if (currentFilter === 'win') return currentOrder === 'asc' ? a.winRate - b.winRate : b.winRate - a.winRate;
      return 0;
    })
    ?.slice(startIndex, endIndex);

  return (
    <div className="w-full overflow-auto min-w-[320px] border-[0.5px] border-secondary dark:border-dark_secondary">
      <table className="table-auto w-full text-left text-accent">
        <LeaderboardHead />
        <tbody>
          {dataToDisplay?.map((player, index) => (
            <tr
              key={index}
              className="border-t-[0.5px] transition-all duration-300 border-secondary dark:border-dark_secondary text-text dark:text-dark_text font-semibold w-full hover:bg-secondary dark:hover:bg-dark_secondary">
              <td className="px-4 py-2">
                <LeaderboardPlace
                  index={index}
                  compensation={compensation}
                />
              </td>
              <td className="px-4 py-2">
                <Link
                  href={`/profile/${player.id}`}
                  className="flex flex-row gap-1 items-center justify-start flex-wrap">
                  <Image
                    className="rounded-full"
                    src={player.image || ''}
                    alt={''}
                    width={38}
                    height={38}
                  />
                  {player.name}
                </Link>
              </td>
              <td className="px-4 py-2">{player.coins}</td>
              <td className="px-4 py-2">{player.games}</td>
              <td className="px-4 py-2">{`${player.winRate}%`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;

const LeaderboardPlace: React.FC<{ index: number; compensation: number }> = ({ index, compensation }) => {
  const indexPlus = index + compensation;
  return (
    <p className="relative text-lg small-caps">
      {indexPlus <= 2 ? (
        <span className="relative">
          <BiSolidMedal
            size={35}
            style={{
              color:
                indexPlus === 0 ? 'rgb(255, 215, 0)' : indexPlus === 1 ? 'rgb(192, 192, 192)' : 'rgb(205, 127, 50)',
            }}
          />
          <RiStarSFill
            size={15}
            color="FFFFFF"
            className="absolute top-2.5 left-4 opacity-0 shine"
          />
        </span>
      ) : (
        <>
          {indexPlus + 1}
          {indexPlus + (1 % 10) === 1 && indexPlus + (1 % 100) !== 11 ? (
            <span className="absolute -top-2">st</span>
          ) : indexPlus + (1 % 10) === 2 && indexPlus + (1 % 100) !== 12 ? (
            <span className="absolute -top-2">nd</span>
          ) : indexPlus + (1 % 10) === 3 && indexPlus + (1 % 100) !== 13 ? (
            <span className="absolute -top-2">rd</span>
          ) : (
            <span className="absolute -top-2">th</span>
          )}
        </>
      )}
    </p>
  );
};
