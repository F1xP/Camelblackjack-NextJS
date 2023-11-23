import Image from 'next/image';
import { Button } from './components/Button';
import { BsFillSuitClubFill, BsFillSuitHeartFill, BsFillSuitDiamondFill, BsFillSuitSpadeFill } from 'react-icons/bs';

export default function Home() {
  const icons = [
    <BsFillSuitClubFill
      key={1}
      size={32}
      color={'#000000'}
    />,
    <BsFillSuitSpadeFill
      key={2}
      size={32}
      color={'#000000'}
    />,
    <BsFillSuitDiamondFill
      key={3}
      size={32}
      color={'#FF0000'}
    />,
    <BsFillSuitHeartFill
      key={4}
      size={32}
      color={'#FF0000'}
    />,
  ];

  return (
    <section className="flex flex-row w-full justify-center items-center gap-10 flex-wrap sm:flex-nowrap">
      <div className="flex-[2] flex flex-col items-center sm:items-start">
        <h1 className="text-accent text-[2rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[4rem] font-black small-caps whitespace-nowrap">
          <span className="text-text whitespace-nowrap">C</span>amel{' '}
          <span className="text-text whitespace-nowrap">B</span>lackjack
        </h1>
        <p className="text-text text-lg md:text-xl lg:text-2xl font-bold mb-5 text-center sm:text-left">
          Test your Blackjack skills and aim for the top of the leaderboard!
        </p>
        <Button
          href="/play"
          className="group">
          <p className="z-10">PLAY NOW</p>
          <div className={`absolute opacity-40 group-hover:opacity-0 transition-all duration-1000 z-0`}>
            {icons[Math.floor(Math.random() * icons.length)]}
          </div>
        </Button>
      </div>
      <div className="flex-shrink flex-grow max-w-[300px]">
        <Image
          src="/CamelBlackjackLogo.png"
          alt=""
          width={500}
          height={500}
        />
      </div>
    </section>
  );
}
