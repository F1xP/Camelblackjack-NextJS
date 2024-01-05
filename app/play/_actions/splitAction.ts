'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentServerGame, getCurrentUser } from '@/lib/session';
import { calculateHandValue, deductCoins, isAllowedToSplit } from '@/lib/helpers';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';

export const splitAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) throw new Error('You must be signed in.');

    const game = await getCurrentServerGame(user.email);

    const canSplit = await isAllowedToSplit(game.state);
    if (!canSplit)
      throw new Error('Split action is not available at this point. Please check your current game status.');

    const playerState = game.state.player[0];

    playerState.cards.pop();
    playerState.actions = [...playerState.actions, 'SPLIT'];

    const updatedPlayerValue = await calculateHandValue(playerState.cards, 'P');
    playerState.value = updatedPlayerValue;

    game.state.player = [
      ...game.state.player,
      {
        value: updatedPlayerValue,
        actions: playerState.actions,
        cards: playerState.cards,
        amount: playerState.amount,
      },
    ];

    game.state.player[0] = playerState;

    await prisma.$transaction(async (tx) => {
      await Promise.all([
        deductCoins(tx, user.email as string, playerState.amount),
        tx.game.update({
          where: { id: game.id },
          data: {
            state: {
              player: game.state.player,
              dealer: game.state.dealer,
            },
          },
        }),
      ]);
    });
    revalidatePath('/play');

    return { message: 'Split action finished.', error: null };
  } catch (e: unknown) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
