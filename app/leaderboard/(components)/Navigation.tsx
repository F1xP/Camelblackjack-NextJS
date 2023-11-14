'use client';
import Dropdown from '@/app/components/Dropdown';
import { LeaderboardDataProps } from '@/types/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const Navigation: React.FC<{ leaderboardData: LeaderboardDataProps }> = ({ leaderboardData }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage: string = searchParams.get('page')?.toString() || '1';
  const currentRows: string = searchParams.get('rows')?.toString() || '5';
  const totalPages: number = Math.ceil(leaderboardData?.length / Number(currentRows));

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

  return (
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
  );
};

export default Navigation;
