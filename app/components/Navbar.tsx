'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <main className="w-full h-12 bg-[#0a0c20] px-64 flex flex-row items-center">
      <Link
        className="flex flex-row gap-2 h-full justify-center items-center"
        href={'/'}>
        <Image
          src={'/CamelblackjackLogo.png'}
          alt={''}
          width={33}
          height={33}
        />
        <p className="text-accent text-[1.3rem] font-bold font-serif small-caps text-3xl">
          <span className="text-text">C</span>amel <span className="text-text">B</span>lackjack
        </p>
      </Link>
      <div className="flex flex-row justify-center items-center h-full ml-5">
        {Links.map((link) => {
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`text-accent text-[1.2rem] font-bold hover:text-text hover:bg-text/20 px-4 h-full flex justify-center items-center ${
                link.href === location ? 'border-b border-text text-text' : ''
              }`}>
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="flex flex-row h-10 ml-auto gap-1 border rounded-md p-1 px-3 text-text border-secondary text-[1.2rem] hover:bg-secondary cursor-pointer transition-all duration-300">
        <Image
          src={'/Google.svg'}
          alt={''}
          width={20}
          height={20}
        />
        <p className="font-bold">Sign In </p>
      </div>
    </main>
  );
}
