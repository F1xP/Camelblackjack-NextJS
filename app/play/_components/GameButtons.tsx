'use client';
import { useState } from 'react';
import { Button } from '../../_components/Button';
import { Input } from '../../_components/Input';
import useAction from '@/app/hooks/useAction';
import { GameState } from '@/types/types';
import { useSession } from 'next-auth/react';
import { betAction } from '../_actions/betAction';
import { hitAction } from '../_actions/hitAction';
import { standAction } from '../_actions/standAction';
import { splitAction } from '../_actions/splitAction';
import { doubleAction } from '../_actions/doubleAction';

type GameButtonsProps = {
  gameState: GameState | null;
  isGameActive: boolean;
  currentHand: number;
};

export const GameButtons: React.FC<GameButtonsProps> = ({ gameState, isGameActive, currentHand }) => {
  const { update, data: session } = useSession();
  const { loading, handleAction } = useAction();
  const [betAmount, setBetAmount] = useState<number>(0);

  const didStandOrBust = (hand: number) =>
    gameState?.player[hand].actions.includes('stand') || gameState?.player[hand].actions.includes('bust');
  const didDouble = (hand: number) => gameState?.player[hand].actions.includes('double');

  const handleActions = async (action: string) => {
    const formData = new FormData();
    switch (action) {
      case 'bet':
        formData.append('betAmount', betAmount.toString());
        await handleAction(betAction, formData);
        update();
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
        <div className="flex flex-row items-center">
          <p className="text-text text-xl font-mono small-caps">Bet Amount</p>
          <p className="text-text text-md font-mono small-caps ml-auto">Coins:{session?.user.coins}</p>
        </div>
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
              disabled: loading || !isGameActive || didStandOrBust(currentHand),
            },
            {
              name: 'STAND',
              action: 'stand',
              disabled: loading || !isGameActive || didStandOrBust(currentHand),
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
                didStandOrBust(currentHand) ||
                gameState?.player.length !== 1 ||
                gameState?.player[currentHand].cards.length !== 2 ||
                gameState?.player[currentHand].cards[0].rank !== gameState?.player[currentHand].cards[1].rank,
            },
            {
              name: 'DOUBLE',
              action: 'double',
              disabled: loading || !isGameActive || didStandOrBust(currentHand) || didDouble(currentHand),
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
