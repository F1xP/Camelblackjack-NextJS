import { Game, GameState } from '@prisma/client';
import { GameButtons } from './(components)/GameButtons';
import { GameDisplay } from './(components)/GaneDisplay';
import { getCurretGame } from './(components)/actions';

export default async function Play() {
  const gameData: any = await getCurretGame();

  const gameState: GameState | undefined = gameData?.state;
  const isGameActive: boolean = gameData?.active || false;
  const currentHand = 0;

  const dealerLastAction: string | undefined = gameState?.dealer?.actions?.pop();
  const playerLastAction: string | undefined = gameState?.player[0]?.actions?.pop();

  const isDealerBusted: boolean = dealerLastAction === 'bust';
  const isPlayerBusted: boolean = playerLastAction === 'bust';

  return (
    <>
      <p className="text-text">
        Player Value: {gameState?.player[currentHand]?.value[0]}{' '}
        {gameState?.player[currentHand]?.value[1] && `,${gameState?.player[currentHand]?.value[1]}`}{' '}
      </p>
      <p className="text-text">Dealer Value: {gameState?.dealer?.value[0]}</p>

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
