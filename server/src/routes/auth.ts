import { Router } from 'express';
import { register, login, uploadResume, updateProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Resume upload — requires auth + multer PDF middleware
router.post('/resume', authenticateToken, upload.single('resume'), uploadResume);

// Profile update
router.put('/profile', authenticateToken, updateProfile);

export default router;
