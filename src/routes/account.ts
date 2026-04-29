import { Router } from 'express';
import { registerAccount } from '../controllers/accountController';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const registerSchema = z.object({
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  email: z.string().email(),
});

const router = Router();

router.post('/register', validate(registerSchema), registerAccount);

export default router;
