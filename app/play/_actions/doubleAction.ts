'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import {
  calculateHandValue,
  dealerTurn,
  deductCoins,
  gameEnded,
  getCard,
  getCurrentHand,
  getHandValue,
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

      const newPlayerCard = await getCard();
      playerState.cards = [...playerState.cards, newPlayerCard];
      playerState.value = await calculateHandValue(playerState.cards, 'P');
      playerState.actions = [...playerState.actions, 'DOUBLE'];
      const playerValue1 = await getHandValue(game.state.player[0]);
      const playerValue2 = await getHandValue(game.state.player[1]);

      if ((!hasSplitted && playerValue1 < 21) || (currentHand === 1 && (playerValue1 < 21 || playerValue2 < 21)))
        await dealerTurn(dealerState);

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
