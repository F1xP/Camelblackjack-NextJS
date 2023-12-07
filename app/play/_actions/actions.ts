'use server';

import { calculateHandValue } from '@/lib/helpers';
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

    if (game && game.active && game.state.dealer.cards.length === 2 && game.state.dealer.value[0] !== 21) {
      game.state.dealer.cards = [game.state.dealer.cards[0]];
      game.state.dealer.value = await calculateHandValue(game.state.dealer.cards, 'D');
    }

    return game;
  } catch (e) {
    console.log(e);
    return null;
  }
};
