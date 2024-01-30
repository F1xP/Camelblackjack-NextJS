'use client';
import { CardType } from '@/types/types';
import { GameState } from '@prisma/client';
import React, { useEffect, useState } from 'react';

type GameDisplayProps = {
  gameState: GameState | undefined;
  currentHand: number;
  isSplitted: boolean;
  status1: { state: string; text: string } | null;
  status2: { state: string; text: string } | null;
  gameId: string | undefined;
};

type HandProps = {
  cards: CardType[] | undefined;
  downCard?: boolean;
  handValues: React.ReactNode;
  status: { state: string; text: string } | null;
  isCurrent: boolean;
} & Pick<GameDisplayProps, 'gameId' | 'isSplitted'>;

type ResultProps = { uniqueKey: string | undefined } & Pick<
  HandProps,
  'handValues' | 'status' | 'isCurrent' | 'isSplitted'
>;

export const Result: React.FC<ResultProps> = ({ handValues, status, isCurrent, isSplitted, uniqueKey }) => {
  const [delayedHandValues, setDelayedHandValues] = useState<React.ReactNode | null>(<>0</>);
  const [color, setColor] = useState<string>('bg-gray');
  const [statusText, setStatusText] = useState<string | null>(null);

  useEffect(() => {
    setDelayedHandValues(<>0</>);
    setStatusText(null);
    setColor('bg-gray');
  }, [uniqueKey]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDelayedHandValues(handValues);
      if (isCurrent && !status && isSplitted) setColor('bg-accentBlue');
      else if (status?.state === 'Push') setColor('bg-accent');
      else if (status?.state === 'Lose' || status?.state === 'DBJ') setColor('bg-accentRed');
      else if (status?.state === 'Win' || status?.state === 'PBJ') setColor('bg-accentGreen');
      else setColor('bg-gray');
      setStatusText(status?.text || null);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [handValues]);

  return (
    <div
      className="flex flex-col gap-0.5 result-animation"
      key={uniqueKey}>
      <p className={`px-2 text-black font-bold font-mono rounded-sm text-center ${color}`}>{statusText}</p>
      <p className={`px-2 text-black font-bold font-mono rounded-sm text-center ${color}`}>{delayedHandValues}</p>
    </div>
  );
};
