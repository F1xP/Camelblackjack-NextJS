'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const LeaderboardHead: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const order: string = searchParams.get('order')?.toString() || 'desc';
  const currentFilter = searchParams.get('filter')?.toString();

  const setFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('filter', filter.toString());
    if (filter === currentFilter) params.set('order', order === 'desc' ? 'asc' : 'desc');
    replace(`${pathname}?${params.toString()}`);
  };
  return (
    <thead className="w-full text-left">
      <tr>
        <th className="px-4 py-2">Rank</th>
        <th className="px-4 py-2">User</th>
        <th
          className="px-4 py-2 hover:underline cursor-pointer"
          onClick={() => setFilter('coins')}>
          Coins
          {currentFilter === 'coins' && (
            <MdOutlineKeyboardArrowRight
              className={`${order === 'asc' ? 'rotate-90' : 'rotate-[270deg]'}`}
              size={25}
            />
          )}
        </th>
        <th
          className="px-4 py-2 hover:underline cursor-pointer flex flex-row items-center justify-start text-left"
          onClick={() => setFilter('games')}>
          Games Played
          {currentFilter === 'games' && (
            <MdOutlineKeyboardArrowRight
              className={`min-w-[1.5rem] min-h-[1.5rem] self-start ${
                order === 'asc' ? 'rotate-90' : 'rotate-[270deg]'
              }`}
            />
          )}
        </th>
        <th
          className="px-4 py-2 hover:underline cursor-pointer"
          onClick={() => setFilter('win')}>
          Win Rate
          {currentFilter === 'win' && (
            <MdOutlineKeyboardArrowRight
              className={`${order === 'asc' ? 'rotate-90' : 'rotate-[270deg]'}`}
              size={25}
            />
          )}
        </th>
      </tr>
    </thead>
  );
};

export default LeaderboardHead;
