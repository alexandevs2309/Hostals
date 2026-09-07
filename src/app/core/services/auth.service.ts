import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  department: string;
  position: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  department: string;
  position: string;
  roles: string[];
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = environment.authApiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  // Login
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  // Registro
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, userData)
      .pipe(
        tap(response => {
          this.storeAuthData(response);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  // Obtener usuario actual
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.authUrl}/me`);
  }

  // Actualizar usuario actual
  updateCurrentUser(userData: any): Observable<User> {
    return this.http.put<User>(`${this.authUrl}/me`, userData)
      .pipe(
        tap(user => this.currentUserSubject.next(user))
      );
  }

  // Cambiar contraseña
  changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    const data = {
      currentPassword,
      newPassword,
      confirmPassword
    };
    return this.http.post(`${this.authUrl}/change-password`, data);
  }

  // Olvidar contraseña
  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.authUrl}/forgot-password`, { email });
  }

  // Resetear contraseña
  resetPassword(email: string, token: string, newPassword: string, confirmPassword: string): Observable<string> {
    const data = {
      email,
      token,
      newPassword,
      confirmPassword
    };
    return this.http.post<string>(`${this.authUrl}/reset-password`, data);
  }

  // Refresh token
  refreshToken(token: string, refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/refresh-token`, { token, refreshToken })
      .pipe(
        tap(response => this.storeAuthData(response))
      );
  }

  // Verifica si un email está disponible para registro
  checkEmailAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.authUrl}/check-email/${encodeURIComponent(email)}`);
  }

  // Valida el token JWT contra el servidor
  validateToken(): Observable<{ valid: boolean; message: string }> {
    return this.http.get<{ valid: boolean; message: string }>(`${this.authUrl}/validate-token`);
  }

  // Logout
  logout(): void {
    // Notifica al servidor para revocar el refresh token (el interceptor añade el token actual)
    this.http.post(`${this.authUrl}/logout`, {}).pipe(catchError(() => of(null))).subscribe();
    this.clearSession();
  }

  // Limpia la sesión local
  private clearSession(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('token_expires_at');
    this.currentUserSubject.next(null);
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    // Verificar expiración del token
    const expiresAt = localStorage.getItem('token_expires_at');
    if (expiresAt) {
      const expirationDate = new Date(expiresAt);
      if (expirationDate <= new Date()) {
        this.logout();
        return false;
      }
    }

    return true;
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Cargar usuario desde localStorage
  private loadCurrentUser(): void {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  // Almacenar datos de autenticación
  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('token_expires_at', response.expiresAt);
    localStorage.setItem('user_data', JSON.stringify(response.user));
  }
}