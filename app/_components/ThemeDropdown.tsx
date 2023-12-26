'use client';
import { useEffect, useRef, useState } from 'react';
import { CiDark, CiLight } from 'react-icons/ci';

export default function ThemeDropdownButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const currentTheme = localStorage.getItem('theme') || null;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const systemDarkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = localStorage.getItem('theme') || (systemDarkModePreference ? 'dark' : null);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [currentTheme]);

  return (
    <div className="relative ml-auto hidden md:flex mr-2">
      <button
        className="flex-row flex h-10 justify-center items-center gap-1 border rounded-md text-text border-secondary text-[1.2rem] hover:bg-secondary cursor-pointer transition-all duration-300"
        onClick={(e) => {
          setIsDropdownOpen((current) => !current);
          e.stopPropagation();
        }}>
        <div className="h-10 p-2 flex justify-center items-center rounded-md rounded-r-none flex-shrink-0">
          {currentTheme === 'dark' ? <CiDark size={28} /> : <CiLight size={28} />}
        </div>
      </button>
      <ThemeDropdown
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        currentTheme={currentTheme}
      />
    </div>
  );
}

type ThemeDropdownProps = {
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
  currentTheme: string | null;
};

function ThemeDropdown({ isDropdownOpen, setIsDropdownOpen, currentTheme }: ThemeDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleTheme = () => {
    if (!currentTheme) localStorage.setItem('theme', 'dark');
    else localStorage.removeItem('theme');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };

    if (isDropdownOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen, setIsDropdownOpen]);

  return (
    <>
      {isDropdownOpen && (
        <section
          ref={dropdownRef}
          className="bg-secondary_bg w-28 text-text text-md font-semibold absolute top-[3.1rem] right-0 border gap-1 border-secondary p-1 rounded-md flex-col justify-center items-center">
          <button
            className="hover:bg-secondary py-1 px-2 rounded-sm w-full transition-all duration-300 flex justify-center items-center"
            onClick={() => {
              toggleTheme();
              setIsDropdownOpen(false);
            }}>
            <p>Light</p>
          </button>
          <button
            className="hover:bg-secondary py-1 px-2 rounded-sm w-full transition-all duration-300 flex justify-center items-center"
            onClick={() => {
              toggleTheme();
              setIsDropdownOpen(false);
            }}>
            <p>Dark</p>
          </button>
          <div className="border-t border-secondary w-full my-1"></div>
          <button
            className="hover:bg-secondary py-1 px-2 rounded-sm w-full transition-all duration-300 flex justify-center items-center"
            onClick={() => {
              localStorage.removeItem('theme');
              setIsDropdownOpen(false);
            }}>
            <p>System</p>
          </button>
        </section>
      )}
    </>
  );
}
