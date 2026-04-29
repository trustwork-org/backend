import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;  // Privy smart wallet address (ERC-4337)
  email: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    walletAddress: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
