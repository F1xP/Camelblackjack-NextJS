import { cn } from '@/lib/utils';
import { CardType } from '@/types/types';
import { GameState } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import { Card, DownCard } from './Card';

type GameDisplayProps = {
  gameState: GameState | undefined;
  currentHand: number;
  isSplitted: boolean;
  status1: { state: string; text: string } | null;
  status2: { state: string; text: string } | null;
  gameId: string | undefined;
};

export const GameDisplay: React.FC<GameDisplayProps> = ({
  gameState,
  currentHand,
  isSplitted,
  status1,
  status2,
  gameId,
}) => {
  return (
    <section className="w-full flex-[3] min-w-[300px] sm:min-w-[500px] md:min-w-[600px] h-[500px] lg:h-[700px] overflow-hidden relative pointer-events-none">
      <Decoration />
      <div className="flex flex-col justify-between h-full">
        <div className="w-full flex justify-around flex-row-reverse absolute bottom-1">
          <Hand
            cards={gameState?.player[0].cards}
            handValues={
              <>
                {gameState?.player[0].value[0]}
                {gameState?.player[0].value[1] && `,${gameState?.player[0].value[1]}`}
              </>
            }
            status={status1}
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
              status={status2}
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
            status={null}
            isCurrent={false}
            isSplitted={false}
            gameId={gameId}
          />
        </div>
      </div>
    </section>
  );
};

type HandProps = {
  cards: CardType[] | undefined;
  downCard?: boolean;
  handValues: React.ReactNode;
  status: { state: string; text: string } | null;
  isCurrent: boolean;
} & Pick<GameDisplayProps, 'gameId' | 'isSplitted'>;

const Hand: React.FC<HandProps> = ({ cards, downCard, handValues, status, isCurrent, isSplitted, gameId }) => {
  return (
    <div className="flex items-center justify-center flex-col relative">
      <Result
        status={status}
        handValues={handValues}
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
              status={status}
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

type ResultProps = Pick<HandProps, 'handValues' | 'status' | 'isCurrent' | 'isSplitted'>;

const Result: React.FC<ResultProps> = ({ handValues, status, isCurrent, isSplitted }) => {
  return (
    <div className="flex flex-col gap-0.5">
      {status && (
        <p
          className={cn(
            'px-2 text-black font-bold font-mono rounded-sm text-center',
            isCurrent && !status && isSplitted
              ? 'bg-accentBlue'
              : status?.state === 'Push'
              ? 'bg-accent'
              : status?.state === 'Lose' || status?.state === 'DBJ'
              ? 'bg-accentRed'
              : status?.state === 'Win' || status?.state === 'PBJ'
              ? 'bg-accentGreen'
              : 'bg-gray'
          )}>
          {status?.text}
        </p>
      )}
      <p
        className={cn(
          'px-2 text-black font-bold font-mono rounded-sm text-center',
          isCurrent && !status && isSplitted
            ? 'bg-accentBlue'
            : status?.state === 'Push'
            ? 'bg-accent'
            : status?.state === 'Lose' || status?.state === 'DBJ'
            ? 'bg-accentRed'
            : status?.state === 'Win' || status?.state === 'PBJ'
            ? 'bg-accentGreen'
            : 'bg-gray'
        )}>
        {handValues}
      </p>
    </div>
  );
};

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
        <p className="font-bold font-mono text-xl md:text-2xl text-center bg-secondary dark:bg-dark_secondary px-3 py-1 rounded-md whitespace-nowrap">
          BLACKJACK PAYS 3 TO 2
        </p>
        <p className="font-bold font-mono text-lg md:text-xl text-center bg-transparent px-3 py-1 rounded-md whitespace-nowrap">
          INSURANCE PAYS 2 TO 1
        </p>
      </div>
    </>
  );
};
