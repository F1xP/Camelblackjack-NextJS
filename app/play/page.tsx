import { GameButtons } from './_components/GameButtons';
import { GameDisplay } from './_components/GaneDisplay';
import { Game } from '@/types/types';
import { GameState } from '@prisma/client';
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
      <GameActions
        gameState={gameState}
        gameStatus1={gameStatus1}
        gameStatus2={gameStatus2}
        currentHand={currentHand}
      />
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

// GameStatus isn't working properly
const GameActions: React.FC<{
  gameState: GameState | null;
  gameStatus1: string | null;
  gameStatus2: string | null;
  currentHand: number;
}> = ({ gameState, gameStatus1, gameStatus2, currentHand }) => {
  const dealerLastAction = gameState?.dealer.actions[gameState?.dealer.actions.length - 1];
  const playerLastAction = gameState?.player[currentHand].actions[gameState?.player[currentHand].actions.length - 1];

  return (
    <div>
      <p className="text-red-500">{JSON.stringify(gameState?.player[0].actions)}</p>
      <p className="text-text text-5xl">Winner hand 1: {gameStatus1}</p>
      <p className="text-text text-5xl">Winner hand 2: {gameStatus2}</p>
      <p className="text-text">
        Player Value: {gameState?.player[currentHand].value[0]}{' '}
        {gameState?.player[currentHand].value[1] && `,${gameState?.player[currentHand].value[1]}`}{' '}
      </p>
      <p className="text-text">Dealer Value: {gameState?.dealer.value[0]}</p>

      <p className="text-text">Last Action Player: {playerLastAction}</p>
      <p className="text-text">Last Action Dealer: {dealerLastAction}</p>
    </div>
  );
};
