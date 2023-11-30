'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { calculateDealerHandValue, getCard, getCurrentHand, hasPlayerSplitted } from '@/lib/utils';
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

    const dealerTurn = async () => {
      if (dealerState.value[0] >= 17) return;

      const newDealerCard = await getCard();
      dealerState.cards = [...dealerState.cards, newDealerCard];
      dealerState.actions = [...dealerState.actions, 'hit'];
      dealerState.value = await calculateDealerHandValue(dealerState.cards);

      await dealerTurn();
    };

    if (!hasSplitted || currentHand === 1) {
      await dealerTurn();
      if (dealerState.value[0] > 21) dealerState.actions = [...dealerState.actions, 'bust'];
      else dealerState.actions = [...dealerState.actions, 'stand'];
    }
    playerState.actions = [...playerState.actions, 'stand'];

    await prisma.game.update({
      where: { id: game.id },
      data: {
        active: !hasSplitted ? false : currentHand === 1 ? false : true,
        state: {
          player: game.state.player,
          dealer: game.state.dealer,
        },
      },
    });

    revalidatePath('/play');

    return { message: 'Stand action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: 'An error occurred while processing your stand action.' };
  }
};
