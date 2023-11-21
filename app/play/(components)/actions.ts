'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { calculateDealerHandValue, calculateHandValue, dealCard } from '@/lib/utils';
import { Game } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const betAction = async (formData: FormData) => {
  try {
    // Ensure user is signed in
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    // Get the bet amount from the form data
    const betAmount: number = Number(formData.get('betAmount'));

    // Check if the bet amount is a valid number
    if (isNaN(betAmount)) return { message: null, error: 'Bet amount must be a valid number.' };

    // Check if there is an active game for the user
    const isActive = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });
    if (isActive) return { message: null, error: 'You must finish your active game in order to start another.' };

    // Deduct the bet amount from the user's coins
    const deducted = await prisma.user.update({
      where: { email: user.email, coins: { gte: betAmount } },
      data: {
        coins: {
          decrement: betAmount,
        },
      },
    });

    // Check if the user has sufficient coins
    if (!deducted) return { message: null, error: 'Insufficient coins.' };

    // Start the game by dealing two cards for the player and 2 cards for the dealer
    const playerCard1 = await dealCard();
    const playerCard2 = await dealCard();
    const dealerCard1 = await dealCard();
    const dealerCard2 = await dealCard();
    const playerValue = await calculateHandValue([playerCard1, playerCard2]);
    const dealerValue = await calculateDealerHandValue([dealerCard1]);

    // Create a new game in the database
    await prisma.game.create({
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

    // Revalidate the path after starting the game
    revalidatePath('/play');

    return { message: 'Bet action finished.', error: null };
  } catch (error) {
    // Handle and log errors
    console.error(error);
    return { message: null, error: 'An error occurred while processing your bet action.' };
  }
};

export const hitAction = async (formData: FormData) => {
  try {
    // Ensure user is signed in
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    // Retrieve the active game for the user
    const game = await prisma.game.findFirst({
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

    // Check if the user is blocked from hitting
    const lastPlayerAction = playerState.actions.slice(-1)[0];
    if (['double', 'stand', 'bust'].includes(lastPlayerAction))
      return { message: null, error: 'User is blocked from hitting.' };

    // Deal a new card to the player
    const newPlayerCard = await dealCard();
    const updatedPlayerCards = [...playerState.cards, newPlayerCard];
    const updatedPlayerValue = await calculateHandValue(updatedPlayerCards);

    // Check if the player has busted
    const isUserBusted = updatedPlayerValue[0] > 21;
    const updatedPlayerActions = isUserBusted
      ? [...playerState.actions, 'hit', 'bust']
      : [...playerState.actions, 'hit'];

    // Update player state with the new card, value, and actions
    playerState.cards = updatedPlayerCards;
    playerState.value = updatedPlayerValue;
    playerState.actions = updatedPlayerActions;

    // Update game state with the modified player and dealer states
    game.state.player[currentHand] = playerState;
    game.state.dealer = dealerState;

    // Update the game in the database
    await prisma.game.update({
      where: { id: game.id },
      data: {
        active: isUserBusted,
        state: {
          player: game.state.player,
          dealer: game.state.dealer,
        },
      },
    });

    // Revalidate the path after hitting
    revalidatePath('/play');

    return { message: 'Hit action finished.', error: null };
  } catch (error) {
    // Handle and log errors
    console.error(error);
    return { message: null, error: 'An error occurred while processing your hit action.' };
  }
};

export const standAction = async (formData: FormData) => {
  try {
    // Ensure user is signed in
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    // Retrieve the active game for the user
    const game = await prisma.game.findFirst({
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
      const updatedDealerCards = [...dealerState.cards, newDealerCard];
      const updatedDealerActions = [...dealerState.actions, 'hit'];
      const updatedDealerValue = await calculateDealerHandValue(updatedDealerCards);

      // Update dealer state with the new card, value, and actions
      dealerState.cards = updatedDealerCards;
      dealerState.actions = updatedDealerActions;
      dealerState.value = updatedDealerValue;

      // Recursively continue the dealer's turn
      await dealerTurn();
    };

    // Initiate the dealer's turn
    await dealerTurn();

    // Determine if the dealer busted or stood
    if (dealerState.value[0] > 21) dealerState.actions = [...dealerState.actions, 'bust'];
    else dealerState.actions = [...dealerState.actions, 'stand'];

    // Update player and dealer actions
    playerState.actions = [...playerState.actions, 'stand'];

    // Update game state and set it as inactive
    game.state.player[currentHand] = playerState;
    game.state.dealer = dealerState;

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
  } catch (error) {
    // Handle and log errors
    console.error(error);
    return { message: null, error: 'An error occurred while processing your stand action.' };
  }
};

export const splitAction = async (formData: FormData) => {
  try {
    // Ensure user is signed in
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    // Retrieve the active game for the user
    const game = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });

    if (!game) return { message: null, error: 'No active game found.' };

    // Check if the user is blocked from splitting
    const playerHands = game.state.player.length;
    if (playerHands > 1) return { message: null, error: 'User is blocked from splitting.' };

    const playerState = game.state.player[0];
    const lastPlayerAction = playerState.actions.slice(-1)[0];

    // Check if the user is blocked from splitting based on the last action
    if (['double', 'stand', 'bust'].includes(lastPlayerAction))
      return { message: null, error: 'User is blocked from splitting.' };

    // Check if the user can split (only when the player has exactly 2 cards of the same rank)
    if (playerState.cards.length !== 2 || playerState.cards[0].rank !== playerState.cards[1].rank)
      return { message: null, error: 'User is blocked from splitting.' };

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
  } catch (error) {
    // Handle and log errors
    console.error(error);
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
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    // Retrieve the current game for the user
    const data: Game | null = await prisma.game.findFirst({
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

    return data;
  } catch (error) {
    // Handle and log errors
    console.error(error);
    return { message: null, error: 'An error occurred while retrieving the current game.' };
  }
};
