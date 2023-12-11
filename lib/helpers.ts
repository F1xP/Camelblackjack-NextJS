import { Game, GameState, UserState } from '@/types/types';
import { Prisma } from '@prisma/client';

export const hasPlayerSplitted = async (gameState: GameState | null) => {
  return gameState?.player[0].actions.includes('SPLIT');
};

export const getCurrentHand = async (gameState: GameState | null) => {
  if (!gameState) return 0;
  const playerHands = gameState.player.length;
  const currentHand =
    playerHands > 1 && ['STAND', 'BUST', 'DOUBLE'].includes(gameState.player[0].actions.slice(-1)[0]) ? 1 : 0;

  return currentHand;
};

export const isAllowedToSplit = async (gameState: GameState | null) => {
  if (!gameState) return false;

  const playerHands = gameState.player.length;
  if (playerHands > 1) false;

  const playerState = gameState.player[0];
  const lastPlayerAction = playerState.actions.slice(-1)[0];

  if (['DOUBLE', 'STAND', 'BUST'].includes(lastPlayerAction)) return false;
  if (playerState.cards.length !== 2 || playerState.cards[0].rank !== playerState.cards[1].rank) return false;

  return true;
};

export const isAllowedToDouble = async (gameState: GameState | null, hand: number) => {
  if (!gameState) return false;

  const playerState = gameState.player[hand];
  const lastPlayerAction = playerState.actions.slice(-1)[0];

  if (['DOUBLE', 'STAND', 'BUST'].includes(lastPlayerAction)) return false;
  return true;
};

export const calculateHandValue = async (hand: any, type: 'P' | 'D') => {
  let values = [0];
  let aceCount = 0;

  for (const card of hand) {
    const cardValue = card.rank === 'A' ? 11 : isNaN(Number(card.rank)) ? 10 : Number(card.rank);
    if (card.rank === 'A') aceCount++;
    else values[0] += cardValue;
  }

  for (let i = 0; i < aceCount; i++) {
    if (type === 'P') {
      if (values[0] >= 11) values[0] += 1;
      else {
        values[1] = values[0] + 11;
        values[0] += 1;
      }
    }
    if (type === 'D') {
      if (values[0] >= 11) values[0] += 1;
      else values[0] += 11;
    }
  }

  return values;
};

export const takeInsurance = (dealer: { rank: string }[]) => {
  if (dealer[0] && dealer[0].rank === 'A') {
    // Insurance Accepted
    // If dealer has blackjack reveals hand and win
    // Game continues
  }
};

export const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

export const getCard = async () => {
  const randomRankIndex = Math.floor(Math.random() * ranks.length);
  const randomSuitIndex = Math.floor(Math.random() * suits.length);
  const randomRank = ranks[randomRankIndex];
  const randomSuit = suits[randomSuitIndex];

  return { rank: randomRank, suit: randomSuit };
};

export const getGameStatus = async (gameState: GameState | null, hand: number) => {
  if (!gameState || !gameState.player[hand]) return null;

  const playerCards = gameState.player[hand].cards;
  const dealerCards = gameState.dealer.cards;

  const playerValue = await getHandValue(gameState.player[hand]);
  const dealerValue = Number(gameState.dealer.value[0]);

  const playerLastAction = gameState.player[hand].actions.slice(-1)[0];
  const dealerLastAction = gameState.dealer.actions.slice(-1)[0];

  const isPlayerBusted = playerLastAction === 'BUST';
  const isDealerBusted = dealerLastAction === 'BUST';

  if (playerValue === 21 && playerCards.length === 2 && dealerLastAction === 'DEAL') return 'Blackjack Player';
  if (dealerValue === 21 && dealerCards.length === 2 && playerLastAction === 'DEAL') return 'Blackjack Dealer';

  if (isPlayerBusted) return 'Lose';
  if (!isPlayerBusted && isDealerBusted) return 'Win';

  if (dealerValue > 16 && playerValue <= 21) {
    if (playerValue === dealerValue) return 'PUSH';
    if (playerValue > dealerValue) return 'Win';
    if (playerValue < dealerValue) return 'Lose';
  }
  return null;
};

export const shouldGameEnd = async (gameState: GameState | null, end: boolean) => {
  if (!gameState) return true;

  const dealerState = gameState.dealer;
  const dealerValue = await getHandValue(dealerState);
  const hasSplitted = await hasPlayerSplitted(gameState);
  const currentHand = await getCurrentHand(gameState);
  const playerState = gameState.player[currentHand];
  const playerValue = await getHandValue(playerState);
  const hasBusted = playerValue > 21;
  const lastPlayerAction = playerState.actions.slice(-1)[0];
  const lastDealerAction = playerState.actions.slice(-1)[0];

  if (
    lastDealerAction === 'DEAL' &&
    (lastPlayerAction === 'INS_ACCEPTED' ||
      lastPlayerAction === 'INS_DECLINED' ||
      ['10', 'J', 'Q', 'K'].includes(dealerState.cards[0].rank)) &&
    dealerValue === 21
  )
    return true; // Blackjack for dealer

  if (!hasSplitted && playerState.cards.length === 2 && playerValue === 21) return true; // Blackjack for player
  if (hasSplitted && currentHand === 1 && lastPlayerAction !== 'SPLIT') return hasBusted || end;
  else return hasBusted || end;
};

export const deductCoins = async (tx: Prisma.TransactionClient, userEmail: string, amountToDeduct: number) => {
  const deducted = await tx.user.update({
    where: { email: userEmail as string },
    data: {
      coins: {
        decrement: amountToDeduct,
      },
    },
  });
  if (deducted.coins < 0) throw new Error('Insufficient coins.');
};

export const dealerTurn = async (dealerState: UserState) => {
  const { value, actions, cards } = dealerState;

  if (value[0] >= 17) {
    actions.push(value[0] > 21 ? 'BUST' : 'STAND');
    return;
  }

  const newDealerCard = await getCard();
  dealerState.cards = [...cards, newDealerCard];
  dealerState.actions = [...actions, 'HIT'];
  dealerState.value = await calculateHandValue(dealerState.cards, 'D');

  await dealerTurn(dealerState);
};

export const gameEnded = async (tx: Prisma.TransactionClient, game: Game) => {
  const updateCoins = async (index: number) => {
    const amount = game.state.player[index].amount;
    const handResult = await getGameStatus(game.state, index);
    const resultMultiplier =
      handResult === 'Blackjack Player' ? 2.5 : handResult === 'Win' ? 2 : handResult === 'PUSH' ? 1 : 0;

    if (resultMultiplier === 0) return;
    const incrementAmount = amount * resultMultiplier;

    await tx.user.update({
      where: { email: game.user_email as string },
      data: {
        coins: { increment: incrementAmount },
      },
    });
  };

  const hasSplitted = await hasPlayerSplitted(game.state);

  if (hasSplitted) {
    await updateCoins(0);
    await updateCoins(1);
  } else {
    await updateCoins(0);
  }
};

export const getHandValue = async (playerState: UserState) => {
  if (!playerState) return 0;
  return playerState.value.length > 1
    ? playerState.value[1] > 21
      ? Number(playerState.value[0])
      : Number(playerState.value[1])
    : Number(playerState.value[0]);
};
