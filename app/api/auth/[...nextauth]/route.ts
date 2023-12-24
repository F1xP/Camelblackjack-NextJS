import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { AuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import GoogleProvider from 'next-auth/providers/google';
import type { User } from 'next-auth';
import { prisma } from '@/lib/prisma';

declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string;
      bio: string;
      coins: number;
      games: number;
      wins: number;
      loses: number;
      pushes: number;
    };
  }
}

export const nextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: (process.env.GOOGLE_ID as string) ?? '',
      clientSecret: (process.env.GOOGLE_SECRET as string) ?? '',
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!dbUser) return session;
        session.user = {
          ...session.user,
          id: dbUser.id,
          bio: dbUser.bio,
          coins: dbUser.coins,
          games: dbUser.games,
          wins: dbUser.wins,
          loses: dbUser.loses,
          pushes: dbUser.pushes,
        };
      } catch (e) {
        console.log(e);
        return session;
      }
      return session;
    },
  },
} satisfies AuthOptions;

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
