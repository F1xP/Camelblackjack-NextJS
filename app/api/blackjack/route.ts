import { authOptions, prisma } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
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

const dealCard = async () => {
  // Deal a card for dealer or player
  const randomRankIndex = Math.floor(Math.random() * ranks.length);
  const randomSuitIndex = Math.floor(Math.random() * suits.length);
  const randomRank = ranks[randomRankIndex];
  const randomSuit = suits[randomSuitIndex];

  return { rank: randomRank, suit: randomSuit };
};

type Data = {
  id: string;
  active: boolean;
  payoutMultiplier: number;
  amountMultiplier: number;
  amount: number;
  payout: number;
  state: {
    player: [
      {
        value: number[];
        actions: string[];
        cards: any[];
      }
    ];
    dealer: {
      value: number[];
      actions: string[];
      cards: any[];
    };
  };
  updatedAt: number;
  user: {
    id: string;
    name: string;
  };
};

const data: Data = {
  id: crypto.randomUUID(),
  active: false,
  payoutMultiplier: 2,
  amountMultiplier: 1,
  amount: 0,
  payout: 0,
  state: {
    player: [{ value: [0], actions: [], cards: [] }],
    dealer: { value: [0], actions: [], cards: [] },
  },
  updatedAt: Date.now(),
  user: { id: '1', name: 'Player' },
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
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });

    const userEmail = session.user?.email?.toString();
    const data = await prisma.game.findFirst({
      where: { active: true, user_email: userEmail ?? undefined },
    });
    return NextResponse.json({ data }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'You must be signed in.' }, { status: 401 });

    const userEmail = session.user?.email?.toString();
    const isActive = await prisma.game.findFirst({
      where: { active: true, user_email: userEmail ?? undefined },
    });
    if (isActive)
      return NextResponse.json(
        { error: 'You must finish your active game in order to start another.' },
        { status: 409 }
      );
    // Start the game by dealing two cards for the player and 2 cards for the dealer
    const player_card1 = await dealCard();
    const player_card2 = await dealCard();
    const dealer_card1 = await dealCard();
    const dealer_card2 = await dealCard();
    const playerValue = await calculateHandValue([player_card1, player_card2]);
    const dealerValue = await calculateHandValue([dealer_card1]);
    const data = await prisma.game.create({
      data: {
        active: true,
        payoutMultiplier: 1,
        amountMultiplier: 1,
        amount: 100,
        payout: 0,
        state: {
          player: [{ value: playerValue, actions: ['deal'], cards: [player_card1, player_card2] }],
          dealer: { value: dealerValue, actions: ['deal'], cards: [dealer_card1, dealer_card2] },
        },
        user_email: userEmail ?? undefined,
      },
    });
    data.state.dealer.cards = [data.state.dealer.cards[0]];
    return NextResponse.json({ data }, { status: 201 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const player_card1 = await dealCard();
    data.state.player[0].cards.push(player_card1);
    data.state.player[0].actions.push('hit');
    data.state.player[0].value = await calculateHandValue(data.state.player[0].cards);
    return NextResponse.json({ data }, { status: 200 });
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
