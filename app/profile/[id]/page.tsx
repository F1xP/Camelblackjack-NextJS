import Image from 'next/image';
import { Header } from '../../_components/Header';
import React from 'react';
import { CardBackSVG } from '../../_components/CardBackSVG';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { User } from '@prisma/client';

export default async function Profile({ params }: { params: { id: string } }) {
  let user: User | null = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: params.id },
    });
  } catch (e) {
    return notFound();
  }

  if (!user) return notFound();

  const wins = user.wins ?? 0;
  const games = user.games ?? 0;
  const winRate = games !== 0 ? ((wins / games) * 100).toFixed(0) : 0;

  return (
    <div className="rounded-lg w-full border-2 border-secondary bg-primary">
      <div className="flex flex-row w-full justify-between relative h-52 mb-20">
        <div className="overflow-hidden h-52 w-full rounded-lg">
          <CardBackSVG
            fill="var(--background)"
            color="var(--secondary)"
          />
        </div>
        <Image
          className="rounded-full absolute left-1/2 transform translate-y-3/4 -translate-x-1/2 w-40 h-40"
          src={user.image || ''}
          alt={''}
          width={500}
          height={500}
        />
      </div>
      <div className="p-2 flex flex-col items-center">
        <Header className="overflow-hidden overflow-ellipsis max-w-[15ch] sm:max-w-[25ch] md:max-w-[30ch] lg:max-w-[34ch] xl:max-w-[40ch] whitespace-nowrap">
          {user.name}
        </Header>
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 mt-5">
          {[
            { text: 'Winrate', value: `${winRate}%` },
            { text: 'Coins', value: user.coins },
            { text: 'Games', value: user.games },
            { text: 'Wagered', value: user.games },
          ].map((item, index) => {
            return (
              <div
                key={index}
                className={`w-24 h-24 rounded-lg bg-secondary flex flex-col justify-center items-center shadow-md`}>
                <p className="text-center text-accent font-bold">{item.text}</p>
                <p className="text-center text-text font-bold text-sm">{item.value}</p>
              </div>
            );
          })}
        </div>
        <Header className="self-start">Biography</Header>
        <p className="text-text w-fullrounded-md p-1 w-full text-xl max-w-[360px] break-words self-start font-bold">
          {user.bio || 'Not specified.'}
        </p>
      </div>
    </div>
  );
}
