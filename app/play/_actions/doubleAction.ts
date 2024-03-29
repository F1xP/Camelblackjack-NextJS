'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentServerGame, getCurrentUser } from '@/lib/session';
import {
  calculateHandValue,
  dealerTurn,
  deductCoins,
  gameEnded,
  getCard,
  getCurrentHand,
  hasPlayerSplitted,
  isAllowedToDouble,
  shouldGameEnd,
} from '@/lib/helpers';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';

export const doubleAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) throw new Error('You must be signed in.');
    const game = await getCurrentServerGame(user.email);

    await prisma.$transaction(async (tx) => {
      const serverSeed = game.seed;
      const clientSeed = user.seed;
      const cursor = game.cursor;
      const nonce = user.nonce;

      const currentHand = await getCurrentHand(game.state);
      const canDouble = await isAllowedToDouble(game.state, currentHand);
      if (!canDouble)
        throw new Error('Double action is not available at this point. Please check your current game status.');

      const hasSplitted = await hasPlayerSplitted(game.state);
      const playerState = game.state.player[currentHand];

      await deductCoins(tx, user.email as string, playerState.amount);
      playerState.amount = playerState.amount * 2;

      const newPlayerCard = await getCard(serverSeed, clientSeed, nonce, cursor);
      playerState.cards = [...playerState.cards, newPlayerCard];
      playerState.value = await calculateHandValue(playerState.cards, 'P');

      const hasBusted = playerState.value[0] > 21;
      playerState.actions = hasBusted ? [...playerState.actions, 'DOUBLE', 'BUST'] : [...playerState.actions, 'DOUBLE'];

      if ((hasSplitted && currentHand === 1) || (!hasSplitted && !hasBusted))
        await dealerTurn(game, clientSeed, user.nonce);

      const hasGameEnded = await shouldGameEnd(game.state, true);
      if (hasGameEnded) await gameEnded(tx, game);
      else
        await tx.game.update({
          where: { id: game.id },
          data: {
            cursor: game.cursor + 1,
            state: {
              player: game.state.player,
              dealer: game.state.dealer,
            },
          },
        });
    });
    revalidatePath('/play');
    return { message: 'Double action finished.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
