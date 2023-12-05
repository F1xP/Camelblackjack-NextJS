'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { calculateDealerHandValue, calculateHandValue, deductCoins, getCard } from '@/lib/helpers';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';

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

      await deductCoins(tx, user.email as string, betAmount);

      const [playerCard1, playerCard2, dealerCard1, dealerCard2] = await Promise.all([
        getCard(),
        getCard(),
        getCard(),
        getCard(),
      ]);

      const [playerValue, dealerValue] = await Promise.all([
        calculateHandValue([playerCard1, playerCard2]),
        calculateDealerHandValue([dealerCard1, dealerCard2]),
      ]);
      const hasBlackjack = playerValue[0] === 21;

      await tx.game.create({
        data: {
          active: hasBlackjack ? false : true,
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
      if (hasBlackjack)
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
