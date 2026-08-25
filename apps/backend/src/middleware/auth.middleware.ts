import { Request, Response, NextFunction } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';
import { verifyToken, JwtPayload } from '../utils/jwt.util';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authGuard(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado', code: 'TOKEN_MISSING' });
  }

  const token = header.split(' ')[1];

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ message: 'Token invalido', code: 'TOKEN_INVALID' });
  }
}
