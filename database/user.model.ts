import { Schema, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  image: string;
  coins: number;
  games: number;
  wins: number;
  loses: number;
  pushes: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    coins: { type: Number, default: 500 },
    games: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    loses: { type: Number, default: 0 },
    pushes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model('User', userSchema);
