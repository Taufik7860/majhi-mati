import express from 'express';
import { createIssue, getMyIssues, getIssueById } from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.array('images', 5), createIssue);
router.get('/my-issues', getMyIssues);
router.get('/:id', getIssueById);

export default router;