import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { Game } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export const getSession = () => getServerSession(nextAuthOptions);

export const getCurrentUser = async () => {
  const session = await getSession();
  return session?.user;
};

export const getCurrentServerGame = async (userEmail: string) => {
  const game: Pick<Game, 'id' | 'state' | 'seed' | 'cursor' | 'active' | 'user_email'> | null =
    await prisma.game.findFirst({
      where: { active: true, user_email: userEmail },
      select: {
        id: true,
        state: true,
        seed: true,
        cursor: true,
        active: true,
        user_email: true,
      },
    });
  if (!game) throw new Error('No active game found.');
  return game;
};
