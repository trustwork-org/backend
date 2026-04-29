import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { sendWelcomeEmail } from '../services/emailService';

/**
 * POST /api/account/register
 * Called once after Privy social login. Stores email + wallet address,
 * then sends a welcome email with the wallet address so the user knows
 * where to send funds.
 */
export const registerAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, email } = req.body as { walletAddress: string; email: string };

    const existing = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existing) return res.status(200).json(existing); // already registered, no duplicate email

    const user = await User.create({ walletAddress: walletAddress.toLowerCase(), email: email.toLowerCase() });

    // Fire-and-forget — don't block the response on email delivery
    sendWelcomeEmail(email, walletAddress).catch(console.error);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
