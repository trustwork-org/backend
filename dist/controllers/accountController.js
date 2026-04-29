"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAccount = void 0;
const User_1 = require("../models/User");
const emailService_1 = require("../services/emailService");
/**
 * POST /api/account/register
 * Called once after Privy social login. Stores email + wallet address,
 * then sends a welcome email with the wallet address so the user knows
 * where to send funds.
 */
const registerAccount = async (req, res, next) => {
    try {
        const { walletAddress, email } = req.body;
        const existing = await User_1.User.findOne({ walletAddress: walletAddress.toLowerCase() });
        if (existing)
            return res.status(200).json(existing); // already registered, no duplicate email
        const user = await User_1.User.create({ walletAddress: walletAddress.toLowerCase(), email: email.toLowerCase() });
        // Fire-and-forget — don't block the response on email delivery
        (0, emailService_1.sendWelcomeEmail)(email, walletAddress).catch(console.error);
        res.status(201).json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.registerAccount = registerAccount;
