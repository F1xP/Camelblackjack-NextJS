'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentServerGame, getCurrentUser } from '@/lib/session';
import { deductCoins, gameEnded, isAllowedToInsure, shouldGameEnd } from '@/lib/helpers';
import { Actions } from '@/types/types';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';

export const insuranceAcceptAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) throw new Error('You must be signed in.');

    const game = await getCurrentServerGame(user.email);

    await prisma.$transaction(async (tx) => {
      const playerState = game.state.player[0];

      const canInsure = await isAllowedToInsure(game.state);
      if (!canInsure)
        throw new Error('Insurance action is not available at this point. Please check your current game status.');

      await deductCoins(tx, user.email as string, playerState.amount / 2);

      playerState.actions = [...playerState.actions, 'INS_ACCEPTED'];

      const hasGameEnded = await shouldGameEnd(game.state, false);
      if (hasGameEnded) {
        playerState.amount = playerState.amount + playerState.amount / 2;
        await gameEnded(tx, game);
      } else
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
    return { message: 'Insurance accepted action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};

export const insuranceDeclineAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) throw new Error('You must be signed in.');
    const game = await getCurrentServerGame(user.email);

    await prisma.$transaction(async (tx) => {
      const playerState = game.state.player[0];

      if (['INS_ACCEPTED', 'INS_DECLINED'].some((action) => playerState.actions.includes(action as Actions)))
        throw new Error('Insurance action is not available at this point. Please check your current game status.');

      playerState.actions = [...playerState.actions, 'INS_DECLINED'];

      const hasGameEnded = await shouldGameEnd(game.state, false);
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
    return { message: 'Insurance declined action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
