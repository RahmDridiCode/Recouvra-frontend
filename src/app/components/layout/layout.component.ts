import { Component, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  private auth = inject(AuthService);

  user = this.auth.currentUser;
  role = this.auth.userRole;

  isAdmin = computed(() => this.role() === 'admin');
  isManager = computed(() => this.role() === 'manager');
  isAgent = computed(() => this.role() === 'agent');

  logout(): void {
    this.auth.logout();
  }
}

