import { GameButtons } from './_components/GameButtons';
import { GameDisplay } from './_components/GaneDisplay';
import { Game } from '@/types/types';
import { getCurrentGame } from './_actions/getGame';
import { disabledButtons, getCurrentHand, getGameStatus } from '@/lib/helpers';

export default async function Play() {
  const gameData: Game | null = await getCurrentGame();

  const gameState = gameData?.state || null;
  const gameStatus1 = await getGameStatus(!!gameData?.active, gameState, 0);
  const gameStatus2 = await getGameStatus(!!gameData?.active, gameState, 1);
  const currentHand = await getCurrentHand(gameState);
  const isDisabled = await disabledButtons(gameData);

  return (
    <>
      <div className="flex flex-row flex-wrap xl:flex-nowrap w-full rounded-xl border-2 border-secondary dark:border-dark_secondary mt-10 overflow-hidden">
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
    </>
  );
}
