export type CategoriaMovimiento = 'ingresos' | 'gastos' | 'impuestos' | 'fondo_emergencia';

export interface Movimiento {
  id: string;
  usuarioId: string;
  categoria: CategoriaMovimiento;
  descripcion: string;
  monto: number;
  fecha: string;
}
