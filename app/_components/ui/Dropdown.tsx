'use client';
import React, { useState, useEffect, useRef } from 'react';

type DropdownProps = {
  list: { value: any; name: any }[];
  current: any;
  setCurrent: (newValue: any) => void;
};
const Dropdown: React.FC<DropdownProps> = ({ list, current, setCurrent }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false);
    };

    if (isDropdownOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <section
      className="relative"
      ref={dropdownRef}>
      <button
        className="bg-transparent px-2 py-0.5 border border-secondary dark:border-dark_secondary text-text dark:text-dark_text font-bold text-lg rounded-sm flex flex-row justify-center items-center min-w-[60px]"
        onClick={() => setIsDropdownOpen((current) => !current)}>
        <p className="mr-auto">{current}</p>
        <svg
          className="h-6 w-6 text-text dark:text-dark_text"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isDropdownOpen && (
        <div className="flex flex-col bg-background dark:bg-dark_background w-auto absolute top-8 border border-secondary dark:border-dark_secondary rounded-sm p-1 min-w-[60px]">
          {list.map((item, index) => (
            <button
              onClick={() => {
                setCurrent(item.value);
                setIsDropdownOpen(false);
              }}
              className="w-full bg-transparent px-2 py-0.5 text-text dark:text-dark_text hover:bg-secondary dark:hover:bg-dark_secondary rounded-sm font-bold"
              key={index}>
              {item.name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Dropdown;
