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
  actions: Actions[];
  cards: Card[];
  amount: number;
  payout: number;
};

export type Card = {
  rank: string;
  suit: string;
};

export type Actions = 'DEAL' | 'HIT' | 'SPLIT' | 'STAND' | 'PUSH' | 'BUST' | 'DOUBLE' | 'INS_DECLINED' | 'INS_ACCEPTED';
