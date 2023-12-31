import Image from 'next/image';
import { Header } from '../../_components/ui/Header';
import React from 'react';
import { CardBackSVG } from '../../_components/ui/CardBackSVG';
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
    <div className="rounded-lg w-full border-2 border-secondary dark:border-dark_secondary bg-primary dark:bg-dark_primary overflow-hidden">
      <div className="flex flex-row w-full justify-between relative h-52 mb-20">
        <div className="overflow-hidden h-52 w-full">
          <CardBackSVG
            fill="#b58500"
            color="#ffffff"
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
        <div className="flex flex-row flex-wrap justify-center items-center gap-2 mt-5 w-full">
          {[
            { text: 'Winrate', value: `${winRate}%` },
            { text: 'Coins', value: user.coins },
            { text: 'Games Played', value: user.games },
            { text: 'Total Wagered', value: user.wager },
          ].map((item, index) => {
            return (
              <div
                key={index}
                className={`px-2 py-4 bg-background dark:bg-dark_secondary flex-1 min-w-[200px] rounded-lg flex flex-col justify-center items-center shadow-md overflow-hidden overflow-ellipsis`}>
                <p className="text-center text-accent font-bold">{item.value}</p>
                <p className="text-center text-text dark:text-dark_text font-bold text-sm">{item.text}</p>
              </div>
            );
          })}
        </div>
        <span className="bg-secondary dark:bg-dark_secondary w-full h-0.5 mt-4 mb-2"></span>
        <p className="px-2 py-4 w-full flex justify-center items-center text-text dark:text-dark_text text-lg max-w-[500px] text-center break-words font-bold">
          {user.bio || 'Not specified.'}
        </p>
      </div>
    </div>
  );
}
