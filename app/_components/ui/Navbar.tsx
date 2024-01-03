'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import SideNavbar from './SideNavbar';
import UserDropdown from './UserDropdown';
import ThemeDropdown from './ThemeDropdown';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const location = usePathname();
  const { data: session } = useSession();

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
    <nav className="fixed w-full h-12 bg-primary dark:bg-dark_primary flex px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64 flex-row items-center z-20">
      <Link
        className="flex flex-row gap-2 h-full justify-center items-center"
        href={'/'}>
        <Image
          src={'/CamelBlackjackLogo.png'}
          alt={''}
          width={33}
          height={33}
        />
        <p className="text-accent text-[1.3rem] font-black small-caps text-3xl hidden sm:block whitespace-nowrap">
          <span className="text-text dark:text-dark_text">C</span>amel{' '}
          <span className="text-text dark:text-dark_text">B</span>lackjack
        </p>
      </Link>
      <div className="hidden h-full ml-5 md:flex flex-row justify-center items-center">
        {Links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-accent small-caps text-[1.2rem] font-bold hover:text-text dark:hover:text-dark_text hover:bg-secondary dark:hover:bg-dark_secondary px-4 h-full flex justify-center items-center transition-all duration-300 ${
                link.href === location
                  ? 'border-b-3 border-secondary dark:border-dark_secondary text-text dark:text-dark_text'
                  : 'border-none'
              }`}>
              {link.name}
            </Link>
          );
        })}
      </div>
      <ThemeDropdown />
      {!session ? (
        <button
          className="flex-row hidden md:flex h-10 justify-center items-center gap-1 border rounded-md text-text dark:text-dark_text border-secondary dark:border-dark_secondary text-[1.2rem] hover:bg-secondary dark:hover:bg-dark_secondary cursor-pointer transition-all duration-300"
          onClick={() => signIn('google')}>
          <div className="bg-secondary dark:bg-dark_secondary h-10 p-2 flex justify-center items-center rounded-md rounded-r-none">
            <Image
              src={'/Google.svg'}
              alt={''}
              width={20}
              height={20}
            />
          </div>
          <p className="font-bold p-1 px-3 small-caps">Sign In </p>
        </button>
      ) : (
        <div className="relative hidden md:flex">
          <button
            className="flex-row flex h-10 justify-center items-center gap-1 border rounded-md text-text dark:text-dark_text border-secondary dark:border-dark_secondary text-[1.2rem] hover:bg-secondary dark:hover:bg-dark_secondary cursor-pointer transition-all duration-300"
            onClick={(e) => {
              setIsDropdownOpen((current) => !current);
              e.stopPropagation();
            }}>
            <div className="bg-secondary dark:bg-dark_secondary h-10 p-2 flex justify-center items-center rounded-md rounded-r-none flex-shrink-0">
              <Image
                src={session?.user?.image || ''}
                alt={''}
                width={28}
                height={28}
                className="rounded-full"
              />
            </div>
            <p className="font-bold p-1 px-3 small-caps whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px] lg:max-w-xs mb-0.5">
              {session?.user?.name || ''}
            </p>
          </button>
          <UserDropdown
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
          />
        </div>
      )}
      <SideNavbar />
    </nav>
  );
}
