'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { dealerTurn, gameEnded, getCurrentHand, hasPlayerSplitted, shouldGameEnd } from '@/lib/helpers';
import { Game } from '@/types/types';
import { revalidatePath } from 'next/cache';

export const standAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    const game: Game | null = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });

    if (!game) return { message: null, error: 'No active game found.' };

    const currentHand = await getCurrentHand(game.state);
    const hasSplitted = await hasPlayerSplitted(game.state);

    const playerState = game.state.player[currentHand];
    const dealerState = game.state.dealer;

    if (!hasSplitted || currentHand === 1) await dealerTurn(dealerState);

    playerState.actions = [...playerState.actions, 'stand'];

    await prisma.$transaction(async (tx) => {
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
    return { message: 'Stand action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: 'An error occurred while processing your stand action.' };
  }
};
