import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Stats } from '../interfaces/stats.interface';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private readonly apiUrl = `${environment.apiUrl}/stats`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(this.apiUrl);
  }
}

