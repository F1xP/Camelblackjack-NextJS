const readline = require('readline');

const data = {
  id: 'cf4615e1-7954-4309-a9cb-130772396f22',
  active: true,
  payoutMultiplier: 0,
  amountMultiplier: 1,
  amount: 0,
  payout: 0,
  updatedAt: 'Sun, 05 Nov 2023 10:48:36 GMT',
  user: {
    id: '11a38c34-52b8-41ec-9590-6161f78f3ff0',
    name: 'Mrbeast5000',
  },
  state: {
    player: [
      {
        value: 11,
        actions: ['DEAL', 'SPLIT'],
        cards: [
          {
            rank: '7',
            suit: 'C',
          },
          {
            rank: '4',
            suit: 'D',
          },
        ],
      },
      {
        value: 12,
        actions: ['DEAL', 'SPLIT'],
        cards: [
          {
            rank: '7',
            suit: 'D',
          },
          {
            rank: '5',
            suit: 'C',
          },
        ],
      },
    ],
    dealer: [
      {
        value: 10,
        actions: ['DEAL'],
        cards: [
          {
            rank: 'K',
            suit: 'D',
          },
        ],
      },
    ],
  },
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

const createDeck = () => {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ rank, suit });
    }
  }
  return deck;
};

const shuffleDeck = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};

const calculateHandValue = (hand) => {
  let value = 0;
  let hasAce = false;

  for (const card of hand) {
    const cardValue = card.rank === 'A' ? 11 : isNaN(Number(card.rank)) ? 10 : Number(card.rank);
    value += cardValue;
    if (card.rank === 'A') hasAce = true;
  }

  while (value > 21 && hasAce) {
    value -= 10;
    hasAce = false;
  }

  return value;
};

const player = [];
const dealer = [];
let deck = createDeck();

let playerBalance = 1000;
let playerBet = 0;
let insuranceBet = 0;

const getCard = (hand) => {
  const card = deck.pop();
  hand.push(card);
};

const canSplit = () => {
  return player.length === 2 && player[0].rank === player[1].rank;
};

const splitHand = () => {
  const secondHand = [player.pop()];
  getCard(player);
  getCard(secondHand);
  console.log('Player splits the hand.');

  console.log('Playing the first hand:');
  player = [player[0]];
  playerTurn();

  console.log('Playing the second hand:');
  player = secondHand;
  playerTurn();
};

const checkBlackjack = () => {
  const playerValue = calculateHandValue(player);
  const dealerValue = calculateHandValue(dealer);
  if (playerValue === 21) {
    console.log('Player has blackjack! Player wins.');
    playerBalance += playerBet * 2.5; // Blackjack pays 3:2
    if (insuranceBet > 0) {
      playerBalance += insuranceBet * 2;
    }
  } else if (dealerValue === 21) {
    console.log('Dealer has blackjack. Dealer wins.');
  } else {
    playerAction();
  }
};

const askForBet = () => {
  rl.question(`Player balance: ${playerBalance}. Enter your bet: `, (input) => {
    const bet = parseInt(input, 10);
    if (isNaN(bet) || bet <= 0 || bet > playerBalance) {
      console.log('Invalid bet. Please enter a valid bet.');
      askForBet();
    } else {
      playerBet = bet;
      playerBalance -= playerBet;
      startGame();
    }
  });
};

const startGame = () => {
  getCard(player);
  getCard(dealer);
  getCard(player);
  getCard(dealer);

  console.log(
    'Player was dealt: ' + player[0].rank + ' of ' + player[0].suit + ' and ' + player[1].rank + ' of ' + player[1].suit
  );
  console.log('Dealer was dealt: ' + dealer[0].rank + ' of ' + dealer[0].suit);
  console.log("Player's hand value: " + calculateHandValue(player));

  if (dealer[0].rank === 'A') {
    rl.question('Dealer has an Ace. Do you want to take insurance? (y/n): ', (choice) => {
      if (choice.toLowerCase() === 'y') {
        takeInsurance();
      } else {
        if (canSplit()) {
          rl.question('Do you want to split? (y/n): ', (splitChoice) => {
            if (splitChoice.toLowerCase() === 'y') {
              splitHand();
            } else {
              checkBlackjack();
            }
          });
        } else {
          checkBlackjack();
        }
      }
    });
  } else {
    if (canSplit()) {
      rl.question('Do you want to split? (y/n): ', (choice) => {
        if (choice.toLowerCase() === 'y') {
          splitHand();
        } else {
          checkBlackjack();
        }
      });
    } else {
      checkBlackjack();
    }
  }
};

const playerAction = () => {
  rl.question('Do you want to hit or stand? (h/s): ', (choice) => {
    if (choice.toLowerCase() === 'h') {
      getCard(player);
      const playerValue = calculateHandValue(player);
      console.log(`Player was dealt: ${player[player.length - 1].rank} of ${player[player.length - 1].suit}`);
      console.log(`Player's hand value: ${playerValue}`);
      if (playerValue > 21) {
        console.log('Player busts. Dealer wins.');
        playerBet = 0;
        rl.close();
      } else {
        playerAction();
      }
    } else if (choice.toLowerCase() === 's') {
      dealerTurn();
    } else {
      console.log('Invalid input. Please enter "h" to hit or "s" to stand.');
      playerAction();
    }
  });
};

const doubleDown = () => {
  if (player.length === 2 && playerBalance >= playerBet) {
    playerBet *= 2;
    playerBalance -= playerBet / 2;
    getCard(player);
    dealerTurn();
  } else {
    console.log("Double down is not allowed. Please choose 'h' to hit or 's' to stand.");
    playerAction();
  }
};

const takeInsurance = () => {
  if (dealer[0] && dealer[0].rank === 'A' && playerBalance >= playerBet / 2) {
    rl.question('Taking insurance. Enter your insurance bet: ', (input) => {
      const insBet = parseInt(input, 10);
      if (isNaN(insBet) || insBet < 0 || insBet > playerBet / 2 || insBet > playerBalance) {
        console.log('Invalid insurance bet. Please enter a valid insurance bet.');
        takeInsurance();
      } else {
        insuranceBet = insBet;
        playerBalance -= insuranceBet;
        playerAction();
      }
    });
  } else {
    console.log("Insurance is not allowed or you don't have enough balance. Please choose 'h' to hit or 's' to stand.");
    playerAction();
  }
};

const dealerTurn = () => {
  let dealerValue = calculateHandValue(dealer);
  const playerValue = calculateHandValue(player);
  console.log('Dealer reveals their hand:');
  console.log(`Dealer has: ${dealer[0].rank} of ${dealer[0].suit} and ${dealer[1].rank} of ${dealer[1].suit}`);
  console.log(`Dealer's hand value: ${dealerValue}`);
  while (calculateHandValue(dealer) < 17) {
    getCard(dealer);
    console.log(`Dealer got: ${dealer[-1].rank} of ${dealer[-1].suit}`);
    console.log(`Dealer's hand value: ${dealerValue}`);
  }
  dealerValue = calculateHandValue(dealer);
  if (dealerValue > 21 || playerValue > dealerValue) {
    console.log('Player wins!');
    playerBalance += playerBet * 2;
    if (insuranceBet > 0) {
      playerBalance += insuranceBet * 2;
    }
  } else if (playerValue < dealerValue) {
    console.log('Dealer wins.');
  } else {
    console.log("It's a push.");
    playerBalance += playerBet;
    if (insuranceBet > 0) {
      playerBalance += insuranceBet;
    }
  }

  playerBet = 0;
  insuranceBet = 0;

  rl.question('Play another round? (y/n): ', (choice) => {
    if (choice.toLowerCase() === 'y') {
      resetGame();
      askForBet();
    } else {
      console.log('Thank you for playing! Your final balance: ' + playerBalance);
      rl.close();
    }
  });
};

const resetGame = () => {
  player.length = 0;
  dealer.length = 0;
  deck = createDeck();
  shuffleDeck(deck);
};

resetGame();
askForBet();
