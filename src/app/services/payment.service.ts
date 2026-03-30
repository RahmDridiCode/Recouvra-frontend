import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Payment, PaymentCreate, PaymentUpdate } from '../interfaces/payment.interface';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  create(data: PaymentCreate): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, data);
  }

  update(id: string, data: PaymentUpdate): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}

