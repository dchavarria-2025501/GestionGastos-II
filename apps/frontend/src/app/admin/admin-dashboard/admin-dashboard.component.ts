import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { Usuario } from '../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  usuarios: Usuario[] = [];
  error = '';
  editandoId: string | null = null;
  rolEditado: 'admin' | 'user' = 'user';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.userService.listUsers().subscribe({
      next: (res) => (this.usuarios = res.users),
      error: (err) => (this.error = err?.error?.message || 'No se pudo cargar la lista de usuarios.'),
    });
  }

  editarRol(usuario: Usuario): void {
    this.editandoId = usuario.id;
    this.rolEditado = usuario.role;
  }

  guardarRol(usuario: Usuario): void {
    this.userService.updateUser(usuario.id, { role: this.rolEditado }).subscribe({
      next: () => {
        this.editandoId = null;
        this.cargarUsuarios();
      },
      error: (err) => (this.error = err?.error?.message || 'No se pudo actualizar el usuario.'),
    });
  }

  eliminar(usuario: Usuario): void {
    if (!confirm(`¿Eliminar al usuario ${usuario.email}?`)) return;

    this.userService.deleteUser(usuario.id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => (this.error = err?.error?.message || 'No se pudo eliminar el usuario.'),
    });
  }
}
