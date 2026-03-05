import express from 'express';
import { getApplications, createApplication, updateApplicationStatus } from '../controllers/applicationController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// All application routes should be protected
router.use(authenticateToken);

router.get('/', getApplications);
router.post('/', createApplication);
router.patch('/:id/status', updateApplicationStatus);

export default router;
