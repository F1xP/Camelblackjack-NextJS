'use client';
import { suitIcons } from '@/app/components/Suits';
import { GameState } from '@prisma/client';

export const GameDisplay: React.FC<{
  gameState: GameState | null;
  currentHand: number;
  splitted: boolean;
  gameStatus1: string;
  gameStatus2: string;
}> = ({ gameState, currentHand, splitted, gameStatus1, gameStatus2 }) => {
  return (
    <section className="bg-black/30 h-[600px] w-full flex-[2] rounded-r-lg text-text overflow-hidden relative">
      <div className="flex flex-col justify-between h-full p-2">
        <div className="w-full flex justify-around flex-row-reverse absolute top-1">
          <div className="flex items-center justify-center flex-col relative">
            <div className="flex relative item-start mt-1 min-h-[7.9rem] min-w-[5rem]">
              {gameState?.player[0]?.cards?.map((card: any, index: number) => {
                return (
                  <Card
                    isCurrent={splitted && currentHand === 0}
                    key={index}
                    index={index}
                    rank={card?.rank}
                    suit={card?.suit}
                    gameStatus={gameStatus1}
                  />
                );
              })}
            </div>
          </div>
          {splitted && (
            <div className="flex items-center justify-center flex-col relative">
              <div className="flex relative item-start mt-1 min-h-[7.9rem] min-w-[5rem]">
                {gameState?.player[1]?.cards?.map((card: any, index: number) => {
                  return (
                    <Card
                      key={index}
                      index={index}
                      rank={card?.rank}
                      suit={card?.suit}
                      isCurrent={splitted && currentHand === 1}
                      gameStatus={gameStatus2}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex justify-around flex-row-reverse absolute bottom-1">
          <div className="flex items-center justify-center flex-col relative">
            <div className="flex relative item-start mb-1 min-h-[7.9rem] min-w-[5rem]">
              {gameState?.dealer?.cards?.map((card: any, index: number) => {
                return (
                  <Card
                    key={index}
                    index={index}
                    rank={card?.rank}
                    suit={card?.suit}
                    isCurrent={currentHand === 3}
                    gameStatus=""
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Card: React.FC<{ index: number; rank: string; suit: string; isCurrent: boolean; gameStatus: string }> = ({
  index,
  rank,
  suit,
  isCurrent,
  gameStatus,
}) => {
  const { icon, color } = suitIcons(32)[suit as keyof typeof suitIcons] || {};

  return (
    <div
      className={`w-20 h-32 bg-white rounded-md shadow-sm shadow-black p-card-animation border-2
      ${isCurrent && 'border-blue-700'}
      ${
        gameStatus === 'Push'
          ? 'border-yellow-100'
          : gameStatus === 'Dealer'
          ? 'border-red-700'
          : gameStatus === 'Player'
          ? 'border-green-400'
          : null
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        marginTop: `${index}rem`,
        marginLeft: index > 0 ? '-2.5rem' : '0',
        transform: `translate(0px, 1000px)`,
      }}>
      <p
        className={`font-mono text-5xl font-bold ml-2`}
        style={{ color }}>
        {rank}
      </p>
      <div
        className="ml-1 mt-1"
        style={{ color }}>
        {icon}
      </div>
    </div>
  );
};
