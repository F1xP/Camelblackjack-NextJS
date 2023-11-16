import Image from 'next/image';
import { Button } from './components/Button';

export default function Home() {
  return (
    <section className="flex flex-row w-full justify-center items-center gap-10 flex-wrap sm:flex-nowrap">
      <div className="flex-[2] flex flex-col items-center sm:items-start">
        <h1 className="text-accent text-[2rem] sm:text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[4rem] font-bold font-serif small-caps whitespace-nowrap">
          <span className="text-text whitespace-nowrap">C</span>amel{' '}
          <span className="text-text whitespace-nowrap">B</span>lackjack
        </h1>
        <p className="text-text text-lg md:text-xl lg:text-2xl font-semibold mb-5 text-center sm:text-left">
          Test your Blackjack skills and aim for the top of the leaderboard!
        </p>
        <Button href="/play">PLAY NOW</Button>
      </div>
      <div className="flex-shrink flex-grow max-w-[300px]">
        <Image
          src="/CamelBlackjackLogo.png"
          alt=""
          width={1000}
          height={1000}
        />
      </div>
    </section>
  );
}
