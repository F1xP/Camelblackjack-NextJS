import { User } from '@prisma/client';

export type LeaderboardDataProps = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  bio: string;
  coins: number;
  games: number;
  wins: number;
  loses: number;
  pushes: number;
  createdAt: Date;
  updatedAt: Date;
}[];

export type Game = {
  id: string;
  active: boolean;
  payoutMultiplier: number;
  amountMultiplier: number;
  amount: number;
  payout: number;
  state: GameState;
  user_email?: string | null;
  user?: User | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GameState = {
  player: UserState[];
  dealer: UserState;
};

export type UserState = {
  value: number[];
  actions: string[];
  cards: Card[];
};

export type Card = {
  rank: string;
  suit: string;
};
