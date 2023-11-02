'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SideNavbar from './SideNavbar';

export default function Navbar() {
  const location = usePathname();
  const Links = [
    {
      name: 'Play',
      href: '/play',
    },
    {
      name: 'Leaderboard',
      href: '/leaderboard',
    },
  ];

  return (
    <nav className="w-full h-12 bg-[#0a0c20] flex px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64 flex-row items-center">
      <Link
        className="flex flex-row gap-2 h-full justify-center items-center"
        href={'/'}>
        <Image
          src={'/CamelblackjackLogo.png'}
          alt={''}
          width={33}
          height={33}
        />
        <p className="text-accent text-[1.3rem] font-bold font-serif small-caps text-3xl hidden sm:block">
          <span className="text-text">C</span>amel <span className="text-text">B</span>lackjack
        </p>
      </Link>
      <div className="hidden h-full ml-5 md:flex flex-row justify-center items-center">
        {Links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-accent small-caps text-[1.2rem] font-bold hover:text-text hover:bg-text/20 px-4 h-full flex justify-center items-center ${
                link.href === location ? 'border-b border-text text-text' : ''
              }`}>
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="flex-row hidden md:flex h-10 ml-auto justify-center items-center gap-1 border rounded-md text-text border-secondary text-[1.2rem] hover:bg-secondary cursor-pointer transition-all duration-300">
        <div className="bg-secondary h-10 p-2 flex justify-center items-center rounded-md rounded-r-none">
          <Image
            src={'/Google.svg'}
            alt={''}
            width={20}
            height={20}
          />
        </div>
        <p className="font-bold p-1 px-3 small-caps mb-1">Sign In </p>
      </div>
      <SideNavbar
        list={[]}
        current={undefined}
        setCurrent={function (newValue: any): void {
          throw new Error('Function not implemented.');
        }}
      />
    </nav>
  );
}
