import { Game, GameState } from '@/types/types';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

export const calculateHandValue = async (hand: any) => {
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

export const calculateDealerHandValue = async (hand: any) => {
  const possibleValues = [0];
  let aceCount = 0;

  for (const card of hand) {
    const cardValue = card.rank === 'A' ? 11 : isNaN(Number(card.rank)) ? 10 : Number(card.rank);

    if (card.rank === 'A') {
      aceCount++;
      const newPossibleValues = [];
      for (const value of possibleValues) {
        newPossibleValues.push(value + 1);
        newPossibleValues.push(value + 11);
      }
      possibleValues.length = 0;
      possibleValues.push(...newPossibleValues);
    } else for (let i = 0; i < possibleValues.length; i++) possibleValues[i] += cardValue;
  }

  while (aceCount > 0) {
    aceCount--;
    const newPossibleValues = [];
    for (const value of possibleValues) {
      if (value > 21 && aceCount === 0) newPossibleValues.push(value - 10);
      else newPossibleValues.push(value);
    }
    possibleValues.length = 0;
    possibleValues.push(...newPossibleValues);
  }

  return possibleValues;
};

export const getCurrentHand = async (gameState: GameState | null) => {
  if (!gameState) return 0;
  const playerHands = gameState.player.length;
  const currentHand =
    playerHands > 1 && ['stand', 'bust', 'double'].includes(gameState.player[0].actions.slice(-1)[0]) ? 1 : 0;

  return currentHand;
};

export const canSplit = async (game: Game) => {
  // Check if the user can split based on hands length
  const playerHands = game.state.player.length;
  if (playerHands > 1) false;

  const playerState = game.state.player[0];
  const lastPlayerAction = playerState.actions.slice(-1)[0];

  // Check if the user can split based on the last action
  if (['double', 'stand', 'bust'].includes(lastPlayerAction)) return false;
  // Check if the user can split (only when the player has exactly 2 cards of the same rank)
  if (playerState.cards.length !== 2 || playerState.cards[0].rank !== playerState.cards[1].rank) return false;

  return true;
};

export const doubleDown = async (player: string | any[]) => {
  if (player.length === 2) {
    // Deal card
    // Dealer turn
  }
};

export const takeInsurance = (dealer: { rank: string }[]) => {
  if (dealer[0] && dealer[0].rank === 'A') {
    // Insurance Accepted
    // If dealer has blackjack reveals hand and win
    // Game continues
  }
};

export const dealerTurn = () => {
  // Dealer reveals their hand
  // Dealer hand is lower than 17 keep playing
  // If dealer hand is higher than 21 bust
  // if dealer doesn't get busted and cards are higher than 17 check game status
};

export const dealCard = async () => {
  // Deal a card for dealer or player
  const randomRankIndex = Math.floor(Math.random() * ranks.length);
  const randomSuitIndex = Math.floor(Math.random() * suits.length);
  const randomRank = ranks[randomRankIndex];
  const randomSuit = suits[randomSuitIndex];

  return { rank: randomRank, suit: randomSuit };
};

export const checkGameStatus = async (gameState: GameState | null) => {
  if (!gameState) return 'No Active Game';

  const playerCards = gameState.player[0].cards;
  const dealerCards = gameState.dealer.cards;

  const playerValue = Number(gameState.player[0].value[0]);
  const dealerValue = Number(gameState.dealer.value[0]);

  const playerLastAction = gameState.player[0].actions.slice(-1)[0];
  const dealerLastAction = gameState.dealer.actions.slice(-1)[0];

  const isPlayerBusted = playerLastAction === 'bust';
  const isDealerBusted = dealerLastAction === 'bust';

  if (playerValue === 21 && playerCards.length === 2) return 'Player';
  if (dealerValue === 21 && dealerCards.length === 2) return 'Dealer';

  if (isPlayerBusted) return 'Dealer';
  if (!isPlayerBusted && isDealerBusted) return 'Player';

  if (dealerValue > 16 && playerValue <= 21) {
    if (playerValue === dealerValue) return 'Push';
    if (playerValue > dealerValue) return 'Player';
    if (playerValue < dealerValue) return 'Dealer';
  }
  return 'No Result Yet';
};

export const getErrorMessage = (error: unknown): string => {
  let message: string;
  if (error instanceof Error) message = error.message;
  else if (error && typeof error === 'object' && 'message' in error) message = String(error.message);
  else if (typeof error === 'string') message = error;
  else message = 'An unexpected error occured';
  return message;
};
