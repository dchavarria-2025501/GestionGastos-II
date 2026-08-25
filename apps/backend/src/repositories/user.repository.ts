import { pool } from '../config/db';
import { User, Role } from '../models/user.model';

interface UsuarioRow {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string;
}

function mapRowToUser(row: UsuarioRow): User {
  return {
    id: row.id,
    nombre: row.nombre,
    email: row.email,
    passwordHash: row.password_hash,
    role: row.role,
    createdAt: row.created_at,
  };
}

export async function findByEmail(email: string): Promise<User | undefined> {
  const { rows } = await pool.query<UsuarioRow>(
    'SELECT id, nombre, email, password_hash, role, created_at FROM usuarios WHERE email = $1',
    [email]
  );
  return rows[0] ? mapRowToUser(rows[0]) : undefined;
}

export async function findById(id: string): Promise<User | undefined> {
  const { rows } = await pool.query<UsuarioRow>(
    'SELECT id, nombre, email, password_hash, role, created_at FROM usuarios WHERE id = $1',
    [id]
  );
  return rows[0] ? mapRowToUser(rows[0]) : undefined;
}

export async function findAll(): Promise<User[]> {
  const { rows } = await pool.query<UsuarioRow>(
    'SELECT id, nombre, email, password_hash, role, created_at FROM usuarios ORDER BY created_at DESC'
  );
  return rows.map(mapRowToUser);
}

interface CrearUsuarioInput {
  nombre: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export async function crearUsuario(datos: CrearUsuarioInput): Promise<User> {
  const { rows } = await pool.query<UsuarioRow>(
    `INSERT INTO usuarios (nombre, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nombre, email, password_hash, role, created_at`,
    [datos.nombre, datos.email, datos.passwordHash, datos.role]
  );
  return mapRowToUser(rows[0]);
}

interface ActualizarUsuarioInput {
  nombre?: string;
  email?: string;
  role?: Role;
}

export async function actualizarUsuario(
  id: string,
  cambios: ActualizarUsuarioInput
): Promise<User | undefined> {
  const actual = await findById(id);
  if (!actual) {
    return undefined;
  }

  const { rows } = await pool.query<UsuarioRow>(
    `UPDATE usuarios
     SET nombre = $1, email = $2, role = $3
     WHERE id = $4
     RETURNING id, nombre, email, password_hash, role, created_at`,
    [
      cambios.nombre ?? actual.nombre,
      cambios.email ?? actual.email,
      cambios.role ?? actual.role,
      id,
    ]
  );
  return rows[0] ? mapRowToUser(rows[0]) : undefined;
}

export async function eliminarUsuario(id: string): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
