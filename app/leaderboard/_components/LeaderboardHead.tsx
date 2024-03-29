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
        {[
          { filter: 'coins', text: 'Coins' },
          { filter: 'games', text: 'Games Played' },
          { filter: 'win', text: 'Win Rate' },
        ].map((item) => {
          return (
            <th
              key={item.filter}
              className="px-4 py-2 hover:underline cursor-pointer"
              onClick={() => setFilter(item.filter)}>
              <p className="flex flex-row">
                {item.text}
                {currentFilter === item.filter && (
                  <MdOutlineKeyboardArrowRight
                    className={`min-w-[1.5rem] min-h-[1.5rem] self-start ${
                      order === 'asc' ? 'rotate-90' : 'rotate-[270deg]'
                    }`}
                  />
                )}
              </p>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default LeaderboardHead;
