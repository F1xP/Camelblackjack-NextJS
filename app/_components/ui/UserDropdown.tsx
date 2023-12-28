'use client';
import { useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { PiSignOutBold } from 'react-icons/pi';
import { ImStatsDots } from 'react-icons/im';
import { AiOutlineUser } from 'react-icons/ai';
import { LuUserCog } from 'react-icons/lu';
import Link from 'next/link';

type UserDropdownProps = {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
};

export default function UserDropdown({ isDropdownOpen, setIsDropdownOpen }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };

    if (isDropdownOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen, setIsDropdownOpen]);

  return (
    <>
      {isDropdownOpen && session && (
        <section
          ref={dropdownRef}
          className="bg-primary dark:bg-dark_primary w-40 text-text dark:text-dark_text text-md font-semibold absolute top-[3.1rem] right-0 border gap-1 border-secondary dark:border-dark_secondary p-1 rounded-md flex-col justify-center items-center">
          <Link
            onClick={() => setIsDropdownOpen(false)}
            className="hover:bg-secondary dark:hover:bg-dark_secondary py-1 px-2 rounded-sm w-full transition-all duration-300 flex justify-center items-center"
            href={`/profile/${session.user.id}`}>
            <AiOutlineUser className="mr-auto" />
            <p className="mr-auto">Profile</p>
          </Link>
          <Link
            onClick={() => setIsDropdownOpen(false)}
            className="hover:bg-secondary dark:hover:bg-dark_secondary py-1 px-2 rounded-sm w-full transition-all duration-300 flex justify-center items-center"
            href={'/history'}>
            <ImStatsDots className="mr-auto h-3" />
            <p className="mr-auto">History</p>
          </Link>
          <Link
            onClick={() => setIsDropdownOpen(false)}
            className="hover:bg-secondary dark:hover:bg-dark_secondary py-1 px-2 rounded-sm w-full transition-all duration-300 flex justify-center items-center"
            href={'/settings'}>
            <LuUserCog className="mr-auto" />
            <p className="mr-auto">Settings</p>
          </Link>
          <div className="border-t border-secondary dark:border-dark_secondary w-full my-1"></div>
          <button
            className="hover:bg-secondary dark:hover:bg-dark_secondary py-1 px-2 rounded-sm w-full transition-all duration-300 text-red-500 dark:text-red-500 flex justify-center items-center"
            onClick={() => signOut({ callbackUrl: '/' })}>
            <PiSignOutBold className="mr-auto" />
            <p className="mr-auto">Sign Out</p>
          </button>
        </section>
      )}
    </>
  );
}
