import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Role } from '../models/user.model';

export function roleGuard(...allowedRoles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos para esta accion' });
    }
    next();
  };
}
