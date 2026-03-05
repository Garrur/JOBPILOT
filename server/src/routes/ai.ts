import express from 'express';
import { parseResume, generateCoverLetter, matchScore } from '../controllers/aiController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = express.Router();

router.use(authenticateToken);

// Expects pdf upload mapped to 'resume'
router.post('/parse-resume', upload.single('resume'), parseResume);
router.post('/cover-letter', generateCoverLetter);
router.post('/match-score', matchScore);

export default router;
