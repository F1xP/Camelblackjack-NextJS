'use client';
import { useSession, signOut } from 'next-auth/react';
import { PiSignOutBold } from 'react-icons/pi';
import { ImStatsDots } from 'react-icons/im';
import { AiOutlineUser } from 'react-icons/ai';
import { useEffect, useRef } from 'react';
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
      {isDropdownOpen && session?.user && (
        <section
          ref={dropdownRef}
          className="bg-[#0a0c20] w-40 text-text text-md font-semibold absolute top-[3.1rem] right-0 border gap-1 border-secondary p-1 rounded-md flex-col justify-center items-center">
          <Link
            className="hover:bg-secondary py-1 px-2 rounded-sm w-full transition-all duration-300 flex justify-center items-center"
            href={'/profile'}>
            <AiOutlineUser className="mr-auto" />
            <p className="mr-auto">Profile</p>
          </Link>
          <Link
            className="hover:bg-secondary py-1 px-2 rounded-sm w-full transition-all duration-300 flex justify-center items-center"
            href={'/dashboard'}>
            <ImStatsDots className="mr-auto h-3" />
            <p className="mr-auto">Dashboard</p>
          </Link>
          <span className="border-t border-secondary w-full"></span>
          <button
            className="hover:bg-secondary py-1 px-2 rounded-sm w-full transition-all duration-300 text-red-500 flex justify-center items-center"
            onClick={() => signOut()}>
            <PiSignOutBold className="mr-auto" />
            <p className="mr-auto">Sign Out</p>
          </button>
        </section>
      )}
    </>
  );
}
