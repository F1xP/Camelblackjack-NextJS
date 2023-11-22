'use client';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { hitAction, betAction, splitAction, doubleAction, standAction } from './actions';
import useAction from '@/app/hooks/useAction';
import { GameState } from '@/types/types';

export const GameButtons: React.FC<{ gameState: GameState; isGameActive: boolean }> = ({ gameState, isGameActive }) => {
  const { loading, handleAction } = useAction();
  const [betAmount, setBetAmount] = useState<number>(0);

  const didStandOrBust = (hand: number) =>
    gameState.player[hand].actions.includes('stand') || gameState.player[hand].actions.includes('bust');
  const didDouble = (hand: number) => gameState.player[hand].actions.includes('double');

  const handleActions = async (action: string) => {
    const formData = new FormData();
    switch (action) {
      case 'bet':
        formData.append('betAmount', betAmount.toString());
        await handleAction(betAction, formData);
        break;
      case 'hit':
        await handleAction(hitAction, formData);
        break;
      case 'stand':
        await handleAction(standAction, formData);
        break;
      case 'split':
        await handleAction(splitAction, formData);
        break;
      case 'double':
        await handleAction(doubleAction, formData);
        break;
      default:
    }
  };

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
          disabled={loading || isGameActive}
          onClick={() => handleActions('bet')}>
          BET
        </Button>
      </div>
      <div className="flex flex-col p-1 gap-1 mt-auto">
        <div className="flex flex-row gap-1">
          {[
            {
              name: 'HIT',
              action: 'hit',
              disabled: loading || !isGameActive || didStandOrBust(0),
            },
            {
              name: 'STAND',
              action: 'stand',
              disabled: loading || !isGameActive || didStandOrBust(0),
            },
          ].map((item, index) => (
            <Button
              key={index}
              variant="outlined"
              size="md"
              disabled={item.disabled}
              onClick={() => handleActions(item.action)}
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
                loading ||
                !isGameActive ||
                didStandOrBust(0) ||
                gameState.player.length !== 1 ||
                gameState.player[0].cards.length !== 2 ||
                gameState.player[0].cards[0].rank !== gameState.player[0].cards[1].rank,
            },
            {
              name: 'DOUBLE',
              action: 'double',
              disabled: loading || !isGameActive || didStandOrBust(0) || didDouble(0),
            },
          ].map((item, index) => (
            <Button
              key={index}
              variant="outlined"
              size="md"
              disabled={item.disabled}
              onClick={() => handleActions(item.action)}
              className="flex-1">
              {item.name}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
