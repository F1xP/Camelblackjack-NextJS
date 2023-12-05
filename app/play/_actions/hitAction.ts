'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import {
  calculateHandValue,
  dealerTurn,
  getCard,
  getCurrentHand,
  hasPlayerSplitted,
  shouldGameEnd,
} from '@/lib/helpers';
import { Game } from '@/types/types';
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

    const lastPlayerAction = playerState.actions.slice(-1)[0];
    if (['double', 'stand', 'bust'].includes(lastPlayerAction))
      return { message: null, error: 'Hitting is not available at this point. Please check your current game status.' };

    const newPlayerCard = await getCard();
    playerState.cards = [...playerState.cards, newPlayerCard];
    playerState.value = await calculateHandValue(playerState.cards);

    const hasBusted = playerState.value[0] > 21;
    playerState.actions = hasBusted ? [...playerState.actions, 'hit', 'bust'] : [...playerState.actions, 'hit'];

    // Dealer to play when split is active and only one hand busted

    if (hasSplitted && currentHand === 1 && playerState.value[1] > 21 && game.state.player[0].value[1] < 21)
      await dealerTurn(dealerState);

    await prisma.game.update({
      where: { id: game.id },
      data: {
        active: !(await shouldGameEnd(game.state, false)),
        state: {
          player: game.state.player,
          dealer: game.state.dealer,
        },
      },
    });

    revalidatePath('/play');

    return { message: 'Hit action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: 'An error occurred while processing your hit action.' };
  }
};
