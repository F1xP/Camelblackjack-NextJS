import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      coins: number;
      games: number;
      wins: number;
      loses: number;
      pushes: number;
    } & DefaultSession['user'];
  }
}
import NextAuth, { DefaultSession } from 'next-auth';
