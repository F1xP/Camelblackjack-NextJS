'use client';
import { useTheme } from 'next-themes';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export default function ProvablyFair() {
  const { theme } = useTheme();

  const codeSnippet = `  const { createHmac } = require('crypto');

  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

  // Function to verify the bet by re-performing the code
  const verifyBet = async () => {
    // Placeholder values for serverSeed, clientSeed, nonce, and cursor
    const serverSeed = '';  // Replace with actual serverSeed
    const clientSeed = '';  // Replace with actual clientSeed
    const nonce = '';       // Replace with actual nonce
    const cursor = '';      // Replace with actual cursor

    // Calculate the current round and initialize the cursor
    let currentRound = Math.floor(cursor / 32);
    let currentRoundCursor = cursor;

    while (true) {
      // Create an HMAC instance using SHA-256 and update it with the provided values
      const hmac = createHmac('sha256', serverSeed);
      hmac.update(\`\${clientSeed}:\${nonce}:\${currentRound}\`);
      const buffer = hmac.digest();

      while (currentRoundCursor < 32) {
        const rank = ranks[buffer[currentRoundCursor] % ranks.length]
        const suit = suits[buffer[currentRoundCursor] % suits.length]
        // Log nonce, cursor, and serverSeed for transparency
        console.log(\`nonce: \${nonce}, cursor: \${cursor}, serverSeed: \${serverSeed}\`);
        // Calculate and log the result of the bet
        console.log(\`Result: \${rank} of \${suit}\`);
        // Return the result as an object with 'rank' and 'suit'
        return {
          rank: rank,
          suit: suit,
        };
      }

      // Reset the cursor for the next round
      currentRoundCursor = 0;
      currentRound += 1;
    }
  };

  // Call the verifyBet function to re-perform the code and verify the bet
  verifyBet().then((result) => console.log(result));
`;

  return (
    <div className="w-full group">
      <h1>Ensuring fairness</h1>
      <p>
        Our Blackjack game ensures fairness through a Provably Fair mechanism. Each bet utilizes a combination of a
        client seed, a server seed, a nonce, and a cursor as input parameters to generate a verifiable random number.
        This random number is then used to extract a card from the deck, providing transparency and proof of fairness.
      </p>
      <h1>How it works</h1>
      <p>
        The Provably Fair algorithm works by combining the client seed, server seed, and nonce to create a unique and
        unpredictable result for each bet. The server seed is kept secret until the end of the game to prevent any
        manipulation. Players can verify the fairness of their bets by checking the provided information.
      </p>
      <h1>How to verify</h1>
      <p>
        To verify your bet, use the following code snippet to re-perform the Provably Fair mechanism with the same
        server seed, client seed, nonce, and cursor used in the original bet.
      </p>

      <SyntaxHighlighter
        className="border-2 border-secondary dark:border-dark_secondary rounded-md w-full h-[500px]"
        language="javascript"
        style={theme === 'light' ? atomOneLight : atomOneDark}>
        {codeSnippet}
      </SyntaxHighlighter>
    </div>
  );
}
