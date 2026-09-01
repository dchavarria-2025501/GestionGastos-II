export type Role = 'admin' | 'user';

export interface User {
  id: string;
  nombre: string;
  email: string;
  passwordHash: string;
  role: Role;
  avatarData: string | null;
  createdAt: string;
}

// Vista publica del usuario (sin password)
export type PublicUser = Omit<User, 'passwordHash'>;

export function toPublicUser(u: User): PublicUser {
  const { passwordHash, ...rest } = u;
  return rest;
}
