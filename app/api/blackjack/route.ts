import { NextResponse } from 'next/server';

const player: any[] = [];
const dealer: any[] = [];
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

const canSplit = async () => {
  // Check if split is possible
  return player.length === 2 && player[0].rank === player[1].rank;
};

const doubleDown = async () => {
  if (player.length === 2) {
    // Deal card
    // Dealer turn
  }
};

const takeInsurance = () => {
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

const dealCard = async (hand: any[]) => {
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

export async function GET(request: Request) {
  try {
    const player_card1 = await dealCard(player);
    const dealer_card1 = await dealCard(dealer);
    const player_card2 = await dealCard(player);
    const dealer_card2 = await dealCard(dealer);
    console.log(player_card1);
    const data = {
      active: false,
      user: { id: '1', name: 'Plyaer' },
      bet: 123,
      bet_multiplier: 1,
      player: { cards: [player_card1, player_card2], actions: [] },
      dealer: { cards: [dealer_card1, dealer_card2], actions: [] },
    };
    const gameStatus = await checkGameStatus([], []);
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Start the game by dealing two cards for the player and 2 cards for the dealer
    const player_card1 = await dealCard(player);
    const dealer_card1 = await dealCard(dealer);
    const player_card2 = await dealCard(player);
    const dealer_card2 = await dealCard(dealer);
    console.log(player_card1);
    const data = {
      active: false,
      user: { id: '1', name: 'Plyaer' },
      bet: 123,
      bet_multiplier: 1,
      player: { cards: [player_card1, player_card2], actions: [] },
      dealer: { cards: [dealer_card1, dealer_card2], actions: [] },
    };
    const gameStatus = await checkGameStatus([], []);
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    return NextResponse.json({ message: 'Message sent.' }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    return NextResponse.json({ message: 'Message sent.' }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
