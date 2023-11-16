'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '../components/Toasts';
import { Button } from '../components/Button';
import { Game } from '@/types/types';

export default function Play() {
  const { addToast, removeToast, toasts } = useToast();
  const [betAmount, setBetAmount] = useState<number>(0);
  const [gameData, setGameData] = useState<Game>(null);
  const [currentHand, setCurrentHand] = useState<number>(0);

  const playerData = gameData?.state?.player[currentHand];

  const hit: boolean = playerData?.value?.[0] !== undefined ? playerData.value[0] < 21 : false;
  const stand: boolean = playerData?.value?.[0] !== undefined ? playerData.value[0] < 21 : false;
  const double: boolean = playerData?.actions[-1] === 'deal' || playerData?.actions[-1] === 'split';
  const split: boolean =
    gameData?.state?.player?.length === 1 &&
    playerData?.cards?.length === 2 &&
    playerData?.cards[0].rank === playerData?.cards[1].rank;

  const handleNewBet = async () => {
    const response = await axios.post('/api/blackjack', { betAmount });
    if (response.data?.data) setGameData(response.data?.data);
  };

  const handleAction = async (action: 'hit' | 'stand' | 'double' | 'split') => {
    const response = await axios.patch('/blackjack', { action });
    if (response.data?.data) setGameData(response.data?.data);
  };

  useEffect(() => {
    const getGameData = async () => {
      const response = await axios.get('/api/blackjack');
      if (response.data?.data) setGameData(response.data?.data);
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
    <>
      <p className="text-text">
        Player Value: {gameData?.state?.player[currentHand]?.value[0]}{' '}
        {gameData?.state?.player[currentHand]?.value[1] && `,${gameData?.state?.player[currentHand]?.value[1]}`}{' '}
      </p>
      <p className="text-text">Dealer Value: {gameData?.state?.dealer?.value[0]}</p>

      <div className="flex flex-row w-full rounded-lg border border-secondary bg-black/30 mt-10 flex-nowrap md:flex-wrap">
        <section className="h-[600px] w-full flex-1 flex flex-col">
          <div className="flex flex-col p-2">
            <p className="text-text text-xl font-mono small-caps">Bet Amount</p>
            <input
              type="number"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
              className="bg-transparent text-text border rounded-md border-text text-xl px-2 py-1 outline-none focus:border-accent transition-all duration-300 mb-2"
            />
            <Button
              variant={'outlined'}
              size={'xl'}
              disabled={gameData?.active || true}
              onClick={() => handleNewBet()}>
              BET
            </Button>
          </div>
          <div className="flex flex-col p-1 gap-1 mt-auto">
            <div className="flex flex-row gap-1">
              <Button
                variant={'outlined'}
                size={'md'}
                disabled={!hit}
                onClick={() => handleAction('hit')}
                className="flex-1">
                HIT
              </Button>
              <Button
                variant={'outlined'}
                size={'md'}
                disabled={!stand}
                onClick={() => handleAction('stand')}
                className="flex-1">
                STAND
              </Button>
            </div>
            <div className="flex flex-row gap-1">
              <Button
                variant={'outlined'}
                size={'md'}
                disabled={!split}
                onClick={() => handleAction('split')}
                className="flex-1">
                SPLIT
              </Button>
              <Button
                variant={'outlined'}
                size={'md'}
                disabled={!double}
                onClick={() => handleAction('double')}
                className="flex-1">
                DOUBLE
              </Button>
            </div>
          </div>
        </section>
        <section className="bg-black/30 h-[600px] w-full flex-[2] rounded-r-lg text-text overflow-hidden relative">
          <div className="flex flex-col justify-between h-full p-2">
            <div className="w-full flex justify-around flex-row-reverse absolute top-1">
              <div className="flex items-center justify-center flex-col relative">
                <div className="flex relative item-start mt-1 min-h-[7.9rem] min-w-[5rem]">
                  {gameData?.state?.player[currentHand]?.cards?.map((card: any, index: number) => {
                    return (
                      <div
                        className="w-20 h-32 bg-white rounded-md shadow-sm shadow-black d-card-animation"
                        key={index}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          marginTop: `${index}rem`,
                          marginLeft: index > 0 ? '-2.5rem' : '0',
                          transform: `translate(0px, -1000px)`,
                        }}>
                        <p className="text-black font-mono text-5xl font-bold ml-2">{card?.rank}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="w-full flex justify-around flex-row-reverse absolute bottom-1">
              <div className="flex items-center justify-center flex-col relative">
                <div className="flex relative item-start mb-1 min-h-[7.9rem] min-w-[5rem]">
                  {gameData?.state?.dealer?.cards?.map((card: any, index: number) => {
                    return (
                      <div
                        className="w-20 h-32 bg-white rounded-md shadow-sm shadow-black p-card-animation"
                        key={index}
                        style={{
                          animationDelay: `${index * 100}ms`,
                          marginTop: `${index}rem`,
                          marginLeft: index > 0 ? '-2.5rem' : '0',
                          transform: `translate(0px, 1000px)`,
                        }}>
                        <p className="text-black font-mono text-5xl font-bold ml-2">{card?.rank}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
