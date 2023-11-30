'use client';
import { suitIcons } from '@/app/components/Suits';
import { cn } from '@/lib/utils';
import { Card } from '@/types/types';
import { GameState } from '@prisma/client';

type GameDisplayProps = {
  gameState: GameState | null;
  currentHand: number;
  isSplitted: boolean;
  gameStatus1: string | null;
  gameStatus2: string | null;
};

export const GameDisplay: React.FC<GameDisplayProps> = ({
  gameState,
  currentHand,
  isSplitted,
  gameStatus1,
  gameStatus2,
}) => (
  <section className="bg-black/30 h-[600px] w-full flex-[2] rounded-r-lg text-text overflow-hidden relative">
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
          />
        )}
      </div>
      <div className="w-full flex justify-around flex-row-reverse absolute top-1">
        <Hand
          cards={gameState?.dealer.cards}
          handValues={<>{gameState?.dealer.value}</>}
          gameStatus={null}
          isCurrent={currentHand === 1}
          isSplitted={isSplitted}
        />
      </div>
    </div>
  </section>
);

type HandProps = {
  cards: Card[] | undefined;
  handValues: React.ReactNode;
  gameStatus: string | null;
  isCurrent: boolean;
  isSplitted: boolean;
};

const Hand: React.FC<HandProps> = ({ cards, handValues, gameStatus, isCurrent, isSplitted }) => {
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
          <Card
            key={index}
            index={index}
            rank={card?.rank}
            suit={card?.suit}
            gameStatus={gameStatus}
            isCurrent={isCurrent}
            isSplitted={isSplitted}
          />
        ))}
      </div>
    </div>
  );
};

const Card: React.FC<{
  index: number;
  rank: string;
  suit: string;
  gameStatus: string | null;
  isCurrent: boolean;
  isSplitted: boolean;
}> = ({ index, rank, suit, gameStatus, isCurrent, isSplitted }) => {
  const { icon, suitColor } = suitIcons(32)[suit as keyof typeof suitIcons] || {};
  return (
    <div
      className={cn(
        'w-20 h-32 bg-white rounded-md shadow-sm shadow-black p-card-animation border-3',
        isCurrent && !gameStatus && isSplitted
          ? 'border-accentBlue'
          : gameStatus === 'Push'
          ? 'border-accent'
          : gameStatus === 'Lose'
          ? 'border-accentRed'
          : gameStatus === 'Win'
          ? 'border-accentGreen'
          : 'border-transparent'
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        marginTop: `${index}rem`,
        marginLeft: index > 0 ? '-2.5rem' : '0',
        transform: `translate(0px, 1000px)`,
      }}>
      <p
        className={`font-mono text-5xl font-bold ml-2`}
        style={{ color: suitColor }}>
        {rank}
      </p>
      <div
        className="ml-1 mt-1"
        style={{ color: suitColor }}>
        {icon}
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
            : gameStatus === 'Lose'
            ? 'bg-accentRed'
            : gameStatus === 'Win'
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
          : gameStatus === 'Lose'
          ? 'bg-accentRed'
          : gameStatus === 'Win'
          ? 'bg-accentGreen'
          : 'bg-text'
      )}>
      {values}
    </p>
  </div>
);
