import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { Game, GameState } from '@prisma/client';
import { GameButtons } from './(components)/GameButtons';
import { GameDisplay } from './(components)/GaneDisplay';

export default async function Play() {
  const user = await getCurrentUser();

  const gameData: Game | null = await prisma.game.findFirst({ where: { user_email: user?.email, active: true } });
  const gameState: GameState | undefined = gameData?.state;
  const isGameActive: boolean = gameData?.active || false;
  const currentHand = 0;

  const isDealerBusted: boolean = gameState?.dealer?.actions?.pop() === 'bust';
  const isPlayerBusted: boolean = gameState?.player[0]?.actions?.pop() === 'bust';

  return (
    <>
      <p className="text-text">
        Player Value: {gameState?.player[currentHand]?.value[0]}{' '}
        {gameState?.player[currentHand]?.value[1] && `,${gameState?.player[currentHand]?.value[1]}`}{' '}
      </p>
      <p className="text-text">Dealer Value: {gameState?.dealer?.value[0]}</p>

      <p className="text-text">
        Player Status: {isPlayerBusted ? 'Busted' : 'Not yet busted'}
        <span className="text-accent"> Last Action: {gameState?.player[0]?.actions?.pop()}</span>
      </p>
      <p className="text-text">
        Dealer Status: {isDealerBusted ? 'Busted' : 'Not yet busted'}
        <span className="text-accent"> Last Action: {gameState?.dealer?.actions?.pop()}</span>
      </p>

      <div className="flex flex-row w-full rounded-lg border border-secondary bg-black/30 mt-10 flex-nowrap md:flex-wrap">
        <GameButtons
          gameState={gameState}
          isGameActive={isGameActive}
        />
        {isGameActive && <GameDisplay gameState={gameState} />}
      </div>
    </>
  );
}
