import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import movimientoRoutes from './routes/movimiento.routes';

const app = express();

app.use(cors());
// Limite mas alto que el default (100kb) para poder recibir fotos de
// perfil codificadas en base64 desde /api/auth/avatar.
app.use(express.json({ limit: '4mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/movimientos', movimientoRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Ruta no encontrada
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejador global de errores: cualquier error no controlado (por ejemplo,
// un fallo de conexion a PostgreSQL) termina aqui en vez de colgar la
// peticion o tumbar el servidor, y siempre responde JSON.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

export default app;
