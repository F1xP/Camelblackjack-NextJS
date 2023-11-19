'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

const calculateHandValue = async (hand: any) => {
  const possibleValues = [0];
  let aceCount = 0;

  for (const card of hand) {
    const cardValue = card.rank === 'A' ? 11 : isNaN(Number(card.rank)) ? 10 : Number(card.rank);

    if (card.rank === 'A') {
      aceCount++;
      // Duplicate possible values for each Ace (1 and 11)
      const newPossibleValues = [];
      for (const value of possibleValues) {
        newPossibleValues.push(value + 1);
        newPossibleValues.push(value + 11);
      }
      possibleValues.length = 0;
      possibleValues.push(...newPossibleValues);
    }
    // Add the card value to all possible values
    else for (let i = 0; i < possibleValues.length; i++) possibleValues[i] += cardValue;
  }

  while (aceCount > 0) {
    aceCount--;
    const newPossibleValues = [];
    for (const value of possibleValues) {
      // If an Ace's value is 11 and it causes the hand to bust, consider it as 1
      if (value > 21) newPossibleValues.push(value - 10);
      else newPossibleValues.push(value);
    }
    possibleValues.length = 0;
    possibleValues.push(...newPossibleValues);
  }

  return possibleValues;
};

const canSplit = async (player: string | any[]) => {
  // Check if split is possible
  return player.length === 2 && player[0].rank === player[1].rank;
};

const doubleDown = async (player: string | any[]) => {
  if (player.length === 2) {
    // Deal card
    // Dealer turn
  }
};

const takeInsurance = (dealer: { rank: string }[]) => {
  if (dealer[0] && dealer[0].rank === 'A') {
    // Insurance Accepted
    // If dealer has blackjack reveals hand and win
    // Game continues
  }
};

const dealerTurn = () => {
  // Dealer reveals their hand
  // Dealer hand is lower than 17 keep playing
  // If dealer hand is higher than 21 bust
  // if dealer doesn't get busted and cards are higher than 17 check game status
};

const dealCard = async () => {
  // Deal a card for dealer or player
  const randomRankIndex = Math.floor(Math.random() * ranks.length);
  const randomSuitIndex = Math.floor(Math.random() * suits.length);
  const randomRank = ranks[randomRankIndex];
  const randomSuit = suits[randomSuitIndex];

  return { rank: randomRank, suit: randomSuit };
};

const checkGameStatus = async (playerHand: any, dealerHand: any) => {
  const playerValue: any = await calculateHandValue(playerHand);
  const dealerValue: any = await calculateHandValue(dealerHand);

  if (playerValue === 21 && [1, 2].length === 2) return 'blackjack_player';
  if (dealerValue === 21 && [1, 2].length === 2) return 'blackjack_dealer';

  if (playerValue > 21) return 'bust_player';
  if (dealerValue > 21) return 'bust_dealer';

  if (dealerValue > 16 && playerValue <= 21) {
    if (playerValue === dealerValue) return 'push';
    if (playerValue > dealerValue) return 'win_player';
    if (playerValue < dealerValue) return 'win_dealer';
  }
  return 'continue';
};

export const hitAction = async (action: string) => {
  try {
    console.log(action);
    const user = await getCurrentUser();
    if (!user?.email) return { message: null, error: `You must be signed in.` };

    const data = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });
    if (!data) throw new Error('Error');
    const playerCard = await dealCard();
    const playerValue = await calculateHandValue([...data.state.player[0].cards, playerCard]);
    console.log('here1');
    data.state.player[0].actions = [...data.state.player[0].actions, 'hit'];
    data.state.player[0].cards = [...data.state.player[0].cards, playerCard];
    data.state.player[0].value = playerValue;
    console.log('here2');
    await prisma.game.update({
      where: { active: true, user_email: user.email, id: data.id },
      data: data,
    });
    console.log('here3');
    revalidatePath('/play');
    return { message: 'Success.', error: null };
  } catch (e) {
    console.log(e);
    return { message: null, error: 'An error occurred while trying to save your profile settings. Please try again.' };
  }
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
