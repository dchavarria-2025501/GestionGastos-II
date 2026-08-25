import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  cargando = false;

  // Controla si la imagen del logo (assets/logo/logo.png) cargo correctamente.
  // Mientras no se coloque el archivo, se muestra un espacio reservado.
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

    if (!this.email || !this.password) {
      this.error = 'Completa email y password.';
      return;
    }

    this.cargando = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.cargando = false;
        const destino = res.user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
        this.router.navigate([destino]);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err?.error?.message || 'No se pudo iniciar sesion.';
      },
    });
  }
}
