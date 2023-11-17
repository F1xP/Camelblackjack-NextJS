'use client';
import { GameState } from '@prisma/client';

export const GameDisplay: React.FC<{ gameState: GameState | undefined }> = ({ gameState }) => {
  const currentHand = 0;

  return (
    <section className="bg-black/30 h-[600px] w-full flex-[2] rounded-r-lg text-text overflow-hidden relative">
      <div className="flex flex-col justify-between h-full p-2">
        <div className="w-full flex justify-around flex-row-reverse absolute top-1">
          <div className="flex items-center justify-center flex-col relative">
            <div className="flex relative item-start mt-1 min-h-[7.9rem] min-w-[5rem]">
              {gameState?.player[currentHand]?.cards?.map((card: any, index: number) => {
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
              {gameState?.dealer?.cards?.map((card: any, index: number) => {
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
  );
};
