'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { CardBackSVG } from '@/app/_components/ui/CardBackSVG';
import { suitIcons } from '@/app/_components/ui/Suits';

type CardProps = {
  index: number;
  uniqueKey: string;
  rank: string;
  suit: string;
  status: { state: string; text: string } | null;
  isCurrent: boolean;
  isSplitted: boolean;
  type: 'P' | 'D';
  isHidden?: boolean;
};

export const Card: React.FC<CardProps> = ({
  index,
  uniqueKey,
  rank,
  suit,
  status,
  isCurrent,
  isSplitted,
  type,
  isHidden = false,
}) => {
  const [border, setBorder] = useState<string>('bg-gray');

  useEffect(() => {
    setBorder('border-transparent');
  }, [uniqueKey]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isCurrent && !status && isSplitted) setBorder('border-accentBlue');
      else if (status?.state === 'Push') setBorder('border-accent');
      else if (status?.state === 'Lose' || status?.state === 'DBJ') setBorder('border-accentRed');
      else if (status?.state === 'Win' || status?.state === 'PBJ') setBorder('border-accentGreen');
      else setBorder('border-transparent');
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [isCurrent, status, isSplitted]);

  return (
    <div
      key={uniqueKey}
      className={cn(
        `flip-card w-[3.5rem] h-[5.5rem] md:w-16 md:h-24 xl:w-20 xl:h-32 bg-transparent rounded-md shadow-sm shadow-black border-2 xl:border-3 bg-white ${border}`,
        {
          'p-card-animation': type === 'P',
          'd-card-animation': type === 'D',
        }
      )}
      style={{
        animationDelay: `${index * 250}ms`,
        marginTop: `${index}rem`,
        marginLeft: index > 0 ? '-2.4rem' : '0',
        transform: 'translate(0px, 1000px)',
      }}>
      <div className={`flip-card-inner ${!isHidden && 'card-flip-animation'}`}>
        <CardFront
          suit={suit}
          rank={rank}
        />
        <CardBack />
      </div>
    </div>
  );
};

export const CardBack: React.FC = () => (
  <div className="flip-card-back h-full w-full overflow-hidden rounded-md relative bg-white">
    <div className="overflow-hidden h-full w-full rounded-md">
      <CardBackSVG
        fill="#b58500"
        color="#ffffff"
      />
    </div>
  </div>
);

const CardFront: React.FC<{ suit: string; rank: string }> = ({ suit, rank }) => {
  const { icon, suitColor } = suitIcons()[suit as keyof typeof suitIcons] || {};

  return (
    <div className="flip-card-front flex self-start">
      <div className="flex flex-col items-center ml-0.5 5 md:ml-1">
        <p
          className={`font-mono text-2xl md:text-4xl xl:text-5xl font-bold`}
          style={{ color: suitColor }}>
          {rank}
        </p>
        <div style={{ color: suitColor }}>{icon}</div>
      </div>
    </div>
  );
};
