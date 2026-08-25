import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { ensureSchema, pool } from '../config/db';
import * as usuarioRepo from '../repositories/user.repository';

const SALT_ROUNDS = 10;

function obtenerVariableObligatoria(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(
      `Falta la variable de entorno "${nombre}" para crear el usuario admin inicial. Revisa tu archivo .env.`
    );
  }
  return valor;
}

async function ejecutarSeed() {
  const adminNombre = obtenerVariableObligatoria('ADMIN_NOMBRE');
  const adminEmail = obtenerVariableObligatoria('ADMIN_EMAIL');
  const adminPassword = obtenerVariableObligatoria('ADMIN_PASSWORD');

  await ensureSchema();

  const adminExiste = await usuarioRepo.findByEmail(adminEmail);

  if (!adminExiste) {
    const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
    await usuarioRepo.crearUsuario({
      nombre: adminNombre,
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });
    console.log(`Usuario admin creado: ${adminEmail}`);
  } else {
    console.log('El usuario admin ya existe.');
  }

  await pool.end();
}

ejecutarSeed().catch((err) => {
  console.error('Error al ejecutar el seed:', err);
  process.exit(1);
});
