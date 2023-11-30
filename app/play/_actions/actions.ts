'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { Game } from '@/types/types';

export const getCurrentGame = async () => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return null;

    const game: Game | null = await prisma.game.findFirst({
      where: {
        OR: [{ user_email: user.email, active: true }, { user_email: user.email }],
      },
      orderBy: { updatedAt: 'desc' },
    });
    /*
      if (data && data.state.dealer.cards.length === 2) {
        console.log(data.state.dealer.cards);
        data.state.dealer.cards = [data.state.dealer.cards[0]];
        data.state.dealer.value = await calculateHandValue(data.state.dealer.cards);
      }
      */

    return game;
  } catch (e) {
    console.log(e);
    return null;
  }
};
