'use client';
import { useEffect, useState } from 'react';
import { Button } from '../../_components/ui/Button';
import { Input } from '../../_components/ui/Input';
import useAction from '@/app/hooks/useAction';
import { useSession } from 'next-auth/react';
import { betAction } from '../_actions/betAction';
import { hitAction } from '../_actions/hitAction';
import { standAction } from '../_actions/standAction';
import { splitAction } from '../_actions/splitAction';
import { doubleAction } from '../_actions/doubleAction';
import { insuranceAcceptAction, insuranceDeclineAction } from '../_actions/insuranceAction';
import AnimatedNumber from '@/app/hooks/animatedNumber';

type GameButtonsProps = {
  isDisabled: {
    bet: boolean;
    split: boolean;
    stand: boolean;
    double: boolean;
    hit: boolean;
    insurance: boolean;
  };
};

export const GameButtons: React.FC<GameButtonsProps> = ({ isDisabled }) => {
  const { update } = useSession();
  const { loading, handleAction } = useAction();
  const [betAmount, setBetAmount] = useState<any>(0);

  const handleActions = async (action: string) => {
    const formData = new FormData();
    switch (action) {
      case 'BET':
        formData.append('betAmount', betAmount.toString());
        await handleAction(betAction, formData, false);
        update();
        break;
      default:
    }
  };

  return (
    <section className="w-full h-auto flex-1 flex flex-col px-2 py-1 gap-1 bg-primary/30 dark:bg-dark_primary/30">
      <UserCoins />
      <Input
        type="number"
        inputMode="numeric"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        variant={'transparent'}
      />
      <Button
        variant={'outlined'}
        size={'xl'}
        disabled={isDisabled.bet || loading}
        onClick={() => handleActions('BET')}
        className="mt-2">
        BET
      </Button>
      {!isDisabled.insurance ? <InsuranceButtons isDisabled={isDisabled} /> : <PlayButtons isDisabled={isDisabled} />}
    </section>
  );
};

const UserCoins: React.FC = () => {
  const { data: session } = useSession();
  const coins = Number(session?.user.coins);
  const [coinsValue, setCoinsValue] = useState({ start: 0, end: 0 });

  useEffect(() => {
    if (coins === coinsValue.end) return;
    const timeoutId = setTimeout(() => {
      setCoinsValue((current) => ({ start: current.end, end: coins }));
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [coins]);

  const isIncreasing = coinsValue.start < coinsValue.end;
  const isDecreasing = coinsValue.start > coinsValue.end;

  return (
    <div className="flex flex-row items-center">
      <p className="text-accent text-lg font-mono font-bold">Bet Amount</p>
      <p
        key={coinsValue.end}
        className={`text-text dark:text-dark_text text-md font-mono ml-auto font-bold ${
          isIncreasing ? 'animate-coins-plus' : isDecreasing ? 'animate-coins-minus' : ''
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
    </div>
  );
};

const PlayButtons: React.FC<GameButtonsProps> = ({ isDisabled }) => {
  const { update, data: session } = useSession();
  const { loading, handleAction } = useAction();

  const handleActions = async (action: string) => {
    const formData = new FormData();
    switch (action) {
      case 'HIT':
        await handleAction(hitAction, formData, false);
        update();
        break;
      case 'STAND':
        await handleAction(standAction, formData, false);
        update();
        break;
      case 'SPLIT':
        await handleAction(splitAction, formData, false);
        update();
        break;
      case 'DOUBLE':
        await handleAction(doubleAction, formData, false);
        update();
        break;
      default:
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-row gap-1">
        {[
          {
            name: 'HIT',
            action: 'HIT',
            disabled: isDisabled.hit || loading,
          },
          {
            name: 'STAND',
            action: 'STAND',
            disabled: isDisabled.stand || loading,
          },
        ].map((item) => (
          <Button
            key={item.name}
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
            disabled: isDisabled.split || loading,
          },
          {
            name: 'DOUBLE',
            action: 'DOUBLE',
            disabled: isDisabled.double || loading,
          },
        ].map((item) => (
          <Button
            key={item.name}
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

const InsuranceButtons: React.FC<GameButtonsProps> = ({ isDisabled }) => {
  const { update } = useSession();
  const { loading, handleAction } = useAction();

  const handleActions = async (action: string) => {
    const formData = new FormData();
    switch (action) {
      case 'ACCEPT':
        await handleAction(insuranceAcceptAction, formData, false);
        update();
        break;
      case 'DECLINE':
        await handleAction(insuranceDeclineAction, formData, false);
        update();
        break;
      default:
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <p className="text-center text-2xl font-bold text-text dark:text-dark_text font-mono">Insurance?</p>
      <div className="flex flex-row gap-1">
        {[
          {
            name: 'ACCEPT',
            action: 'ACCEPT',
            disabled: isDisabled.insurance || loading,
          },
          {
            name: 'DECLINE',
            action: 'DECLINE',
            disabled: isDisabled.insurance || loading,
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
