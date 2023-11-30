import { Game, GameState } from '@/types/types';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

export const calculateHandValue = async (hand: any) => {
  let values = [0];
  let aceCount = 0;

  for (const card of hand) {
    const cardValue = card.rank === 'A' ? 11 : isNaN(Number(card.rank)) ? 10 : Number(card.rank);
    if (card.rank === 'A') aceCount++;
    else values[0] += cardValue;
  }

  for (let i = 0; i < aceCount; i++) {
    if (values[0] >= 11) values[0] += 1;
    else {
      values[1] = values[0] + 11;
      values[0] += 1;
    }
  }
  return values.reverse();
};

export const calculateDealerHandValue = async (hand: any) => {
  let values = [0];
  let aceCount = 0;

  for (const card of hand) {
    const cardValue = card.rank === 'A' ? 11 : isNaN(Number(card.rank)) ? 10 : Number(card.rank);
    if (card.rank === 'A') aceCount++;
    else values[0] += cardValue;
  }

  for (let i = 0; i < aceCount; i++) {
    if (values[0] >= 11) values[0] += 1;
    else values[0] += 11;
  }

  return values.reverse();
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

export const checkGameStatus = async (gameState: GameState | null, hand: number) => {
  if (!gameState || !gameState.player[hand]) return null;

  const playerCards = gameState.player[hand].cards;
  const dealerCards = gameState.dealer.cards;

  const playerValue = Number(gameState.player[hand].value[0]);
  const dealerValue = Number(gameState.dealer.value[0]);

  const playerLastAction = gameState.player[hand].actions.slice(-1)[0];
  const dealerLastAction = gameState.dealer.actions.slice(-1)[0];

  const isPlayerBusted = playerLastAction === 'bust';
  const isDealerBusted = dealerLastAction === 'bust';

  if (playerValue === 21 && playerCards.length === 2) return 'Win';
  if (dealerValue === 21 && dealerCards.length === 2) return 'Lose';

  if (isPlayerBusted) return 'Lose';
  if (!isPlayerBusted && isDealerBusted) return 'Win';

  if (dealerValue > 16 && playerValue <= 21) {
    if (playerValue === dealerValue) return 'Push';
    if (playerValue > dealerValue) return 'Win';
    if (playerValue < dealerValue) return 'Lose';
  }
  return null;
};

export const getErrorMessage = (error: unknown): string => {
  let message: string;
  if (error instanceof Error) message = error.message;
  else if (error && typeof error === 'object' && 'message' in error) message = String(error.message);
  else if (typeof error === 'string') message = error;
  else message = 'An unexpected error occured';
  return message;
};
