import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SessionExpiredModalComponent } from './shared/session-expired-modal/session-expired-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, SessionExpiredModalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
