'use client';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import Image from 'next/image';
import Dropdown from '../components/Dropdown';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [LeaderboardData, setLeaderboardData] = useState<any>(null);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage: string = searchParams.get('page')?.toString() || '1';
  const currentRows: string = searchParams.get('rows')?.toString() || '5';

  const totalPages: number = Math.ceil(LeaderboardData?.length / Number(currentRows));
  const startIndex: number = (Number(currentPage) - 1) * Number(currentRows);
  const endIndex: number = startIndex + Number(currentRows);

  const dataToDisplay = LeaderboardData?.slice(startIndex, endIndex);

  const setPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams);
    if (page) params.set('page', page.toString());
    else params.delete('page');
    replace(`${pathname}?${params.toString()}`);
  };

  const setRowsPerPage = (rows: '5' | '10' | '15' | '20') => {
    const params = new URLSearchParams(searchParams);
    if (rows) params.set('rows', rows);
    else params.delete('rows');
    replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const getLeaderboardData = async () => {
      const response = await axios.get('/api/leaderboard');
      if (response.data) setLeaderboardData(response.data);
    };
    getLeaderboardData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 justify-center py-10 px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64">
      <h1 className="text-5xl text-accent font-bold font-sans text-left w-full small-caps">Leaderboard</h1>
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
                    1<span className="absolute -top-2">st</span>
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
        </table>
      </div>

      <section className="flex flex-row flex-wrap whitespace-nowrap gap-4 justify-center items-center">
        <div className="flex flex-row gap-1">
          <p className="text-text font-bold text-lg">Rows per page</p>
          <Dropdown
            list={[
              { name: '5', value: 5 },
              { name: '10', value: 10 },
              { name: '15', value: 15 },
              { name: '20', value: 20 },
            ]}
            current={currentRows}
            setCurrent={setRowsPerPage}
          />
        </div>

        <p className="text-text font-bold text-lg">
          Page {currentPage} of {totalPages}
        </p>

        <div className="text-text flex flex-row text-3xl justify-center items-center gap-1">
          <button
            onClick={() => setPage(1)}
            className="border border-secondary rounded-sm hover:bg-secondary transition-all duration-300 rotate-180">
            <MdOutlineKeyboardDoubleArrowRight />
          </button>
          <button
            onClick={() => setPage(Number(currentPage) - 1)}
            className="border border-secondary rounded-sm hover:bg-secondary transition-all duration-300 rotate-180">
            <MdOutlineKeyboardArrowRight />
          </button>
          <button
            onClick={() => setPage(Number(currentPage) + 1)}
            className="border border-secondary rounded-sm hover:bg-secondary transition-all duration-300">
            <MdOutlineKeyboardArrowRight />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            className="border border-secondary rounded-sm hover:bg-secondary transition-all duration-300">
            <MdOutlineKeyboardDoubleArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
}
