'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { calculateHandValue, deductCoins, isAllowedToSplit } from '@/lib/helpers';
import { Game } from '@/types/types';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';

export const splitAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    const game: Game | null = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });

    if (!game) return { message: null, error: 'No active game found.' };

    const canSplit = await isAllowedToSplit(game.state);
    if (!canSplit)
      return {
        message: null,
        error: 'Splitting is not available at this point. Please check your current game status.',
      };

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
        payout: 0,
      },
    ];

    game.state.player[0] = playerState;

    await prisma.$transaction(async (tx) => {
      await deductCoins(tx, user.email as string, playerState.amount);

      await tx.game.update({
        where: { id: game.id },
        data: {
          state: {
            player: game.state.player,
            dealer: game.state.dealer,
          },
        },
      });
      revalidatePath('/play');
    });
    return { message: 'Split action finished.', error: null };
  } catch (e: unknown) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
