import { Schema, model } from 'mongoose';

export interface IGame {
  id: string;
  active: boolean;
  payoutMultiplier: number;
  amountMultiplier: number;
  amount: number;
  payout: number;
  state: {
    player: { value: number[]; actions: any[]; cards: any[] }[];
    dealer: { value: number[]; actions: any[]; cards: any[] };
  };
  user: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const gameSchema: Schema = new Schema(
  {
    id: String,
    active: Boolean,
    payoutMultiplier: Number,
    amountMultiplier: Number,
    amount: Number,
    payout: Number,
    state: {
      player: [{ value: [Number], actions: [Schema.Types.Mixed], cards: [Schema.Types.Mixed] }],
      dealer: { value: [Number], actions: [Schema.Types.Mixed], cards: [Schema.Types.Mixed] },
    },
    user: {
      id: String,
      name: String,
    },
  },
  { timestamps: true }
);

export default model<IGame>('Game', gameSchema);
