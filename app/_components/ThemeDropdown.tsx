'use client';
import { useTheme } from 'next-themes';
import React, { useEffect, useRef, useState } from 'react';
import { CiDark, CiLight } from 'react-icons/ci';

export default function ThemeDropdown() {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };

    if (isDropdownOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen, setIsDropdownOpen]);

  if (!mounted) return null;

  return (
    <div className="relative ml-auto hidden md:flex mr-2">
      <button
        className="flex-row flex h-10 w-10 justify-center items-center gap-1 border rounded-md text-text border-secondary text-[1.2rem] hover:bg-secondary cursor-pointer transition-all duration-300"
        onClick={(e) => {
          setIsDropdownOpen((current) => !current);
          e.stopPropagation();
        }}>
        {theme === 'dark' ? <CiDark size={24} /> : <CiLight size={28} />}
      </button>
      {isDropdownOpen && (
        <section
          ref={dropdownRef}
          className="bg-primary w-28 text-text text-md font-semibold absolute top-[3.1rem] right-0 border gap-1 border-secondary p-1 rounded-md flex-col justify-center items-center">
          {['Light', 'Dark', 'System'].map((item, index: number) => {
            return (
              <React.Fragment key={index}>
                {index === 2 && <div className="border-t border-secondary w-full my-1"></div>}
                <button
                  className="hover:bg-secondary py-1 px-2 rounded-sm w-full transition-all duration-300 flex justify-center items-center"
                  onClick={() => {
                    setTheme(item.toLowerCase());
                    setIsDropdownOpen(false);
                  }}>
                  <p>{item}</p>
                </button>
              </React.Fragment>
            );
          })}
        </section>
      )}
    </div>
  );
}
