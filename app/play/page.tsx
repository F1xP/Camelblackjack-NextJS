'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Play() {
  const [betAmount, setBetAmount] = useState<number>(0);
  const [gameData, setGameData] = useState<any>(null);
  const [currentHand, setCurrentHand] = useState<number>(0);

  const playerData = gameData?.data?.state?.player[currentHand];

  const hit: boolean = playerData?.value[0] < 21;
  const stand: boolean = playerData?.value[0] < 21;
  const double: boolean = playerData?.actions[-1] === 'deal' || playerData?.actions[-1] === 'split';
  const split: boolean =
    gameData?.data?.state?.player?.length === 1 &&
    playerData?.cards?.length === 2 &&
    playerData?.cards[0].rank === playerData?.cards[1].rank;

  const handleNewBet = async () => {
    const response = await axios.post('/api/blackjack', { betAmount });
    if (response.data) setGameData(response.data);
  };

  const handleAction = async (action: 'hit' | 'stand' | 'double' | 'split') => {
    const response = await axios.patch('/blackjack', { action });
    if (response.data) setGameData(response.data);
  };

  useEffect(() => {
    const getGameData = async () => {
      const response = await axios.get('/api/blackjack');
      if (response.data) setGameData(response.data);
    };
    getGameData();
  }, []);

  useEffect(() => {
    const checkGameStatus = async () => {
      console.log('Checking game status');
    };
    checkGameStatus();
  }, [gameData]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 justify-center py-10 px-4 sm:px-14 md:px-18 lg:px-44 xl:px-64">
      <div className="bg-orange-500 relative w-full min-h-[250px] flex-grow">
        <div className="bg-blue-300 flex w-full justify-center">
          <div className="bg-yellow-300 flex relative items-start mt-1">
            <div className="bg-blue-200 w-10 h-10 transform translate-x-0 translate-y-0 ml-0 mt-0">
              <div>das</div>
            </div>
            <div className="bg-red-200 w-10 h-10 transform translate-x-0 translate-y-0 ml-2 mt-1">
              <div>das</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row w-full rounded-lg border border-secondary bg-black/30 mt-10">
        <section className="h-[600px] w-full flex-1 flex flex-col">
          <div className="flex flex-col p-2">
            <p className="text-text text-xl font-mono small-caps">Bet Amount</p>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="bg-transparent text-text border rounded-md border-text text-xl px-2 py-1 outline-none focus:border-accent transition-all duration-300 mb-2"
            />
            <button
              disabled={false}
              onClick={() => handleNewBet()}
              className="font-mono flex-1 py-2 text-lg bg-secondary border border-secondary font-bold text-text rounded-md flex justify-center items-center hover:border-text transition-all duration-300">
              BET
            </button>
          </div>
          <div className="flex flex-col p-2 gap-2 mt-auto">
            <div className="flex flex-row gap-2">
              <button
                disabled={!hit}
                onClick={() => handleAction('hit')}
                className="disabled:opacity-25 disabled:cursor-not-allowed font-mono flex-1 py-2 text-lg bg-secondary border border-secondary font-bold text-text rounded-md flex justify-center items-center hover:border-text transition-all duration-300">
                HIT
              </button>
              <button
                disabled={!stand}
                onClick={() => handleAction('stand')}
                className="disabled:opacity-25 disabled:cursor-not-allowed font-mono flex-1 py-2 text-lg bg-secondary border border-secondary font-bold text-text rounded-md flex justify-center items-center hover:border-text transition-all duration-300">
                STAND
              </button>
            </div>
            <div className="flex flex-row gap-2">
              <button
                disabled={!split}
                onClick={() => handleAction('split')}
                className="disabled:opacity-25 disabled:cursor-not-allowed font-mono flex-1 py-2 text-lg bg-secondary border border-secondary font-bold text-text rounded-md flex justify-center items-center hover:border-text transition-all duration-300">
                SPLIT
              </button>
              <button
                disabled={!double}
                onClick={() => handleAction('double')}
                className="disabled:opacity-25 disabled:cursor-not-allowed font-mono flex-1 py-2 text-lg bg-secondary border border-secondary font-bold text-text rounded-md flex justify-center items-center hover:border-text transition-all duration-300">
                DOUBLE
              </button>
            </div>
          </div>
        </section>

        <section className="bg-black/30 h-[600px] w-full flex-[2] rounded-r-lg text-text">
          <p>
            Value: {gameData?.data?.state?.player[currentHand]?.value[0]}{' '}
            {gameData?.data?.state?.player[currentHand]?.value[1] &&
              `,${gameData?.data?.state?.player[currentHand]?.value[1]}`}{' '}
          </p>
          <div className="flex w-full justify-around flex-row-reverse bg-blue-500">
            <div className="flex items-center justify-center flex-col relative bg-red-500">
              <div className="flex items-start mt-1 relative">
                {gameData?.data?.state?.player[currentHand]?.cards?.map((card: any, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`w-20 h-32 mt-[${index}rem] ${
                        index > 0 && 'ml-2.5'
                      } bg-blue-300 border overflow-hidden`}
                      style={{ zIndex: index }}>
                      <p>
                        Player Card: {card?.rank} Suit: {card?.suit}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
