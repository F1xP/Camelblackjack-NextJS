'use client';
import { useTheme } from 'next-themes';
import React, { useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { Header } from '../_components/ui/Header';

export default function ProvablyFair() {
  const { theme, systemTheme } = useTheme();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  const toggleAccordion = (accordionIndex: number) =>
    setActiveAccordion((prev) => (prev === accordionIndex ? null : accordionIndex));

  const codeSnippet = `  const { createHmac } = require('crypto');

    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  
    // Function to verify the bet by re-performing the code
    const verifyBet = async () => {
    // Placeholder values for serverSeed, clientSeed, nonce, and cursor
    const serverSeed = 'serverSeed';  // Replace with actual serverSeed
    const clientSeed = 'clientSeed';  // Replace with actual clientSeed
    const nonce = 0;       // Replace with actual nonce
    const cursor = 1;      // Replace with actual cursor
  
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

  const accordionItems = [
    {
      title: 'Ensuring fairness',
      content: (
        <p className="p-2 text-text dark:text-dark_text text-md">
          Our Blackjack game ensures fairness through a Provably Fair mechanism. Each bet utilizes a combination of a
          client seed, a server seed, a nonce, and a cursor as input parameters to generate a verifiable random number.
          This random number is then used to extract a card from the deck, providing transparency and proof of fairness.
        </p>
      ),
    },
    {
      title: 'How it works',
      content: (
        <p className="p-2 text-text dark:text-dark_text text-md">
          The Provably Fair algorithm works by combining the client seed, server seed, and nonce to create a unique and
          unpredictable result for each bet. The server seed is kept secret until the end of the game to prevent any
          manipulation.
        </p>
      ),
    },
    {
      title: 'How to verify',
      content: (
        <div className="p-2">
          <p className="text-text dark:text-dark_text text-md">
            To verify your bet, use the following code snippet to re-perform the Provably Fair mechanism with the same
            server seed, client seed, nonce, and cursor used in the original bet.
          </p>
          <SyntaxHighlighter
            className="rounded-md w-full h-[500px] border-1 border-secondary dark:border-dark_secondary"
            language="javascript"
            style={
              theme === 'system'
                ? systemTheme === 'light'
                  ? atomOneLight
                  : atomOneDark
                : theme === 'dark'
                ? atomOneDark
                : atomOneLight
            }>
            {codeSnippet}
          </SyntaxHighlighter>
        </div>
      ),
    },

    {
      title: 'Server Seed',
      content: (
        <p className="p-2 text-text dark:text-dark_text text-md">
          The server seed is a randomly generated string for each new game, utilizing the UUID (Universally Unique
          Identifier) function from the crypto library. This function produces a set of random bytes, converted into a
          hexadecimal string. The resulting hexadecimal string serves as the unique seed, contributing to the creation
          of unpredictable outcomes.
        </p>
      ),
    },
    {
      title: 'Client Seed',
      content: (
        <p className="p-2 text-text dark:text-dark_text text-md">
          The client seed is a unique string that players can change, contributing to the creation of unpredictable
          outcomes.
        </p>
      ),
    },
    {
      title: 'Nonce',
      content: (
        <p className="p-2 text-text dark:text-dark_text text-md">
          The nonce acts as an identifier for every concluded game, starting at 0 and incrementing with each subsequent
          game, contributing to the creation of unpredictable outcomes.
        </p>
      ),
    },
    {
      title: 'Cursor',
      content: (
        <p className="p-2 text-text dark:text-dark_text text-md">
          The cursor acts as a round counter for each game, starting at 1 and incrementing with each subsequent card,
          contributing to the creation of unpredictable outcomes.
        </p>
      ),
    },
  ];

  return (
    <>
      <Header className="mb-4 self-start">Provably Fair</Header>
      {accordionItems.map((item, index) => (
        <div
          className={`w-full border border-secondary dark:border-dark_secondary`}
          key={index}>
          <button
            onClick={() => toggleAccordion(index)}
            className={`w-full text-left text-accent small-caps text-xl p-2 font-bold hover:text-text dark:hover:text-dark_text hover:bg-secondary dark:hover:bg-dark_secondary transition-all duration-300 ${
              activeAccordion === index
                ? 'border-b border-secondary dark:border-dark_secondary text-text dark:text-dark_text'
                : 'border-none'
            }`}>
            {item.title}
          </button>
          <div
            className={`grid transition-all duration-500 ${
              activeAccordion === index ? 'accordion-expanded' : 'accordion-collapsed'
            }`}>
            <div className="overflow-hidden">{item.content}</div>
          </div>
        </div>
      ))}
    </>
  );
}
