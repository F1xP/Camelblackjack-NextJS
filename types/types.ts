import { AxiosError, AxiosResponse } from 'axios';

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

export interface CustomAxiosError extends AxiosError {
  response?: AxiosResponse<unknown, any> & {
    data?: {
      error?: string;
      message?: string;
    };
  };
}
