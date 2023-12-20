'use client';
import Image from 'next/image';
import { Header } from '../_components/Header';
import React from 'react';
import { useSession } from 'next-auth/react';
import { CardBackSVG } from '../_components/CardBackSVG';

export default function Profile() {
  const { data: session } = useSession();
  const wins = session?.user.wins ?? 0;
  const games = session?.user.games ?? 0;

  const winRate = games !== 0 ? ((wins / games) * 100).toFixed(0) : 0;

  return (
    <>
      <div className="flex flex-row w-full justify-between relative h-52 mb-20">
        <div className="overflow-hidden h-52 w-full rounded-lg border-2 border-secondary">
          <CardBackSVG
            fill="transparent"
            color="#2f314b"
          />
        </div>
        <Image
          className="rounded-full absolute left-1/2 transform translate-y-3/4 -translate-x-1/2 w-40 h-40"
          src={session?.user.image || ''}
          alt={''}
          width={500}
          height={500}
        />
      </div>
      <Header>{session?.user.name}</Header>

      <div className="flex flex-row justify-center items-center gap-2">
        <div className=" w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-background flex flex-col justify-center items-center shadow-md">
          <p className="text-center text-accent font-bold">Games</p>
          <p className="text-center text-text font-bold text-sm">{session?.user.games}</p>
        </div>
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-secondary to-background flex flex-col justify-center items-center text-text font-bold mt-20 shadow-md">
          <p className="text-center text-accent font-bold text-xl">Coins</p>
          <p className="text-center text-text font-bold text-sm">{session?.user.coins}</p>
        </div>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-background flex flex-col justify-center items-center text-text font-bold shadow-md">
          <p className="text-center text-accent font-bold">Winrate</p>
          <p className="text-center text-text font-bold text-sm">{winRate}%</p>
        </div>
      </div>
      <Header className="self-start">Biography</Header>
      <p className="text-text w-fullrounded-md p-1 w-full text-xl">{session?.user.bio}</p>
    </>
  );
}
