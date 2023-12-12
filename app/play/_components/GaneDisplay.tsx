'use client';
import { suitIcons } from '@/app/_components/Suits';
import { cn } from '@/lib/utils';
import { Card } from '@/types/types';
import { GameState } from '@prisma/client';

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
    <section className="bg-black/30 w-full flex-[2] rounded-r-lg text-text overflow-hidden relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 bg-background px-3 py-1 rounded-md pointer-events-none">
        <p className="font-bold font-mono text-2xl ">BLACKJACK PAYS 3 TO 2</p>
        <p className="font-bold font-mono text-2xl ">INSURANCE PAYS 2 TO 1</p>
      </div>

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
            handValues={<>{gameState?.dealer.value}</>}
            gameStatus={null}
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
  cards: Card[] | undefined;
  handValues: React.ReactNode;
  gameStatus: string | null;
  isCurrent: boolean;
  isSplitted: boolean;
  gameId: string | undefined;
};

const Hand: React.FC<HandProps> = ({ cards, handValues, gameStatus, isCurrent, isSplitted, gameId }) => {
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
            key={`${card?.rank}${card?.suit}${index}${gameId}`}
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
        'flip-card w-[3.5rem] h-[5.5rem] md:w-16 md:h-24 xl:w-20 xl:h-32 bg-transparent rounded-md shadow-sm shadow-black p-card-animation border-3',
        isCurrent && !gameStatus && isSplitted
          ? 'border-accentBlue'
          : gameStatus === 'PUSH'
          ? 'border-accent'
          : gameStatus === 'Lose' || gameStatus === 'Blackjack Dealer'
          ? 'border-accentRed'
          : gameStatus === 'Win' || gameStatus === 'Blackjack Player'
          ? 'border-accentGreen'
          : 'border-transparent'
      )}
      style={{
        animationDelay: `${index * 250}ms`,
        marginTop: `${index}rem`,
        marginLeft: index > 0 ? '-2.4rem' : '0',
        transform: `translate(0px, 1000px)`,
      }}>
      <div
        className="flip-card-inner card-flip-animation"
        style={{
          animationDelay: `${index * 250}ms`,
        }}>
        <div className="flip-card-back bg-white">
          <p
            className={`font-mono text-3xl md:text-5xl font-bold ml-2`}
            style={{ color: suitColor }}>
            {rank}
          </p>
          <div
            className="ml-1 mt-1"
            style={{ color: suitColor }}>
            {icon}
          </div>
        </div>
        <div className="flip-card-front bg-red-200"></div>
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
            : gameStatus === 'PUSH'
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
          : gameStatus === 'PUSH'
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
