'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import {
  dealerTurn,
  deductCoins,
  gameEnded,
  getCurrentHand,
  hasPlayerSplitted,
  isAllowedToDouble,
  shouldGameEnd,
} from '@/lib/helpers';
import { Game } from '@/types/types';
import { revalidatePath } from 'next/cache';

export const doubleAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    await prisma.$transaction(async (tx) => {
      const game: Game | null = await tx.game.findFirst({
        where: { active: true, user_email: user.email },
      });
      if (!game) return { message: null, error: 'No active game found.' };

      const [currentHand, hasSplitted] = await Promise.all([getCurrentHand(game.state), hasPlayerSplitted(game.state)]);
      const canDouble = await isAllowedToDouble(game.state, currentHand);
      if (!canDouble) return { message: null, error: 'Double action not allowed.' };

      const playerState = game.state.player[currentHand];
      const dealerState = game.state.dealer;

      await deductCoins(tx, user.email as string, playerState.amount);
      playerState.amount = playerState.amount * 2;

      if (!hasSplitted || currentHand === 1) await dealerTurn(dealerState);

      playerState.actions = [...playerState.actions, 'double'];

      const hasGameEnded = await shouldGameEnd(game.state, true);
      if (hasGameEnded) await gameEnded(tx, game);

      await tx.game.update({
        where: { id: game.id },
        data: {
          active: !hasGameEnded,
          state: {
            player: game.state.player,
            dealer: game.state.dealer,
          },
        },
      });
      revalidatePath('/play');
    });
    return { message: 'Double action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: 'An error occurred while processing your stand action.' };
  }
};
