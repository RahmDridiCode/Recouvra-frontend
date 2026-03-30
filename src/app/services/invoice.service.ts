import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Invoice, InvoiceCreate, InvoiceUpdate } from '../interfaces/invoice.interface';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private readonly apiUrl = `${environment.apiUrl}/invoices`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  create(data: InvoiceCreate): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, data);
  }

  update(id: string, data: InvoiceUpdate): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

