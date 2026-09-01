import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  exito = '';
  cargando = false;

  // Controla si los campos de password se muestran en texto plano (ojito).
  mostrarPassword = false;
  mostrarConfirmPassword = false;

  // Mismo mecanismo que en el login: si assets/logo/logo.png todavia no
  // existe, se evita mostrar una imagen rota.
  logoCargado = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogoLoad(): void {
    this.logoCargado = true;
  }

  onLogoError(): void {
    this.logoCargado = false;
  }

  onSubmit(): void {
    this.error = '';
    this.exito = '';

    if (!this.nombre || !this.email || !this.password) {
      this.error = 'Todos los campos son obligatorios.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    this.auth.register(this.nombre, this.email, this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.exito = 'Cuenta creada. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error?.message || 'No se pudo completar el registro.';
      },
    });
  }
}
