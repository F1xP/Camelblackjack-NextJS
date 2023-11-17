'use client';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { GameState } from '@prisma/client';

export const GameButtons: React.FC<{ gameState: GameState | undefined; isGameActive: boolean }> = ({
  gameState,
  isGameActive,
}) => {
  const [betAmount, setBetAmount] = useState<number>(0);

  const didStandOrBust = (hand: number) =>
    gameState?.player[hand].actions.includes('stand') || gameState?.player[hand].actions.includes('bust');
  const didDouble = (hand: number) => gameState?.player[hand].actions.includes('double');

  function handleNewBet(): void {
    throw new Error('Function not implemented.');
  }

  function handleAction(action: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <section className="h-[600px] w-full flex-1 flex flex-col">
      <div className="flex flex-col p-2">
        <p className="text-text text-xl font-mono small-caps">Bet Amount</p>
        <Input
          type="number"
          inputMode="numeric"
          value={betAmount}
          onChange={(e) => setBetAmount(Number(e.target.value))}
          variant={'transparent'}
          className="mb-2"
        />
        <Button
          variant={'outlined'}
          size={'xl'}
          disabled={isGameActive}
          onClick={() => handleNewBet()}>
          BET
        </Button>
      </div>
      <div className="flex flex-col p-1 gap-1 mt-auto">
        <div className="flex flex-row gap-1">
          {[
            {
              name: 'HIT',
              action: 'hit',
              disabled: didStandOrBust(0),
            },
            {
              name: 'STAND',
              action: 'stand',
              disabled: didStandOrBust(0),
            },
          ].map((item, index) => (
            <Button
              key={index}
              variant="outlined"
              size="md"
              disabled={item.disabled}
              onClick={() => handleAction(item.action)}
              className="flex-1">
              {item.name}
            </Button>
          ))}
        </div>
        <div className="flex flex-row gap-1">
          {[
            {
              name: 'SPLIT',
              action: 'split',
              disabled:
                didStandOrBust(0) ||
                gameState?.player.length !== 1 ||
                gameState?.player[0].cards.length !== 2 ||
                gameState?.player[0].cards[0].rank !== gameState?.player[0].cards[1].rank,
            },
            {
              name: 'DOUBLE',
              action: 'double',
              disabled: didStandOrBust(0) || didDouble(0),
            },
          ].map((item, index) => (
            <Button
              key={index}
              variant="outlined"
              size="md"
              disabled={item.disabled}
              onClick={() => handleAction(item.action)}
              className="flex-1">
              {item.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
