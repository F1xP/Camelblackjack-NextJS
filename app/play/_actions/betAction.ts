'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { calculateDealerHandValue, calculateHandValue, getCard, getErrorMessage } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

// Smth is wrong with the bet action it's setting game active to false on inital cards
export const betAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    const betAmount: number = Number(formData.get('betAmount'));
    if (isNaN(betAmount)) return { message: null, error: 'Bet amount must be a valid number.' };
    if (betAmount < 10) return { message: null, error: 'Minimum bet amount is 10.' };

    await prisma.$transaction(async (tx) => {
      const isActive = await tx.game.findFirst({
        where: { active: true, user_email: user.email },
      });
      if (isActive) throw new Error('You must finish your active game in order to start another.');

      const deducted = await tx.user.update({
        where: { email: user.email as string },
        data: {
          coins: {
            decrement: betAmount,
          },
        },
      });
      if (deducted.coins < 0) throw new Error('Insufficient coins.');

      const playerCard1 = await getCard();
      const playerCard2 = await getCard();
      const dealerCard1 = await getCard();
      const dealerCard2 = await getCard();
      const playerValue = await calculateHandValue([playerCard1, playerCard2]);
      const dealerValue = await calculateDealerHandValue([dealerCard1, dealerCard2]);
      const blackjack = playerValue[0] === 21;

      await tx.game.create({
        data: {
          active: blackjack ? false : true,
          payoutMultiplier: 1,
          amountMultiplier: 1,
          amount: betAmount,
          payout: 0,
          state: {
            player: [{ value: playerValue, actions: ['deal'], cards: [playerCard1, playerCard2] }],
            dealer: { value: dealerValue, actions: ['deal'], cards: [dealerCard1, dealerCard2] },
          },
          user_email: user.email,
        },
      });
      if (blackjack)
        await tx.user.update({
          where: { email: user.email as string },
          data: {
            coins: {
              increment: betAmount * 2.5,
            },
          },
        });
      revalidatePath('/play');
    });
    return { message: 'Bet action finished.', error: null };
  } catch (e: unknown) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
