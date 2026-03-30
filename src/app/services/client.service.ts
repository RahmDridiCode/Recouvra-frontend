import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Client, ClientCreate, ClientUpdate } from '../interfaces/client.interface';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private readonly apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  create(data: ClientCreate): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, data);
  }

  update(id: string, data: ClientUpdate): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

