'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { calculateDealerHandValue, calculateHandValue, canSplit, dealCard, getErrorMessage } from '@/lib/utils';
import { Game } from '@/types/types';
import { revalidatePath } from 'next/cache';

export const betAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    const betAmount: number = Number(formData.get('betAmount'));
    if (isNaN(betAmount)) return { message: null, error: 'Bet amount must be a valid number.' };

    try {
      await prisma.$transaction(async (tx) => {
        const isActive = await tx.game.findFirst({
          where: { active: true, user_email: user.email },
        });
        if (isActive) throw new Error('You must finish your active game in order to start another.');

        const deducted = await tx.user.update({
          where: { email: user.email as string, coins: { gte: betAmount } },
          data: {
            coins: {
              decrement: betAmount,
            },
          },
        });
        if (!deducted) throw new Error('Insufficient coins.');

        const playerCard1 = await dealCard();
        const playerCard2 = await dealCard();
        const dealerCard1 = await dealCard();
        const dealerCard2 = await dealCard();
        const playerValue = await calculateHandValue([playerCard1, playerCard2]);
        const dealerValue = await calculateDealerHandValue([dealerCard1]);

        await tx.game.create({
          data: {
            active: true,
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
      });
      revalidatePath('/play');
      return { message: 'Bet action finished.', error: null };
    } catch (e: unknown) {
      console.log(e);
      return { message: null, error: getErrorMessage(e) };
    }
  } catch (error) {
    // Handle and log errors
    console.log(error);
    return { message: null, error: 'An error occurred while processing your bet action.' };
  }
};

export const hitAction = async (formData: FormData) => {
  try {
    // Ensure user is signed in
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    // Retrieve the active game for the user
    const game: Game | null = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });

    if (!game) return { message: null, error: 'No active game found.' };

    // Determine the current hand of the player
    const playerHands = game.state.player.length;
    const currentHand =
      playerHands > 1 && ['stand', 'bust', 'double'].includes(game.state.player[0].actions.slice(-1)[0]) ? 1 : 0;

    // Extract player and dealer states from the game
    const playerState = game.state.player[currentHand];

    // Check if the user is blocked from hitting
    const lastPlayerAction = playerState.actions.slice(-1)[0];
    if (['double', 'stand', 'bust'].includes(lastPlayerAction))
      return { message: null, error: 'Hitting is not available at this point. Please check your current game status.' };

    // Deal a new card to the player
    const newPlayerCard = await dealCard();
    playerState.cards = [...playerState.cards, newPlayerCard];
    playerState.value = await calculateHandValue(playerState.cards);

    // Check if the player has busted
    const isUserBusted = playerState.value[0] > 21;
    playerState.actions = isUserBusted ? [...playerState.actions, 'hit', 'bust'] : [...playerState.actions, 'hit'];

    // Update the game in the database
    await prisma.game.update({
      where: { id: game.id },
      data: {
        active: !isUserBusted,
        state: {
          player: game.state.player,
          dealer: game.state.dealer,
        },
      },
    });

    // Revalidate the path after hitting
    revalidatePath('/play');

    return { message: 'Hit action finished.', error: null };
  } catch (e) {
    // Handle and log errors
    console.log(e);
    return { message: null, error: 'An error occurred while processing your hit action.' };
  }
};

export const standAction = async (formData: FormData) => {
  try {
    // Ensure user is signed in
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    // Retrieve the active game for the user
    const game: Game | null = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });

    if (!game) return { message: null, error: 'No active game found.' };

    // Determine the current hand of the player
    const playerHands = game.state.player.length;
    const currentHand =
      playerHands > 1 && ['stand', 'bust', 'double'].includes(game.state.player[0].actions.slice(-1)[0]) ? 1 : 0;

    // Extract player and dealer states from the game
    const playerState = game.state.player[currentHand];
    const dealerState = game.state.dealer;

    // Define a recursive dealer turn function
    const dealerTurn = async () => {
      if (dealerState.value[0] >= 17) return;

      // Deal a new card to the dealer
      const newDealerCard = await dealCard();
      dealerState.cards = [...dealerState.cards, newDealerCard];
      dealerState.actions = [...dealerState.actions, 'hit'];
      dealerState.value = await calculateDealerHandValue(dealerState.cards);

      await dealerTurn();
    };

    // Initiate the dealer's turn
    await dealerTurn();

    // Determine if the dealer busted or stood
    if (dealerState.value[0] > 21) dealerState.actions = [...dealerState.actions, 'bust'];
    else dealerState.actions = [...dealerState.actions, 'stand'];

    // Update player and dealer actions
    playerState.actions = [...playerState.actions, 'stand'];

    await prisma.game.update({
      where: { id: game.id },
      data: {
        active: false,
        state: {
          player: game.state.player,
          dealer: game.state.dealer,
        },
      },
    });

    // Revalidate the path after standing
    revalidatePath('/play');

    return { message: 'Stand action finished.', error: null };
  } catch (e) {
    // Handle and log errors
    console.log(e);
    return { message: null, error: 'An error occurred while processing your stand action.' };
  }
};

export const splitAction = async (formData: FormData) => {
  try {
    // Ensure user is signed in
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    // Retrieve the active game for the user
    const game: Game | null = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });

    if (!game) return { message: null, error: 'No active game found.' };

    const isAllowedToSplit = await canSplit(game);
    if (!isAllowedToSplit)
      return {
        message: null,
        error: 'Splitting is not available at this point. Please check your current game status.',
      };

    const playerState = game.state.player[0];

    // Perform the split action
    playerState.cards.pop();
    playerState.actions = [...playerState.actions, 'split'];

    // Calculate the updated player value after splitting
    const updatedPlayerValue = await calculateHandValue(playerState.cards);

    // Update game state with the new player hand after splitting
    game.state.player = [
      ...game.state.player,
      { value: updatedPlayerValue, actions: playerState.actions, cards: playerState.cards },
    ];

    game.state.player[0] = playerState;

    // Update the game in the database
    await prisma.game.update({
      where: { id: game.id },
      data: {
        state: {
          player: game.state.player,
          dealer: game.state.dealer,
        },
      },
    });

    // Revalidate the path after splitting
    revalidatePath('/play');

    return { message: 'Split action finished.', error: null };
  } catch (e) {
    // Handle and log errors
    console.log(e);
    return { message: null, error: 'An error occurred while processing your split action.' };
  }
};

export const doubleAction = async (formData: FormData) => {
  return { message: 'Double action finished.', error: null };
};

export const getCurrentGame = async () => {
  try {
    // Ensure user is signed in
    const user = await getCurrentUser();
    if (!user || !user.email) return null;

    // Retrieve the current game for the user
    const game: Game | null = await prisma.game.findFirst({
      where: {
        OR: [{ user_email: user.email, active: true }, { user_email: user.email }],
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Uncomment the following block if you want to modify dealer cards
    /*
    if (data && data.state.dealer.cards.length === 2) {
      console.log(data.state.dealer.cards);
      data.state.dealer.cards = [data.state.dealer.cards[0]];
      data.state.dealer.value = await calculateHandValue(data.state.dealer.cards);
    }
    */

    return game;
  } catch (e) {
    // Handle and log errors
    console.log(e);
    return null;
  }
};

export const checkGameStatus = async (gameData: Game) => {
  const gameState = gameData.state;

  const playerCards = gameState.player[0].cards;
  const dealerCards = gameState.dealer.cards;

  const playerValue = Number(gameState.player[0].value[0]);
  const dealerValue = Number(gameState.dealer.value[0]);

  const playerLastAction = gameState.player[0].actions.pop();
  const dealerLastAction = gameState.dealer.actions.pop();

  const isPlayerBusted = playerLastAction === 'bust';
  const isDealerBusted = dealerLastAction === 'bust';

  if (playerValue === 21 && playerCards.length === 2) return 'player';
  if (dealerValue === 21 && dealerCards.length === 2) return 'dealer';

  if (isPlayerBusted) return 'dealer';
  if (!isPlayerBusted && isDealerBusted) return 'player';

  if (dealerValue > 16 && playerValue <= 21) {
    if (playerValue === dealerValue) return 'push';
    if (playerValue > dealerValue) return 'player';
    if (playerValue < dealerValue) return 'dealer';
  }
  return 'Undecided';
};
