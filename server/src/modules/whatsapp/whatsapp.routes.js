import { Router } from 'express';
import { webhookHandler } from './whatsapp.controller.js';

const router = Router();

router.post('/webhook', webhookHandler);

export default router;
