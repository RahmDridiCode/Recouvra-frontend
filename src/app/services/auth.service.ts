import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest } from '../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly tokenKey = 'recouvra_token';
  private readonly userKey = 'recouvra_user';

  private currentUserSignal = signal<AuthResponse['user'] | null>(this.loadUser());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUserSignal());
  readonly userRole = computed(() => this.currentUserSignal()?.role ?? null);

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): AuthResponse['user'] | null {
    try {
      const raw = localStorage.getItem(this.userKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.userKey, JSON.stringify(res.user));
        this.currentUserSignal.set(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(...roles: string[]): boolean {
    const user = this.currentUserSignal();
    return user ? roles.includes(user.role) : false;
  }
}

