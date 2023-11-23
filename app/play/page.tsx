import { checkGameStatus, getCurrentHand } from '@/lib/utils';
import { GameButtons } from './(components)/GameButtons';
import { GameDisplay } from './(components)/GaneDisplay';
import { getCurrentGame } from './(components)/actions';
import { Game } from '@/types/types';
import { GameState } from '@prisma/client';

export default async function Play() {
  const gameData: Game | null = await getCurrentGame();

  const gameState = gameData?.state || null;
  const isGameActive = gameData?.active || false;
  const gameStatus = await checkGameStatus(gameState);
  const currentHand = await getCurrentHand(gameState);

  return (
    <>
      <GameActions
        gameState={gameState}
        gameStatus={gameStatus}
        currentHand={currentHand}
      />
      <div className="flex flex-row w-full rounded-lg border border-secondary bg-black/30 mt-10 flex-nowrap md:flex-wrap">
        <GameButtons
          gameState={gameState}
          isGameActive={isGameActive}
        />
        <GameDisplay
          gameState={gameState}
          currentHand={currentHand}
        />
      </div>
    </>
  );
}

const GameActions: React.FC<{ gameState: GameState | null; gameStatus: string; currentHand: number }> = ({
  gameState,
  gameStatus,
  currentHand,
}) => {
  console.log(gameState?.dealer.actions, 'Dealer Actions Client');
  console.log(gameState?.player[currentHand].actions, 'Player Actions Client');
  const dealerLastAction = gameState?.dealer.actions[gameState?.dealer.actions.length - 1];
  const playerLastAction = gameState?.player[currentHand].actions[gameState?.player[currentHand].actions.length - 1];

  return (
    <div>
      <p className="text-red-500">{JSON.stringify(gameState?.player[0].actions)}</p>
      <p className="text-text text-5xl">Winner: {gameStatus}</p>
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
