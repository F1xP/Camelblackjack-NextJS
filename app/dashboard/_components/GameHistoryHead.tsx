'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';

const GameHistoryHead: React.FC = () => {
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
        <th className="px-4 py-2">Game ID</th>
        <th
          className="px-4 py-2 hover:underline cursor-pointer"
          onClick={() => setFilter('coins')}>
          <p className="flex flex-row">
            Date
            {currentFilter === 'coins' && (
              <MdOutlineKeyboardArrowRight
                className={`min-w-[1.5rem] min-h-[1.5rem] self-start ${
                  order === 'asc' ? 'rotate-90' : 'rotate-[270deg]'
                }`}
              />
            )}
          </p>
        </th>
        <th
          className="px-4 py-2 hover:underline cursor-pointer"
          onClick={() => setFilter('games')}>
          <p className="flex flex-row">
            Total Bet
            {currentFilter === 'games' && (
              <MdOutlineKeyboardArrowRight
                className={`min-w-[1.5rem] min-h-[1.5rem] self-start ${
                  order === 'asc' ? 'rotate-90' : 'rotate-[270deg]'
                }`}
              />
            )}
          </p>
        </th>
        <th
          className="px-4 py-2 hover:underline cursor-pointer"
          onClick={() => setFilter('win')}>
          <p className="flex flex-row">
            Payout
            {currentFilter === 'win' && (
              <MdOutlineKeyboardArrowRight
                className={`min-w-[1.5rem] min-h-[1.5rem] self-start ${
                  order === 'asc' ? 'rotate-90' : 'rotate-[270deg]'
                }`}
              />
            )}
          </p>
        </th>
      </tr>
    </thead>
  );
};

export default GameHistoryHead;
