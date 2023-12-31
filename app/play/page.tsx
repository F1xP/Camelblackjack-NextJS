import { GameButtons } from './_components/GameButtons';
import { GameDisplay } from './_components/GaneDisplay';
import { Game } from '@/types/types';
import { getCurrentGame } from './_actions/getGame';
import { disabledButtons, getCurrentHand, getGameStatus } from '@/lib/helpers';
import { GameFooter } from './_components/GameFooter';

export default async function Play() {
  const gameData: Game | null = await getCurrentGame();

  const gameState = gameData?.state || null;
  const [gameStatus1, gameStatus2, currentHand, isDisabled] = await Promise.all([
    getGameStatus(!!gameData?.active, gameState, 0),
    getGameStatus(!!gameData?.active, gameState, 1),
    getCurrentHand(gameState),
    disabledButtons(gameData),
  ]);

  return (
    <>
      <div className="flex flex-col w-full rounded-sm border-2 border-secondary dark:border-dark_secondary mt-10 overflow-hidden">
        <div className="flex flex-row flex-wrap xl:flex-nowrap w-full">
          <GameButtons isDisabled={isDisabled} />
          <GameDisplay
            gameState={gameState}
            currentHand={currentHand}
            status1={gameStatus1}
            status2={gameStatus2}
            isSplitted={gameState?.player.length === 2}
            gameId={gameData?.id}
          />
        </div>
        <GameFooter serverSeed={gameData?.seed} />
      </div>
    </>
  );
}
