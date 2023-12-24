import { cn } from '@/lib/utils';
import { CardType } from '@/types/types';
import { GameState } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import { Card, DownCard } from './Card';

type GameDisplayProps = {
  gameState: GameState | null;
  currentHand: number;
  isSplitted: boolean;
  gameStatus1: string | null;
  gameStatus2: string | null;
  gameId: string | undefined;
};

export const GameDisplay: React.FC<GameDisplayProps> = ({
  gameState,
  currentHand,
  isSplitted,
  gameStatus1,
  gameStatus2,
  gameId,
}) => {
  return (
    <>
      <section className="bg-black/30 w-full flex-[2] rounded-r-lg text-text overflow-hidden relative  pointer-events-none">
        <Decoration />
        <div className="flex flex-col justify-between h-full p-2">
          <div className="w-full flex justify-around flex-row-reverse absolute bottom-1">
            <Hand
              cards={gameState?.player[0].cards}
              handValues={
                <>
                  {gameState?.player[0].value[0]}
                  {gameState?.player[0].value[1] && `,${gameState?.player[0].value[1]}`}
                </>
              }
              gameStatus={gameStatus1}
              isCurrent={currentHand === 0}
              isSplitted={isSplitted}
              gameId={gameId}
            />
            {isSplitted && (
              <Hand
                cards={gameState?.player[1].cards}
                handValues={
                  <>
                    {gameState?.player[1].value[0]}
                    {gameState?.player[1].value[1] && `,${gameState?.player[1].value[1]}`}
                  </>
                }
                gameStatus={gameStatus2}
                isCurrent={currentHand === 1}
                isSplitted={isSplitted}
                gameId={gameId}
              />
            )}
          </div>
          <div className="w-full flex justify-around flex-row-reverse absolute top-1">
            <Hand
              cards={gameState?.dealer.cards}
              downCard={gameState?.dealer.cards.length === 1}
              handValues={<>{gameState?.dealer.value}</>}
              gameStatus={null}
              isCurrent={false}
              isSplitted={false}
              gameId={gameId}
            />
          </div>
        </div>
      </section>
    </>
  );
};

type HandProps = {
  cards: CardType[] | undefined;
  downCard?: boolean;
  handValues: React.ReactNode;
  gameStatus: string | null;
  isCurrent: boolean;
  isSplitted: boolean;
  gameId: string | undefined;
};

const Hand: React.FC<HandProps> = ({ cards, downCard, handValues, gameStatus, isCurrent, isSplitted, gameId }) => {
  return (
    <div className="flex items-center justify-center flex-col relative">
      <Result
        status={gameStatus}
        values={handValues}
        gameStatus={gameStatus}
        isCurrent={isCurrent}
        isSplitted={isSplitted}
      />
      <div className="flex relative item-start mt-1 min-h-[7.9rem] min-w-[5rem]">
        {cards?.map((card: any, index: number) => (
          <React.Fragment key={`${card?.rank}${card?.suit}${index}${gameId}`}>
            <Card
              index={index}
              rank={card?.rank}
              suit={card?.suit}
              gameStatus={gameStatus}
              isCurrent={isCurrent}
              isSplitted={isSplitted}
            />
            {downCard && <DownCard />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Result: React.FC<{
  status: string | null;
  values: React.ReactNode;
  gameStatus: string | null;
  isCurrent: boolean;
  isSplitted: boolean;
}> = ({ status, values, gameStatus, isCurrent, isSplitted }) => (
  <div className="flex flex-col gap-0.5">
    {status && (
      <p
        className={cn(
          'px-2 text-black font-bold font-mono rounded-sm text-center',
          isCurrent && !gameStatus && isSplitted
            ? 'bg-accentBlue'
            : gameStatus === 'Push'
            ? 'bg-accent'
            : gameStatus === 'Lose' || gameStatus === 'Blackjack Dealer'
            ? 'bg-accentRed'
            : gameStatus === 'Win' || gameStatus === 'Blackjack Player'
            ? 'bg-accentGreen'
            : 'bg-text'
        )}>
        {status}
      </p>
    )}
    <p
      className={cn(
        'px-2 text-black font-bold font-mono rounded-sm text-center',
        isCurrent && !gameStatus && isSplitted
          ? 'bg-accentBlue'
          : gameStatus === 'Push'
          ? 'bg-accent'
          : gameStatus === 'Lose' || gameStatus === 'Blackjack Dealer'
          ? 'bg-accentRed'
          : gameStatus === 'Win' || gameStatus === 'Blackjack Player'
          ? 'bg-accentGreen'
          : 'bg-text'
      )}>
      {values}
    </p>
  </div>
);

const Decoration: React.FC = () => {
  return (
    <>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
        <Image
          src="/CamelBlackjackLogo.png"
          className="opacity-5"
          alt=""
          width={400}
          height={400}
        />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2">
        <p className="font-bold font-mono text-xl md:text-2xl text-center bg-background px-3 py-1 rounded-md whitespace-nowrap">
          BLACKJACK PAYS 3 TO 2
        </p>
        <p className="font-bold font-mono text-lg md:text-xl text-center bg-transparent px-3 py-1 rounded-md whitespace-nowrap">
          INSURANCE PAYS 2 TO 1
        </p>
      </div>
    </>
  );
};
