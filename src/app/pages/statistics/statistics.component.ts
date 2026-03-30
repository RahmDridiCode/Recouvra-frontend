import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { StatsService } from '../../services/stats.service';
import { Stats } from '../../interfaces/stats.interface';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {
  private statsService = inject(StatsService);
  private cdr = inject(ChangeDetectorRef);

  stats: Stats | null = null;
  loading = true;
  error = '';

  constructor() {}

  ngOnInit(): void {
    this.statsService.getStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; this.cdr.markForCheck(); },
      error: (err) => { this.error = err.error?.message || 'Erreur chargement'; this.loading = false; this.cdr.markForCheck(); }
    });
  }

  monthName(month: number): string {
    const names = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return names[month] || '';
  }
}

