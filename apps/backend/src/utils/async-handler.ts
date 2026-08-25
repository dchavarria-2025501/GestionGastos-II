import { NextFunction, Request, Response } from 'express';

type ControladorAsync = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Envuelve un controlador async para que cualquier error (por ejemplo, un
 * fallo de conexion a la base de datos) llegue al middleware de errores en
 * vez de colgar la peticion o tumbar el servidor.
 */
export function asyncHandler(fn: ControladorAsync) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}
