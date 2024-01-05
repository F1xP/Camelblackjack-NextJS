'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import {
  calculateHandValue,
  dealerTurn,
  gameEnded,
  getCard,
  getCurrentHand,
  hasPlayerSplitted,
  isAllowedToStand,
  shouldGameEnd,
} from '@/lib/helpers';
import { Game } from '@/types/types';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';

export const hitAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) throw new Error('You must be signed in.');

    const game: Game | null = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });
    if (!game) throw new Error('No active game found.');

    const serverSeed = game.seed;
    const clientSeed = user.seed;
    const cursor = game.cursor;
    const nonce = user.nonce;

    const [currentHand, hasSplitted] = await Promise.all([getCurrentHand(game.state), hasPlayerSplitted(game.state)]);

    const playerState = game.state.player[currentHand];
    const canHit = await isAllowedToStand(game.state, currentHand);

    if (!canHit) throw new Error('Hit action is not available at this point. Please check your current game status.');
    const newPlayerCard = await getCard(serverSeed, clientSeed, nonce, cursor);
    playerState.cards = [...playerState.cards, newPlayerCard];
    playerState.value = await calculateHandValue(playerState.cards, 'P');

    const hasBusted = playerState.value[0] > 21;
    playerState.actions = hasBusted ? [...playerState.actions, 'HIT', 'BUST'] : [...playerState.actions, 'HIT'];

    if (hasSplitted && currentHand === 1 && playerState.value[0] > 21 && game.state.player[0].value[1] < 21)
      await dealerTurn(game, clientSeed, user.nonce);

    await prisma.$transaction(async (tx) => {
      const hasGameEnded = await shouldGameEnd(game.state, false);
      if (hasGameEnded) await gameEnded(tx, game);
      else
        await tx.game.update({
          where: { id: game.id },
          data: {
            state: {
              player: game.state.player,
              dealer: game.state.dealer,
            },
          },
        });
    });
    revalidatePath('/play');
    return { message: 'Hit action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
