import { Component, OnInit, computed, inject, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StatsService } from '../../services/stats.service';
import { Stats } from '../../interfaces/stats.interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private auth = inject(AuthService);
  private statsService = inject(StatsService);
  private cdr = inject(ChangeDetectorRef);

  stats: Stats | null = null;
  loading = true;

  user = this.auth.currentUser;
  role = this.auth.userRole;
  isAdmin = computed(() => this.role() === 'admin');
  isManager = computed(() => this.role() === 'manager');
  isAgent = computed(() => this.role() === 'agent');

  constructor() {}

  ngOnInit(): void {
    this.statsService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}

