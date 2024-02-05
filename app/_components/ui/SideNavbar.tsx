'use client';
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import UserDropdown from './UserDropdown';

const SideNavbar: React.FC = () => {
  const [isSideNavbarOpen, setIsSideNavbarOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const navbarRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) setIsSideNavbarOpen(false);
    };

    if (isSideNavbarOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isSideNavbarOpen]);

  return (
    <>
      <svg
        onClick={() => setIsSideNavbarOpen(true)}
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="40px"
        height="40px"
        viewBox="0 0 122.88 95.95"
        className="block md:hidden min-h-[40px] fill-accent hover:bg-secondary dark:hover:bg-dark_secondary p-1 rounded-md cursor-pointer transition-all duration-300 hover:fill-text mb-1 self-end">
        <g>
          <path d="M8.94,0h105c4.92,0,8.94,4.02,8.94,8.94l0,0c0,4.92-4.02,8.94-8.94,8.94h-105C4.02,17.88,0,13.86,0,8.94l0,0 C0,4.02,4.02,0,8.94,0L8.94,0z M8.94,78.07h105c4.92,0,8.94,4.02,8.94,8.94l0,0c0,4.92-4.02,8.94-8.94,8.94h-105 C4.02,95.95,0,91.93,0,87.01l0,0C0,82.09,4.02,78.07,8.94,78.07L8.94,78.07z M8.94,39.03h105c4.92,0,8.94,4.02,8.94,8.94l0,0 c0,4.92-4.02,8.94-8.94,8.94h-105C4.02,56.91,0,52.89,0,47.97l0,0C0,43.06,4.02,39.03,8.94,39.03L8.94,39.03z" />
        </g>
      </svg>

      {isSideNavbarOpen &&
        ReactDOM.createPortal(
          <div className="fixed h-full w-full bg-black/70 z-40">
            <aside
              ref={navbarRef}
              className={`fixed z-50 bg-background dark:bg-dark_background p-6 shadow-lg inset-y-0 right-0 h-full border-l border-secondary dark:border-dark_secondary sm:max-w-sm w-[300px] sm:w-[540px] flex flex-col ${
                isSideNavbarOpen && 'animate-slide-in'
              }`}>
              <svg
                onClick={() => setIsSideNavbarOpen(false)}
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="35px"
                height="35px"
                viewBox="0 0 121.31 122.876"
                enableBackground="new 0 0 121.31 122.876"
                className="min-h-[35px] fill-accent hover:bg-secondary dark:hover:bg-dark_secondary p-1 rounded-md cursor-pointer transition-all duration-300 hover:fill-text mb-1 self-end">
                <g>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M90.914,5.296c6.927-7.034,18.188-7.065,25.154-0.068 c6.961,6.995,6.991,18.369,0.068,25.397L85.743,61.452l30.425,30.855c6.866,6.978,6.773,18.28-0.208,25.247 c-6.983,6.964-18.21,6.946-25.074-0.031L60.669,86.881L30.395,117.58c-6.927,7.034-18.188,7.065-25.154,0.068 c-6.961-6.995-6.992-18.369-0.068-25.397l30.393-30.827L5.142,30.568c-6.867-6.978-6.773-18.28,0.208-25.247 c6.983-6.963,18.21-6.946,25.074,0.031l30.217,30.643L90.914,5.296L90.914,5.296z"
                  />
                </g>
              </svg>
              {session && (
                <div className="relative">
                  <button
                    className="w-full bg-background dark:bg-dark_background mb-1 px-10 h-12 cursor-pointer font-bold border border-secondary dark:border-dark_secondary text-text dark:text-dark_text rounded-md flex flex-shrink-0 justify-center items-center hover:bg-secondary dark:hover:bg-dark_secondary transition-all duration-300 relative"
                    onClick={(e) => {
                      setIsDropdownOpen((current) => !current);
                      e.stopPropagation();
                    }}>
                    <div className="bg-secondary dark:bg-dark_secondary h-full p-2 flex justify-center items-center rounded-md rounded-r-none flex-shrink-0 absolute left-0">
                      <Image
                        src={session?.user?.image || ''}
                        alt={''}
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                    </div>
                    <p className="font-bold text-ellipsis overflow-hidden whitespace-nowrap ml-3">
                      {session?.user?.name || ''}
                    </p>
                  </button>
                  <UserDropdown
                    isDropdownOpen={isDropdownOpen}
                    setIsDropdownOpen={setIsDropdownOpen}
                  />
                </div>
              )}
              {Links.map((link) => {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="bg-background dark:bg-dark_background mb-1 h-12 px-10 font-bold border border-secondary dark:border-dark_secondary text-text dark:text-dark_text rounded-md flex flex-shrink-0 justify-center items-center hover:bg-secondary dark:hover:bg-dark_secondary transition-all duration-300">
                    <p> {link.name}</p>
                  </Link>
                );
              })}
              {!session ? (
                <button
                  className="bg-background dark:bg-dark_background mb-1 mt-auto px-10 h-12 cursor-pointer font-bold border border-secondary dark:border-dark_secondary text-text dark:text-dark_text rounded-md flex flex-shrink-0 justify-center items-center hover:bg-secondary dark:hover:bg-dark_secondary transition-all duration-300 relative"
                  onClick={() => signIn('google')}>
                  <Image
                    src={'/Google.svg'}
                    alt={''}
                    width={50}
                    height={50}
                    className="bg-secondary dark:bg-dark_secondary flex h-12 px-3 justify-center items-center rounded-md rounded-r-none absolute left-0"
                  />
                  <p className="font-bold">Sign In </p>
                </button>
              ) : (
                <button
                  className="bg-background dark:bg-dark_background mb-1 mt-auto px-10 h-12 cursor-pointer font-bold border border-secondary dark:border-dark_secondary text-text dark:text-dark_text rounded-md flex flex-shrink-0 justify-center items-center hover:bg-secondary dark:hover:bg-dark_secondary transition-all duration-300 relative"
                  onClick={() => signOut({ callbackUrl: '/' })}>
                  <Image
                    src={'/Google.svg'}
                    alt={''}
                    width={50}
                    height={50}
                    className="bg-secondary dark:bg-dark_secondary flex h-12 px-3 justify-center items-center rounded-md rounded-r-none absolute left-0"
                  />
                  <p className="font-bold">Sign Out </p>
                </button>
              )}
            </aside>
          </div>,
          document.getElementById('portal-root')!
        )}
    </>
  );
};

export default SideNavbar;
