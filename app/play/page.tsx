import { GameButtons } from './_components/GameButtons';
import { GameDisplay } from './_components/GaneDisplay';
import { Game } from '@/types/types';
import { getCurrentGame } from './_actions/getGame';
import { disabledButtons, getCurrentHand, getGameStatus } from '@/lib/helpers';
import { GameFooter } from './_components/GameFooter';

export default async function Play() {
  const gameData: Pick<Game, 'active' | 'id' | 'state' | 'hashedSeed'> | null = await getCurrentGame();

  const gameState = gameData?.state;
  const [status1, status2, currentHand] = await Promise.all([
    getGameStatus(!!gameData?.active, gameState, 0),
    getGameStatus(!!gameData?.active, gameState, 1),
    getCurrentHand(gameState),
  ]);
  const isDisabled = await disabledButtons(gameData, currentHand);
  const isSplitted = gameState?.player.length === 2;
  const gameId = gameData?.id;

  return (
    <>
      <div className="flex flex-col w-full rounded-sm border-2 border-secondary dark:border-dark_secondary mt-10">
        <div className="flex flex-row flex-wrap 2xl:flex-nowrap w-full">
          <GameButtons isDisabled={isDisabled} />
          <GameDisplay
            gameState={gameState}
            currentHand={currentHand}
            status1={status1}
            status2={status2}
            isSplitted={isSplitted}
            gameId={gameId}
          />
        </div>
        <GameFooter
          serverSeed={gameData?.hashedSeed}
          gameId={gameId}
        />
      </div>
    </>
  );
}
