'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { calculateDealerHandValue, calculateHandValue, getCard, getCurrentHand, hasPlayerSplitted } from '@/lib/utils';
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

    const busted = playerState.value[0] > 21;
    playerState.actions = busted ? [...playerState.actions, 'hit', 'bust'] : [...playerState.actions, 'hit'];

    // Dealer to play when split is active and only one hand busted

    const dealerTurn = async () => {
      if (dealerState.value[0] >= 17) return;

      const newDealerCard = await getCard();
      dealerState.cards = [...dealerState.cards, newDealerCard];
      dealerState.actions = [...dealerState.actions, 'hit'];
      dealerState.value = await calculateDealerHandValue(dealerState.cards);

      await dealerTurn();
    };

    if (hasSplitted && currentHand === 1 && playerState.value[1] > 21 && game.state.player[0].value[1] < 21) {
      await dealerTurn();
      if (dealerState.value[0] > 21) dealerState.actions = [...dealerState.actions, 'bust'];
      else dealerState.actions = [...dealerState.actions, 'stand'];
    }

    await prisma.game.update({
      where: { id: game.id },
      data: {
        active: (!hasSplitted && busted) || (hasSplitted && currentHand === 1 && busted) ? false : true,
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
