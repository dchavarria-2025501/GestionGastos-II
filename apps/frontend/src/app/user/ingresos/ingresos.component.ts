import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DashboardSidebarComponent } from '../../shared/dashboard-sidebar/dashboard-sidebar.component';

interface Ingreso {
  id?: string;
  descripcion: string;
  monto: number;
  fecha: string;
}

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DashboardSidebarComponent
  ],
  templateUrl: './ingresos.component.html',
  styleUrls: ['../../../styles.css']
})
export class IngresosComponent implements OnInit {
  mostrarModal = false;

  ingresosList: Ingreso[] = [
    { descripcion: 'Sueldo Mensual', fecha: '02 sept 2026', monto: 8500.00 },
    { descripcion: 'Proyecto Freelance Web', fecha: '01 sept 2026', monto: 2200.50 },
    { descripcion: 'Venta de artículo usado', fecha: '28 ago 2026', monto: 450.00 }
  ];

  nuevaDescripcion: string = '';
  nuevoMonto: number | null = null;

  ngOnInit(): void {}

  get totalIngresos(): number {
    return this.ingresosList.reduce((acc, curr) => acc + curr.monto, 0);
  }

  agregarIngreso(): void {
    if (!this.nuevaDescripcion || !this.nuevoMonto || this.nuevoMonto <= 0) return;

    const nuevo: Ingreso = {
      descripcion: this.nuevaDescripcion,
      monto: Number(this.nuevoMonto),
      fecha: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    this.ingresosList.unshift(nuevo);
    this.nuevaDescripcion = '';
    this.nuevoMonto = null;
  }

  eliminarIngreso(index: number): void {
    this.ingresosList.splice(index, 1);
  }

  avisarProximamente(): void {
    this.mostrarModal = true;
  }
}