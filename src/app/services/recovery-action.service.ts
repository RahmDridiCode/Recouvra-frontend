import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RecoveryAction, RecoveryActionCreate } from '../interfaces/recovery-action.interface';

@Injectable({ providedIn: 'root' })
export class RecoveryActionService {
  private readonly apiUrl = `${environment.apiUrl}/recovery-actions`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RecoveryAction[]> {
    return this.http.get<RecoveryAction[]>(this.apiUrl);
  }

  create(data: RecoveryActionCreate): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}

