import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.auth.currentUser();
  }
}
