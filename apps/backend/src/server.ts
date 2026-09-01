import 'dotenv/config';
import app from './app';
import { ensureDatabase, ensureSchema, verificarConexion } from './config/db';

const PORT = process.env.PORT || 3001;

async function iniciarServidor() {
  try {
    await ensureDatabase();
    await verificarConexion();
    await ensureSchema();
    console.log('Conexion a PostgreSQL (gestor_gastos_db) establecida correctamente.');

    app.listen(PORT, () => {
      console.log(`API de GestionGastos escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('No se pudo iniciar el servidor: fallo la conexion a la base de datos.');
    console.error(err);
    process.exit(1);
  }
}

iniciarServidor();
