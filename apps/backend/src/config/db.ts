import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

function obtenerVariableObligatoria(nombre: string): string {
  const valor = process.env[nombre];
  if (!valor) {
    throw new Error(
      `Falta la variable de entorno "${nombre}". Revisa tu archivo .env (usa .env.example como base).`
    );
  }
  return valor;
}

const DB_HOST = obtenerVariableObligatoria('DB_HOST');
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_NAME = obtenerVariableObligatoria('DB_NAME');
const DB_USER = obtenerVariableObligatoria('DB_USER');
const DB_PASSWORD = obtenerVariableObligatoria('DB_PASSWORD');

export const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD,
});

// Sin este listener, un error a nivel de conexion (por ejemplo, que
// PostgreSQL se reinicie o se corte la red) tumba TODO el proceso de Node,
// porque pg emite un evento "error" en el pool que de otra forma queda sin
// manejar. Con el listener, el error solo se registra y el pool sigue
// funcionando (reconectando en la siguiente consulta).
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
});

/**
 * Crea la base de datos (DB_NAME, por defecto "gestor_gastos_db") si
 * todavia no existe, para no depender de crearla a mano desde pgAdmin4
 * en cada computadora. Se conecta primero a la base "postgres", que
 * siempre existe en cualquier instalacion de PostgreSQL, para poder
 * revisar y crear la base de datos de la aplicacion.
 */
export async function ensureDatabase(): Promise<void> {
  const poolAdministrativo = new Pool({
    host: DB_HOST,
    port: DB_PORT,
    database: 'postgres',
    user: DB_USER,
    password: DB_PASSWORD,
  });

  try {
    const { rows } = await poolAdministrativo.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [DB_NAME]
    );

    if (rows.length === 0) {
      // CREATE DATABASE no admite parametros ($1), asi que se valida el
      // nombre contra un patron seguro antes de interpolarlo en el SQL.
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(DB_NAME)) {
        throw new Error(
          `El nombre de base de datos "${DB_NAME}" tiene caracteres no permitidos.`
        );
      }
      await poolAdministrativo.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Base de datos "${DB_NAME}" no existia: se creo automaticamente.`);
    }
  } finally {
    await poolAdministrativo.end();
  }
}

/**
 * Crea el esquema (tablas usuarios y movimientos) si todavia no existe
 * dentro de DB_NAME, y agrega columnas nuevas a tablas ya existentes
 * (por ejemplo, si el usuario ya tenia la tabla "usuarios" creada de una
 * version anterior sin la columna de foto de perfil).
 */
export async function ensureSchema(): Promise<void> {
  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  await pool.query(schemaSql);

  // Migracion aditiva: por si la tabla "usuarios" ya existia de una
  // version anterior sin esta columna.
  await pool.query('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS avatar_data TEXT');
}

export async function verificarConexion(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}
