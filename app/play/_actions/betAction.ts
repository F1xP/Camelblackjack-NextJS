'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { calculateHandValue, deductCoins, gameEnded, getCard, shouldGameEnd } from '@/lib/helpers';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';
import { createHmac, randomUUID } from 'crypto';

export const betAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) throw new Error('You must be signed in.');

    const betAmount: number = Number(formData.get('betAmount'));
    if (isNaN(betAmount)) throw new Error('Bet amount must be a valid number.');
    if (betAmount < 10) throw new Error('Minimum bet amount is 10.');

    const isActive = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
      select: {
        active: true,
      },
    });
    if (isActive) throw new Error('You must finish your active game in order to start another.');

    const serverSeed = randomUUID();
    const hashedServerSeed = createHmac('sha256', serverSeed).digest('hex');

    const clientSeed = user.seed;
    const nonce = user.nonce;

    await prisma.$transaction(async (tx) => {
      const [coinsDeducted, playerCard1, playerCard2, dealerCard1, dealerCard2] = await Promise.all([
        deductCoins(tx, user.email as string, betAmount, true),
        getCard(serverSeed, clientSeed, nonce, 0),
        getCard(serverSeed, clientSeed, nonce, 1),
        getCard(serverSeed, clientSeed, nonce, 2),
        getCard(serverSeed, clientSeed, nonce, 3),
      ]);

      const [playerValue, dealerValue] = await Promise.all([
        calculateHandValue([playerCard1, playerCard2], 'P'),
        calculateHandValue([dealerCard1, dealerCard2], 'D'),
      ]);

      const game = await tx.game.create({
        data: {
          active: true,
          state: {
            player: [{ value: playerValue, actions: ['DEAL'], cards: [playerCard1, playerCard2], amount: betAmount }],
            dealer: { value: dealerValue, actions: ['DEAL'], cards: [dealerCard1, dealerCard2] },
          },
          seed: serverSeed,
          hashedSeed: hashedServerSeed,
          user_email: user.email,
        },
      });

      const hasGameEnded = await shouldGameEnd(game.state, false);
      if (hasGameEnded) await gameEnded(tx, game);
      else
        await tx.game.update({
          where: { id: game.id },
          data: {
            cursor: 4,
            state: {
              player: game.state.player,
              dealer: game.state.dealer,
            },
          },
        });
    });
    revalidatePath('/play');
    return { message: 'Bet action finished.', error: null };
  } catch (e: unknown) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
