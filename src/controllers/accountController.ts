import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { sendWelcomeEmail } from '../services/emailService';

/**
 * POST /api/account/register
 *
 * Called by AuthContext after a Privy login completes. The same user (same
 * email) may sign in from different wallets over time — embedded wallet,
 * external wallet, a different device — so we key the record by email and
 * update the walletAddress whenever it changes. Wallet address by itself
 * is not enough, because the email field has a unique index.
 *
 * Welcome email is sent only on first registration.
 */
export const registerAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { walletAddress, email } = req.body as { walletAddress: string; email: string };
    const lowerWallet = walletAddress.toLowerCase();
    const lowerEmail = email.toLowerCase();

    const existing = await User.findOne({ email: lowerEmail });

    if (existing) {
      // Same user, possibly from a different wallet — keep the record up to date.
      if (existing.walletAddress !== lowerWallet) {
        existing.walletAddress = lowerWallet;
        await existing.save();
      }
      return res.status(200).json(existing);
    }

    const user = await User.create({ walletAddress: lowerWallet, email: lowerEmail });

    // Fire-and-forget — don't block the response on email delivery
    sendWelcomeEmail(email, walletAddress).catch(console.error);

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};
