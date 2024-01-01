import { User } from '@prisma/client';

export type GameHistoryData = Pick<Game, 'id' | 'state' | 'hashedSeed' | 'payout' | 'createdAt'>;

export type UserLeaderboardData = {
  id: string;
  name: string | null;
  image: string | null;
  coins: number;
  games: number;
  wins: number;
  loses: number;
  pushes: number;
  winRate: number;
};

export type Game = {
  id: string;
  active: boolean;
  payout: number;
  state: GameState;
  hashedSeed: string;
  seed: string;
  cursor: number;
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
  cards: CardType[];
  amount: number;
};

export type CardType = {
  rank: string;
  suit: string;
};

export type Actions = 'DEAL' | 'HIT' | 'SPLIT' | 'STAND' | 'PUSH' | 'BUST' | 'DOUBLE' | 'INS_DECLINED' | 'INS_ACCEPTED';
