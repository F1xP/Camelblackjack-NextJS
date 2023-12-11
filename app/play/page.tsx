import { GameButtons } from './_components/GameButtons';
import { GameDisplay } from './_components/GaneDisplay';
import { Game } from '@/types/types';
import { getCurrentGame } from './_actions/actions';
import { getCurrentHand, getGameStatus } from '@/lib/helpers';

export default async function Play() {
  const gameData: Game | null = await getCurrentGame();

  const gameState = gameData?.state || null;
  const isGameActive = gameData?.active || false;
  const gameStatus1 = await getGameStatus(gameState, 0);
  const gameStatus2 = await getGameStatus(gameState, 1);
  const currentHand = await getCurrentHand(gameState);

  return (
    <>
      <div className="flex flex-row w-full rounded-lg border border-secondary bg-black/30 mt-10 flex-nowrap md:flex-wrap">
        <GameButtons
          gameState={gameState}
          isGameActive={isGameActive}
          currentHand={currentHand}
        />
        <GameDisplay
          gameState={gameState}
          currentHand={currentHand}
          gameStatus1={gameStatus1}
          gameStatus2={gameStatus2}
          isSplitted={gameState?.player.length === 2}
          gameId={gameData?.id}
        />
      </div>
    </>
  );
}
