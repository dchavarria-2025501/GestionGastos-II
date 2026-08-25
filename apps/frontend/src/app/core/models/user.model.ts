export type Role = 'admin' | 'user';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}
