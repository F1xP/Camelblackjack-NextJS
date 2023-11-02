import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-64 justify-center py-10">
      <section className="flex flex-row w-full justify-center items-center gap-4">
        <div className="flex-[2]">
          <h1 className="text-accent text-[4rem] font-bold font-serif small-caps whitespace-nowrap">
            <span className="text-text whitespace-nowrap">C</span>amel{' '}
            <span className="text-text whitespace-nowrap">B</span>lackjack
          </h1>
          <p className="text-text text-2xl font-semibold mb-5">
            Test your Blackjack skills and aim for the top of the leaderboard!
          </p>
          <button className="bg-primary py-2 text-2xl font-bold text-accent rounded-md flex justify-center items-center hover:text-text transition-all duration-300 w-56">
            Play Now
          </button>
        </div>

        <Image
          src={'/CamelBlackjackLogo.png'}
          alt={''}
          width={1000}
          height={1000}
          className="flex-1 flex-shrink"
        />
      </section>
    </main>
  );
}
