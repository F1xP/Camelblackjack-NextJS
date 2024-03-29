import { Actions, Game, GameState, UserState } from '@/types/types';
import { Prisma } from '@prisma/client';
import { createHmac } from 'crypto';
import { ranks, suits } from './constants';

export const hasPlayerSplitted = async (gameState: GameState | undefined) =>
  ['SPLIT'].some((action) => gameState?.player[0].actions.includes(action as Actions));

export const getCurrentHand = async (gameState: GameState | undefined) => {
  if (!gameState) return 0;
  const playerHands = gameState.player.length;
  const currentHand =
    playerHands > 1 &&
    ['STAND', 'BUST', 'DOUBLE'].some((action) => gameState?.player[0].actions.includes(action as Actions))
      ? 1
      : 0;

  return currentHand;
};

export const isAllowedToSplit = async (gameState: GameState | undefined) => {
  if (!gameState) return false;

  const playerHands = gameState.player.length;
  if (playerHands > 1) false;

  const playerState = gameState.player[0];

  if (['STAND', 'BUST', 'DOUBLE', 'SPLIT'].some((action) => playerState.actions.includes(action as Actions)))
    return false;
  if (playerState.cards.length !== 2 || playerState.cards[0].rank !== playerState.cards[1].rank) return false;

  return true;
};

export const isAllowedToDouble = async (gameState: GameState | undefined, hand: number) => {
  if (!gameState) return false;

  const playerState = gameState.player[hand];
  if (['DOUBLE', 'STAND', 'BUST', 'HIT'].some((action) => playerState.actions.includes(action as Actions)))
    return false;
  return true;
};

export const isAllowedToStand = async (gameState: GameState | undefined, hand: number) => {
  if (!gameState) return false;
  const playerState = gameState.player[hand];
  if (['DOUBLE', 'STAND', 'BUST'].some((action) => playerState.actions.includes(action as Actions))) return false;
  return true;
};

export const isAllowedToInsure = async (gameState: GameState | undefined) => {
  if (!gameState) return false;
  const playerState = gameState.player[0];
  const lastPlayerAction = playerState.actions.slice(-1)[0];
  if (gameState?.dealer.cards[0].rank !== 'A' || lastPlayerAction !== 'DEAL') return false;
  return true;
};

export const disabledButtons = async (
  gameData: Pick<Game, 'active' | 'id' | 'state' | 'hashedSeed'> | null,
  currentHand: 0 | 1
) => {
  const gameState = gameData?.state;
  const isGameActive = gameData?.active;

  const [canDouble, canSplit, canStand, canInsure] = await Promise.all([
    isAllowedToDouble(gameState, currentHand),
    isAllowedToSplit(gameState),
    isAllowedToStand(gameState, currentHand),
    isAllowedToInsure(gameState),
  ]);

  return {
    bet: isGameActive || false,
    split: !isGameActive || !canSplit,
    stand: !isGameActive || !canStand,
    double: !isGameActive || !canDouble,
    hit: !isGameActive || !canStand,
    insurance: !isGameActive || !canInsure,
  };
};

export const calculateHandValue = async (hand: any, type: 'P' | 'D') => {
  let values = [0];
  let aceCount = 0;

  for (const card of hand) {
    if (card.rank === 'A') aceCount++;
    else values[0] += Number(card.rank) || 10;
  }

  for (let i = 0; i < aceCount; i++) {
    if (values[0] >= 11) values[0] += 1;
    else {
      if (type === 'P') {
        values[1] = values[0] + 11;
        values[0] += 1;
      }
      if (type === 'D') values[0] += 11;
    }
  }

  return values;
};

export const getCard = async (serverSeed: string, clientSeed: string, nonce: number, cursor: number) => {
  let currentRound = Math.floor(cursor / 32);
  let currentRoundCursor = cursor;

  while (true) {
    const hmac = createHmac('sha256', serverSeed);
    hmac.update(`${clientSeed}:${nonce}:${currentRound}`);
    const buffer = hmac.digest();
    while (currentRoundCursor < 32) {
      return {
        rank: ranks[buffer[currentRoundCursor] % ranks.length],
        suit: suits[buffer[currentRoundCursor] % suits.length],
      };
    }
    currentRoundCursor = 0;
    currentRound += 1;
  }
};

export const getGameStatus = async (isGameActive: boolean, gameState: GameState | undefined, hand: number) => {
  if (isGameActive) return null;
  if (!gameState || !gameState.player[hand]) return null;
  const [hasSplitted, playerValue] = await Promise.all([
    hasPlayerSplitted(gameState),
    getHandValue(gameState.player[hand]),
  ]);

  const dealerValue = Number(gameState.dealer.value[0]);

  const playerCards = gameState.player[hand].cards;
  const dealerCards = gameState.dealer.cards;

  const lastPlayerAction = gameState.player[hand].actions.slice(-1)[0];
  const lastDealerAction = gameState.dealer.actions.slice(-1)[0];

  const isPlayerBusted = lastPlayerAction === 'BUST';
  const isDealerBusted = lastDealerAction === 'BUST';

  const naturalPlayerBlackjack = !hasSplitted && playerCards.length === 2 && playerValue === 21;
  const naturalDealerBlackjack = lastDealerAction === 'DEAL' && dealerCards[0].rank === 'A' && dealerValue === 21;
  const dealerBlackjack =
    lastDealerAction === 'DEAL' &&
    (lastPlayerAction === 'INS_ACCEPTED' || lastPlayerAction === 'INS_DECLINED') &&
    dealerCards[0].rank === 'A' &&
    dealerValue === 21;

  if (naturalPlayerBlackjack && naturalDealerBlackjack) return { state: 'Push', text: 'Push' };
  if (naturalPlayerBlackjack) return { state: 'PBJ', text: 'Player Blackjack' };
  if (dealerBlackjack) return { state: 'DBJ', text: 'Dealer Blackjack' };
  if (isPlayerBusted) return { state: 'Lose', text: 'Player Bust' };
  if (!isPlayerBusted && isDealerBusted) return { state: 'Win', text: 'Dealer Bust' };

  if (dealerValue > 16 && playerValue <= 21) {
    if (playerValue === dealerValue) return { state: 'Push', text: 'Push' };
    if (playerValue > dealerValue) return { state: 'Win', text: 'Player Wins' };
    if (playerValue < dealerValue) return { state: 'Lose', text: 'Dealer Wins' };
  }
  return null;
};

export const shouldGameEnd = async (gameState: GameState | undefined, end: boolean) => {
  if (!gameState) return true;

  const dealerState = gameState.dealer;
  const [dealerValue, hasSplitted, currentHand] = await Promise.all([
    getHandValue(dealerState),
    hasPlayerSplitted(gameState),
    getCurrentHand(gameState),
  ]);
  const playerState = gameState.player[currentHand];
  const playerValue = await getHandValue(playerState);
  const hasBusted = playerValue > 21;
  const lastPlayerAction = playerState.actions.slice(-1)[0];
  const lastDealerAction = dealerState.actions.slice(-1)[0];
  const playerCards = gameState.player[currentHand].cards;
  const dealerCards = gameState.dealer.cards;

  const naturalPlayerBlackjack = !hasSplitted && playerCards.length === 2 && playerValue === 21;
  const naturalDealerBlackjack = lastDealerAction === 'DEAL' && dealerCards[0].rank === 'A' && dealerValue === 21;
  const dealerBlackjack =
    lastDealerAction === 'DEAL' &&
    (lastPlayerAction === 'INS_ACCEPTED' || lastPlayerAction === 'INS_DECLINED') &&
    dealerCards[0].rank === 'A' &&
    dealerValue === 21;

  if (naturalPlayerBlackjack && naturalDealerBlackjack) return true;
  if (naturalPlayerBlackjack) return true;
  if (dealerBlackjack) return true;

  if (hasSplitted && currentHand === 0) return false;
  if (hasSplitted && currentHand === 1) return lastPlayerAction === 'SPLIT' ? false : hasBusted || end;
  return hasBusted || end;
};

export const deductCoins = async (
  tx: Prisma.TransactionClient,
  userEmail: string,
  amountToDeduct: number,
  incrementNonce?: boolean
) => {
  const deducted = await tx.user.update({
    where: { email: userEmail as string },
    data: {
      coins: {
        decrement: amountToDeduct,
      },
      nonce: {
        increment: incrementNonce ? 1 : 0,
      },
    },
  });
  if (deducted.coins < 0) throw new Error('Insufficient coins.');
};

export const dealerTurn = async (
  game: Pick<Game, 'id' | 'state' | 'seed' | 'cursor'>,
  clientSeed: string,
  nonce: number
) => {
  const serverSeed = game.seed;
  const cursor = game.cursor;
  const dealerState = game.state.dealer;

  const { value, actions, cards } = dealerState;

  if (value[0] >= 17) return actions.push(value[0] > 21 ? 'BUST' : 'STAND');

  const newDealerCard = await getCard(serverSeed, clientSeed, nonce, cursor);
  dealerState.cards = [...cards, newDealerCard];
  dealerState.actions = [...actions, 'HIT'];
  const dealerValue = await calculateHandValue(dealerState.cards, 'D');
  dealerState.value = dealerValue;
  game.cursor += 1;

  await dealerTurn(game, clientSeed, nonce);
};

export const gameEnded = async (
  tx: Prisma.TransactionClient,
  game: Pick<Game, 'id' | 'state' | 'seed' | 'cursor' | 'active' | 'user_email'>
) => {
  let totalPayout = 0;
  const updateCoins = async (index: number) => {
    const playerState = game.state.player[index];
    const hasInsured = ['INS_ACCEPTED'].some((action) => playerState.actions.includes(action as Actions));
    const amount = playerState.amount;
    const handResult = await getGameStatus(!game.active, game.state, index);
    const resultMultiplier =
      handResult?.state === 'PBJ'
        ? 2.5
        : handResult?.state === 'Win' || (handResult?.state === 'DBJ' && hasInsured)
        ? 2
        : handResult?.state === 'Push'
        ? 1
        : 0;
    const incrementAmount = amount * resultMultiplier;
    totalPayout += incrementAmount;
    await tx.user.update({
      where: { email: game.user_email as string },
      data: {
        wager: {
          increment: amount,
        },
        coins: {
          increment: incrementAmount,
        },
        games: {
          increment: 1,
        },
        pushes: {
          increment: resultMultiplier === 1 ? 1 : 0,
        },
        wins: {
          increment: resultMultiplier > 1 ? 1 : 0,
        },
        loses: {
          increment: resultMultiplier < 2 ? 1 : 0,
        },
      },
    });
  };

  const hasSplitted = await hasPlayerSplitted(game.state);
  if (hasSplitted) await Promise.all([updateCoins(0), updateCoins(1)]);
  else await updateCoins(0);

  await tx.game.update({
    where: { id: game.id },
    data: {
      payout: totalPayout,
      active: false,
      state: {
        player: game.state.player,
        dealer: game.state.dealer,
      },
    },
  });
};

export const getHandValue = async (playerState: UserState) => {
  if (!playerState) return 0;
  return playerState.value.length > 1
    ? playerState.value[1] > 21
      ? Number(playerState.value[0])
      : Number(playerState.value[1])
    : Number(playerState.value[0]);
};
