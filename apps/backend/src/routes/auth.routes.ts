import { Router } from 'express';
import { register, login, profile } from '../controllers/auth.controller';
import { authGuard } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/profile', authGuard, asyncHandler(profile));

export default router;
