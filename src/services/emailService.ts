import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: env.SMTP_PORT === '465',
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

export const sendWelcomeEmail = (email: string, walletAddress: string) =>
  transporter.sendMail({
    from: `"TrustWork" <${env.SMTP_USER}>`,
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

export const sendNotificationEmail = (email: string, subject: string, html: string) =>
  transporter.sendMail({
    from: `"TrustWork" <${env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  });
