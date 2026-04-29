import { z } from 'zod';

const schema = z.object({
  PORT: z.string().default('3001'),
  MONGODB_URI: z.string().min(1),
  PRIVY_APP_ID: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.string().default('587'),
  SMTP_USER: z.string().email(),
  SMTP_PASS: z.string().min(1),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
