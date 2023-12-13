'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const LeaderboardHead: React.FC = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setFilter = (filter: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('filter', filter.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <thead>
      <tr>
        <th className="px-4 py-2">Rank</th>
        <th className="px-4 py-2">User</th>
        <th
          className="px-4 py-2"
          onClick={() => setFilter('coins')}>
          Coins
        </th>
        <th
          className="px-4 py-2"
          onClick={() => setFilter('games')}>
          Games Played
        </th>
        <th
          className="px-4 py-2"
          onClick={() => setFilter('win')}>
          Win Rate
        </th>
      </tr>
    </thead>
  );
};

export default LeaderboardHead;
