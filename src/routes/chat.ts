import { Router } from 'express';
import { handleSendMessage, handleGetHistory } from '../controllers/chatController';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const sendMessageSchema = z.object({
    sender: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
    receiver: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
    content: z.string().min(1),
});

router.post('/send', validate (sendMessageSchema), handleSendMessage);

router.get('/history/:userA/:userB', handleGetHistory);

export default router;