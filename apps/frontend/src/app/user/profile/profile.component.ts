import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

// Tamaño maximo (en px) al que se reescala la foto antes de subirla, para
// no mandar imagenes enormes al servidor.
const TAMANO_MAXIMO_AVATAR_PX = 300;

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  @ViewChild('inputArchivo') inputArchivo?: ElementRef<HTMLInputElement>;

  subiendo = false;
  error = '';

  constructor(public auth: AuthService) {}

  abrirSelectorDeArchivo(): void {
    this.error = '';
    this.inputArchivo?.nativeElement.click();
  }

  onArchivoSeleccionado(event: Event): void {
    const input = event.target as HTMLInputElement;
    const archivo = input.files?.[0];
    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith('image/')) {
      this.error = 'El archivo debe ser una imagen.';
      input.value = '';
      return;
    }

    this.subiendo = true;
    this.redimensionarImagen(archivo)
      .then((dataUrl) => {
        this.auth.updateAvatar(dataUrl).subscribe({
          next: () => {
            this.subiendo = false;
          },
          error: (err) => {
            this.subiendo = false;
            this.error = err?.error?.message || 'No se pudo actualizar la foto de perfil.';
          },
        });
      })
      .catch(() => {
        this.subiendo = false;
        this.error = 'No se pudo procesar la imagen.';
      })
      .finally(() => {
        input.value = '';
      });
  }

  /** Reescala y comprime la imagen en el navegador antes de subirla. */
  private redimensionarImagen(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onerror = () => reject(lector.error);
      lector.onload = () => {
        const imagen = new Image();
        imagen.onerror = () => reject(new Error('Imagen invalida'));
        imagen.onload = () => {
          const escala = Math.min(1, TAMANO_MAXIMO_AVATAR_PX / Math.max(imagen.width, imagen.height));
          const ancho = Math.round(imagen.width * escala);
          const alto = Math.round(imagen.height * escala);

          const canvas = document.createElement('canvas');
          canvas.width = ancho;
          canvas.height = alto;
          const contexto = canvas.getContext('2d');
          if (!contexto) {
            reject(new Error('No se pudo procesar la imagen'));
            return;
          }
          contexto.drawImage(imagen, 0, 0, ancho, alto);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        imagen.src = lector.result as string;
      };
      lector.readAsDataURL(archivo);
    });
  }
}
