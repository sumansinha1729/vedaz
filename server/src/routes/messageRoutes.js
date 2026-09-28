import { Router } from 'express';
import { listMessages, sendMessage } from '../controllers/messageController.js';
import { requireAuth } from '../middleware/auth.js';
import { messageLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(requireAuth);

router.get('/', listMessages);
router.post('/', messageLimiter, sendMessage);

export default router;
