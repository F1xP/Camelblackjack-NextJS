import { cn } from '@/lib/utils';
import { CardType } from '@/types/types';
import { GameState } from '@prisma/client';
import React from 'react';

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

type ResultProps = {
  type: 'P' | 'D';
} & Pick<HandProps, 'handValues' | 'status' | 'isCurrent' | 'isSplitted'>;

export const Result: React.FC<ResultProps> = ({ handValues, status, isCurrent, isSplitted, type }) => {
  return (
    <div className="flex flex-col gap-0.5">
      <p
        className={cn('px-2 text-black font-bold font-mono rounded-sm text-center', {
          'bg-accentBlue': isCurrent && !status && isSplitted,
          'bg-accent': status?.state === 'Push',
          'bg-accentRed': status?.state === 'Lose' || status?.state === 'DBJ',
          'bg-accentGreen': status?.state === 'Win' || status?.state === 'PBJ',
          'bg-gray': !status,
        })}>
        {status?.text}
      </p>
      <p
        className={cn('px-2 text-black font-bold font-mono rounded-sm text-center', {
          'bg-accentBlue': isCurrent && !status && isSplitted,
          'bg-accent': status?.state === 'Push',
          'bg-accentRed': status?.state === 'Lose' || status?.state === 'DBJ',
          'bg-accentGreen': status?.state === 'Win' || status?.state === 'PBJ',
          'bg-gray': !status,
        })}>
        {handValues}
      </p>
    </div>
  );
};
