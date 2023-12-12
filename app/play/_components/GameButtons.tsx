'use client';
import { useEffect, useState } from 'react';
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
import { insuranceAcceptAction, insuranceDeclineAction } from '../_actions/insuranceAction';
import AnimatedNumber from '@/app/hooks/animatedNumber';

type GameButtonsProps = {
  gameState: GameState | null;
  isGameActive: boolean;
  currentHand: number;
};

export const GameButtons: React.FC<GameButtonsProps> = ({ gameState, isGameActive, currentHand }) => {
  const { update, data: session } = useSession();
  const { loading, handleAction } = useAction();
  const [betAmount, setBetAmount] = useState<number>(0);

  const handleActions = async (action: string) => {
    const formData = new FormData();
    switch (action) {
      case 'BET':
        formData.append('betAmount', betAmount.toString());
        await handleAction(betAction, formData);
        update();
        break;
      default:
    }
  };

  return (
    <section className="w-full flex-1 flex flex-col">
      <div className="flex flex-col p-2">
        <div className="flex flex-row items-center">
          <p className="text-text text-xl font-mono small-caps">Bet Amount</p>
          <UserCoins />
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
          onClick={() => handleActions('BET')}>
          BET
        </Button>
      </div>
      {gameState?.dealer.cards[0].rank === 'A' &&
      isGameActive &&
      !gameState.player[0].actions.includes('INS_ACCEPTED') &&
      !gameState.player[0].actions.includes('INS_DECLINED') ? (
        <InsuranceButtons isGameActive={isGameActive} />
      ) : (
        <PlayButtons
          gameState={gameState}
          isGameActive={isGameActive}
          currentHand={currentHand}
        />
      )}
    </section>
  );
};

export const UserCoins: React.FC = () => {
  const { data: session } = useSession();
  const coins = Number(session?.user.coins);
  const [coinsValue, setCoinsValue] = useState({ start: 0, end: 0 });

  useEffect(() => {
    if (coins === coinsValue.end) return;
    setCoinsValue((current) => ({ start: current.end, end: coins }));
  }, [coins]);

  const isIncreasing = coinsValue.start < coinsValue.end;
  const isDecreasing = coinsValue.start > coinsValue.end;

  return (
    <>
      <p
        key={coins}
        className={`text-text text-md font-mono small-caps ml-auto ${
          isIncreasing ? 'coins-plus' : isDecreasing ? 'coins-minus' : ''
        }`}>
        Coins:
        <AnimatedNumber
          value={coinsValue.end}
          startValue={coinsValue.start}
          duration={500}
          generateCommas={false}
          generateDecimals={false}
        />
      </p>
    </>
  );
};

const PlayButtons: React.FC<GameButtonsProps> = ({ gameState, isGameActive, currentHand }) => {
  const { update, data: session } = useSession();
  const { loading, handleAction } = useAction();

  const didStandOrBust = (hand: number) =>
    gameState?.player[hand].actions.includes('STAND') || gameState?.player[hand].actions.includes('BUST');
  const didDouble = (hand: number) => gameState?.player[hand].actions.includes('DOUBLE');

  const handleActions = async (action: string) => {
    const formData = new FormData();
    switch (action) {
      case 'HIT':
        await handleAction(hitAction, formData);
        update();
        break;
      case 'STAND':
        await handleAction(standAction, formData);
        update();
        break;
      case 'SPLIT':
        await handleAction(splitAction, formData);
        update();
        break;
      case 'DOUBLE':
        await handleAction(doubleAction, formData);
        update();
        break;
      default:
    }
  };
  return (
    <div className="flex flex-col p-1 gap-1 mt-auto">
      <div className="flex flex-row gap-1">
        {[
          {
            name: 'HIT',
            action: 'HIT',
            disabled: loading || !isGameActive || didStandOrBust(currentHand),
          },
          {
            name: 'STAND',
            action: 'STAND',
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
            action: 'SPLIT',
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
            action: 'DOUBLE',
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
  );
};

const InsuranceButtons: React.FC<{ isGameActive: boolean }> = ({ isGameActive }) => {
  const { update } = useSession();
  const { loading, handleAction } = useAction();

  const handleActions = async (action: string) => {
    const formData = new FormData();
    switch (action) {
      case 'ACCEPT':
        await handleAction(insuranceAcceptAction, formData);
        update();
        break;
      case 'DECLINE':
        await handleAction(insuranceDeclineAction, formData);
        update();
        break;
      default:
    }
  };

  return (
    <div className="flex flex-col p-1 gap-1 mt-auto">
      <p className="text-center text-2xl font-bold text-text font-mono">Insurance?</p>
      <div className="flex flex-row gap-1">
        {[
          {
            name: 'ACCEPT',
            action: 'ACCEPT',
            disabled: loading || !isGameActive,
          },
          {
            name: 'DECLINE',
            action: 'DECLINE',
            disabled: loading || !isGameActive,
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
  );
};
