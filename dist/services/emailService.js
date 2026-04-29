"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationEmail = exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const transporter = nodemailer_1.default.createTransport({
    host: env_1.env.SMTP_HOST,
    port: Number(env_1.env.SMTP_PORT),
    secure: env_1.env.SMTP_PORT === '465',
    auth: { user: env_1.env.SMTP_USER, pass: env_1.env.SMTP_PASS },
});
const sendWelcomeEmail = (email, walletAddress) => transporter.sendMail({
    from: `"TrustWork" <${env_1.env.SMTP_USER}>`,
    to: email,
    subject: 'Your TrustWork wallet address',
    html: `
      <h2>Welcome to TrustWork 🎉</h2>
      <p>Your smart contract wallet has been created. Use this address to receive and send USDC on Lisk Network:</p>
      <p style="font-family:monospace;font-size:16px;background:#f5f5f5;padding:12px;border-radius:8px;">
        ${walletAddress}
      </p>
      <p>To fund your wallet, send USDC to this address on the <strong>Lisk Network</strong>.</p>
      <p>You can view your balance and transactions on 
        <a href="https://sepolia-blockscout.lisk.com/address/${walletAddress}">Lisk Blockscout</a>.
      </p>
      <p>You can export your wallet private key anytime from your TrustWork profile for full self-custody.</p>
    `,
});
exports.sendWelcomeEmail = sendWelcomeEmail;
const sendNotificationEmail = (email, subject, html) => transporter.sendMail({
    from: `"TrustWork" <${env_1.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
});
exports.sendNotificationEmail = sendNotificationEmail;
