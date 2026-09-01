import { Router } from 'express';
import { listMovimientos, createMovimiento, deleteMovimiento } from '../controllers/movimiento.controller';
import { authGuard } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const router = Router();

router.get('/', authGuard, asyncHandler(listMovimientos));
router.post('/', authGuard, asyncHandler(createMovimiento));
router.delete('/:id', authGuard, asyncHandler(deleteMovimiento));

export default router;
