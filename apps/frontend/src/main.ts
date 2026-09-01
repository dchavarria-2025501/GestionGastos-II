import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Antes de arrancar Angular, decide si este equipo puede con animaciones
 * (transform/opacity, ligeras para la GPU) o si es mejor desactivarlas por
 * completo. Se agrega la clase "motion-ok" al <body> solo si:
 *  - el sistema operativo no pide "reducir movimiento", y
 *  - el equipo no da senales claras de ser de gama muy baja (pocos nucleos
 *    de CPU o poca memoria RAM, cuando el navegador puede reportarlo).
 *
 * Si el navegador no puede reportar estos datos (Safari, por ejemplo, no
 * expone memoria), se asume un equipo normal y se permiten las animaciones;
 * lo importante es que en equipos realmente limitados (Chromebooks viejas,
 * laptops de gama baja) quede desactivado para no afectar el rendimiento.
 */
function activarAnimacionesSiElEquipoLoPermite(): void {
  const prefiereReducirMovimiento =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nucleosCpu = (navigator as unknown as { hardwareConcurrency?: number }).hardwareConcurrency;
  const memoriaRam = (navigator as unknown as { deviceMemory?: number }).deviceMemory;

  const esGamaBaja = (nucleosCpu !== undefined && nucleosCpu <= 2) || (memoriaRam !== undefined && memoriaRam <= 2);

  const permitirAnimaciones = !prefiereReducirMovimiento && !esGamaBaja;

  document.body.classList.toggle('motion-ok', permitirAnimaciones);
}

activarAnimacionesSiElEquipoLoPermite();

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
