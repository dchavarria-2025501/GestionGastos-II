import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { SessionService } from '../../core/services/session.service';

@Component({
  selector: 'app-session-expired-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-expired-modal.component.html',
})
export class SessionExpiredModalComponent {
  constructor(public session: SessionService, private auth: AuthService) {}

  volverAlLogin(): void {
    this.session.reconocerExpiracion();
    this.auth.logout();
  }
}
