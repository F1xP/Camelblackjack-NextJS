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

  return (
    <>
      <p className="text-text">
        Player Value: {gameState?.player[currentHand]?.value[0]}{' '}
        {gameState?.player[currentHand]?.value[1] && `,${gameState?.player[currentHand]?.value[1]}`}{' '}
      </p>
      <p className="text-text">Dealer Value: {gameState?.dealer?.value[0]}</p>

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
