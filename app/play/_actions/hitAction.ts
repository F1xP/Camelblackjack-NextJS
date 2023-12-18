'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import {
  calculateHandValue,
  dealerTurn,
  gameEnded,
  getCard,
  getCurrentHand,
  hasPlayerSplitted,
  isAllowedToStand,
  shouldGameEnd,
} from '@/lib/helpers';
import { Actions, Game } from '@/types/types';
import { revalidatePath } from 'next/cache';

export const hitAction = async (formData: FormData) => {
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

    const canHit = await isAllowedToStand(game.state, currentHand);
    if (!canHit)
      return {
        message: null,
        error: 'Hit action is not available at this point. Please check your current game status.',
      };

    const newPlayerCard = await getCard();
    playerState.cards = [...playerState.cards, newPlayerCard];
    playerState.value = await calculateHandValue(playerState.cards, 'P');

    const hasBusted = playerState.value[0] > 21;
    playerState.actions = hasBusted ? [...playerState.actions, 'HIT', 'BUST'] : [...playerState.actions, 'HIT'];

    if (hasSplitted && currentHand === 1 && playerState.value[0] > 21 && game.state.player[0].value[1] < 21)
      await dealerTurn(dealerState);

    await prisma.$transaction(async (tx) => {
      const hasGameEnded = await shouldGameEnd(game.state, false);
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
    return { message: 'Hit action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: 'An error occurred while processing your hit action.' };
  }
};
