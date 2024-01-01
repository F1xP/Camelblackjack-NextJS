'use client';
import Dropdown from '@/app/_components/ui/Dropdown';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MdOutlineKeyboardDoubleArrowRight, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const TableNavigation: React.FC<{ dataLength: number }> = ({ dataLength }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentPage: string = searchParams.get('page')?.toString() || '1';
  const currentRows: string = searchParams.get('rows')?.toString() || '5';
  const totalPages: number = Math.ceil(dataLength / Number(currentRows));

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
        <p className="text-text dark:text-dark_text font-bold text-lg">Rows per page</p>
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

      <p className="text-text dark:text-dark_text font-bold text-lg">
        Page {currentPage} of {totalPages}
      </p>

      <div className="text-text dark:text-dark_text flex flex-row text-3xl justify-center items-center gap-1">
        {[
          {
            icon: <MdOutlineKeyboardDoubleArrowRight />,
            onClick: () => setPage(1),
          },
          {
            icon: <MdOutlineKeyboardArrowRight />,
            onClick: () => setPage(Number(currentPage) - 1),
          },
          {
            icon: <MdOutlineKeyboardArrowRight />,
            onClick: () => setPage(Number(currentPage) + 1),
          },
          {
            icon: <MdOutlineKeyboardDoubleArrowRight />,
            onClick: () => setPage(totalPages),
          },
        ].map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`border border-secondary dark:border-dark_secondary rounded-sm hover:bg-secondary dark:hover:bg-dark_secondary transition-all duration-300 ${
              index === 0 || index === 1 ? 'rotate-180' : ''
            }`}>
            {button.icon}
          </button>
        ))}
      </div>
    </section>
  );
};

export default TableNavigation;
