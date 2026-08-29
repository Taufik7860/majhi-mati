import express from 'express';
import { getAdminDashboardStats, updateIssueStatus } from '../controllers/municipalController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard-stats', protect, authorize('MUNICIPAL_ADMIN', 'SUPER_ADMIN'), getAdminDashboardStats);
router.patch('/issues/:id/status', protect, authorize('MUNICIPAL_ADMIN', 'SUPER_ADMIN'), updateIssueStatus);

export default router;