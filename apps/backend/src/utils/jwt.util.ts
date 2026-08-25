import jwt, { SignOptions } from 'jsonwebtoken';
import { Role } from '../models/user.model';

export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

function obtenerSecretoJwt(): string {
  const secreto = process.env.JWT_SECRET;
  if (!secreto) {
    throw new Error(
      'Falta la variable de entorno "JWT_SECRET". Defina una clave segura en su archivo .env antes de iniciar el servidor.'
    );
  }
  return secreto;
}

const JWT_SECRET = obtenerSecretoJwt();
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
