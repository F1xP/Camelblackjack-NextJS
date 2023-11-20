'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { calculateHandValue, dealCard } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

export const betAction = async (formData: FormData) => {
  const user = await getCurrentUser();
  if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

  const fBetAmount: number = Number(formData.get('betAmount'));

  if (isNaN(fBetAmount)) return { message: null, error: 'Bet amount must be a valid number.' };

  const isActive = await prisma.game.findFirst({
    where: { active: true, user_email: user.email },
  });
  if (isActive) return { message: null, error: 'You must finish your active game in order to start another.' };

  const deducted = await prisma.user.update({
    where: { email: user.email, coins: { gte: fBetAmount } },
    data: {
      coins: {
        decrement: fBetAmount,
      },
    },
  });
  if (!deducted) return { message: null, error: 'Insufficient coins.' };

  // Start the game by dealing two cards for the player and 2 cards for the dealer
  const player_card1 = await dealCard();
  const player_card2 = await dealCard();
  const dealer_card1 = await dealCard();
  const dealer_card2 = await dealCard();
  const playerValue = await calculateHandValue([player_card1, player_card2]);
  const dealerValue = await calculateHandValue([dealer_card1]);
  await prisma.game.create({
    data: {
      active: true,
      payoutMultiplier: 1,
      amountMultiplier: 1,
      amount: fBetAmount,
      payout: 0,
      state: {
        player: [{ value: playerValue, actions: ['deal'], cards: [player_card1, player_card2] }],
        dealer: { value: dealerValue, actions: ['deal'], cards: [dealer_card1, dealer_card2] },
      },
      user_email: user.email,
    },
  });
  revalidatePath('/play');
  return { message: 'Bet action finished.', error: null };
};

export const hitAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    const game = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });

    if (!game) return { message: null, error: 'No active game found.' };

    const newPlayerCard = await dealCard();
    const updatePlayerCards = [...game.state.player[0].cards, newPlayerCard];
    const updatePlayerActions = [...game.state.player[0].actions, 'hit'];
    const updatedPlayerValue = await calculateHandValue(game.state.player[0].cards);

    game.state.player[0].cards = updatePlayerCards;
    game.state.player[0].actions = updatePlayerActions;
    game.state.player[0].value = updatedPlayerValue;

    await prisma.game.update({
      where: { id: game.id },
      data: {
        state: {
          player: game.state.player,
          dealer: game.state.dealer,
        },
      },
    });

    revalidatePath('/play');
    return { message: 'Hit action finished.', error: null };
  } catch (error) {
    console.error(error);
    return { message: null, error: 'An error occurred while processing your hit action.' };
  }
};

export const standAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    const game = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });

    if (!game) return { message: null, error: 'No active game found.' };

    while (game.state.dealer.value[0] < 17) {
      const newDealerCard = await dealCard();
      const updateDealerCards = [...game.state.dealer.cards, newDealerCard];
      const updateDealerActions = [...game.state.dealer.actions, 'hit'];
      const updateDealerValue = await calculateHandValue(game.state.dealer.cards);

      game.state.dealer.cards = updateDealerCards;
      game.state.dealer.actions = updateDealerActions;
      game.state.dealer.value = updateDealerValue;
    }

    if (game.state.dealer.value[0] > 21) game.state.dealer.actions = [...game.state.dealer.actions, 'bust'];
    else game.state.dealer.actions = [...game.state.dealer.actions, 'stand'];

    await prisma.game.update({
      where: { id: game.id },
      data: {
        state: {
          player: game.state.player,
          dealer: game.state.dealer,
        },
      },
    });

    revalidatePath('/play');
    return { message: 'Stand action finished.', error: null };
  } catch (error) {
    console.error(error);
    return { message: null, error: 'An error occurred while processing your hit action.' };
  }
};
export const splitAction = async (formData: FormData) => {
  return { message: 'Split action finished.', error: null };
};
export const doubleAction = async (formData: FormData) => {
  return { message: 'Double action finished.', error: null };
};

export const getCurretGame = async () => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    const data = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });
    if (data && data.state.dealer.cards.length === 2) data.state.dealer.cards = [data.state.dealer.cards[0]];
    return { data: data, error: null };
  } catch (e) {
    return { data: null, error: 'An error occurred while trying to save your profile settings. Please try again.' };
  }
};
