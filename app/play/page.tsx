import { GameButtons } from './(components)/GameButtons';
import { GameDisplay } from './(components)/GaneDisplay';
import { checkGameStatus, getCurrentGame } from './(components)/actions';
import { Game, GameState } from '@/types/types';
import { notFound } from 'next/navigation';

export default async function Play() {
  const gameData: Game | null = await getCurrentGame();
  if (!gameData) return notFound();
  const gameStatus = await checkGameStatus(gameData);

  const gameState: GameState | undefined = gameData.state;
  const isGameActive = gameData.active;
  const currentHand = 0;

  const dealerLastAction = gameState.dealer.actions.slice(-1)[0];
  const playerLastAction = gameState.player[currentHand].actions.slice(-1)[0];

  const isDealerBusted = dealerLastAction === 'bust';
  const isPlayerBusted = playerLastAction === 'bust';

  return (
    <>
      <p className="text-text text-5xl">Winner: {gameStatus}</p>
      <p className="text-text">
        Player Value: {gameState.player[currentHand].value[0]}{' '}
        {gameState.player[currentHand].value[1] && `,${gameState.player[currentHand].value[1]}`}{' '}
      </p>
      <p className="text-text">Dealer Value: {gameState.dealer.value[0]}</p>

      <p className="text-text">
        Player Status: {isPlayerBusted ? 'Busted' : 'Not yet busted'}
        <span className="text-accent"> Last Action: {playerLastAction}</span>
      </p>
      <p className="text-text">
        Dealer Status: {isDealerBusted ? 'Busted' : 'Not yet busted'}
        <span className="text-accent"> Last Action: {dealerLastAction}</span>
      </p>

      <div className="flex flex-row w-full rounded-lg border border-secondary bg-black/30 mt-10 flex-nowrap md:flex-wrap">
        <GameButtons
          gameState={gameState}
          isGameActive={isGameActive}
        />
        <GameDisplay gameState={gameState} />
      </div>
    </>
  );
}
