import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { AuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';

export const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_ID as string) ?? '',
      clientSecret: (process.env.GOOGLE_SECRET as string) ?? '',
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      const dbUser: any = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (!dbUser) return session;
      session.user = {
        ...session.user,
        coins: dbUser.coins,
        games: dbUser.games,
        wins: dbUser.wins,
        loses: dbUser.loses,
        pushes: dbUser.pushes,
      };
      console.log(session);
      return session;
    },
  },
};
