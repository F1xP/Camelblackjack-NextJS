import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <footer className="w-full bg-black/10 flex flex-col items-center">
        <span className="border-t-2 border-secondary w-full"></span>
        <div className="flex flex-row justify-center items-center gap-2 my-2">
          <Image
            src={'/CamelBlackjackLogo.png'}
            alt={''}
            width={30}
            height={30}
          />
          <p className="text-text font-bold text-md font-sans">
            <Link
              href={''}
              className="hover:opacity-80 transition-all duration-300">
              {' '}
              Open Source Project
            </Link>
            <span className="text-text"> Built by </span>
            <Link
              href={'https://github.com/F1xP'}
              className="text-accent hover:opacity-80 transition-all duration-300 font-bold">
              F1x
            </Link>
          </p>
        </div>
      </footer>
    </>
  );
}
