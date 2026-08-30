import express from 'express';
import { createSupportTicket, getSupportTickets } from '../controllers/supportController.js';

const router = express.Router();

router.post('/token', createSupportTicket);
router.get('/tokens', getSupportTickets);

export default router;
