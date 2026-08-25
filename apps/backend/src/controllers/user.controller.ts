import { Response } from 'express';
import { toPublicUser } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';
import * as usuarioRepo from '../repositories/user.repository';

export async function listUsers(req: AuthRequest, res: Response) {
  const usuarios = await usuarioRepo.findAll();
  return res.json({ users: usuarios.map(toPublicUser) });
}

export async function updateUser(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { nombre, email, role } = req.body;

  const actualizado = await usuarioRepo.actualizarUsuario(id, { nombre, email, role });
  if (!actualizado) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  return res.json({ user: toPublicUser(actualizado) });
}

export async function deleteUser(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const eliminado = await usuarioRepo.eliminarUsuario(id);
  if (!eliminado) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  return res.status(204).send();
}
