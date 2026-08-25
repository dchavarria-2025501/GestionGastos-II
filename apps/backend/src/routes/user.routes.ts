import { Router } from 'express';
import { listUsers, updateUser, deleteUser } from '../controllers/user.controller';
import { authGuard } from '../middleware/auth.middleware';
import { roleGuard } from '../middleware/role.middleware';
import { asyncHandler } from '../utils/async-handler';

const router = Router();

router.get('/', authGuard, roleGuard('admin'), asyncHandler(listUsers));
router.put('/:id', authGuard, roleGuard('admin'), asyncHandler(updateUser));
router.delete('/:id', authGuard, roleGuard('admin'), asyncHandler(deleteUser));

export default router;
