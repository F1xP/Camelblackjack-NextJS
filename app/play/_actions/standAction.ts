'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentServerGame, getCurrentUser } from '@/lib/session';
import {
  dealerTurn,
  gameEnded,
  getCurrentHand,
  hasPlayerSplitted,
  isAllowedToStand,
  shouldGameEnd,
} from '@/lib/helpers';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';

export const standAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) throw new Error('You must be signed in.');

    const game = await getCurrentServerGame(user.email);

    const clientSeed = user.seed;

    const currentHand = await getCurrentHand(game.state);

    const canStand = await isAllowedToStand(game.state, currentHand);
    if (!canStand)
      throw new Error('Stand action is not available at this point. Please check your current game status.');

    const hasSplitted = await hasPlayerSplitted(game.state);

    const playerState = game.state.player[currentHand];
    playerState.actions = [...playerState.actions, 'STAND'];

    if (!hasSplitted || currentHand === 1) await dealerTurn(game, clientSeed, user.nonce);

    await prisma.$transaction(async (tx) => {
      const hasGameEnded = await shouldGameEnd(game.state, true);
      if (hasGameEnded) await gameEnded(tx, game);
      else
        await tx.game.update({
          where: { id: game.id },
          data: {
            state: {
              player: game.state.player,
              dealer: game.state.dealer,
            },
          },
        });
    });
    revalidatePath('/play');
    return { message: 'Stand action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
