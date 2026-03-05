import express from 'express';
import { getJobs, getJobById } from '../controllers/jobController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes (or you can make them protected)
router.get('/', getJobs);
router.get('/:id', getJobById);

export default router;
