import express from 'express';
import { getCitizenDashboard } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('CITIZEN', 'MUNICIPAL_ADMIN', 'SUPER_ADMIN'), getCitizenDashboard);

export default router;