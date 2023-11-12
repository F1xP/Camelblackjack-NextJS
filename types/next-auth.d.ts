import NextAuth, { DefaultSession } from 'next-auth';

import type { User } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: User & {
      bio: string;
      coins: number;
      games: number;
      wins: number;
      loses: number;
      pushes: number;
    };
  }
}
