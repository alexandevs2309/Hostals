import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, finalize, timeout, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { IdleService } from './idle.service';

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
  language: string;
  timeZone: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
  requiresTwoFactor?: boolean;
  twoFactorToken?: string | null;
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
  hotelId?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  /** El usuario debe cambiar su contraseña en cuanto entre (primer acceso / registro). */
  mustChangePassword?: boolean;
  /** La cuenta tiene activada la verificación en dos pasos (TOTP). */
  twoFactorEnabled?: boolean;
}

export interface TwoFactorSetup {
  sharedKey: string;
  qrCodeSvg: string;
  keyUri: string;
}

export interface TwoFactorVerifyResult {
  succeeded: boolean;
  recoveryCodes?: string[];
}

export interface Session {
  id: string;
  deviceName: string;
  ipAddress?: string;
  isCurrent: boolean;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
}

export interface DeviceInfo {
  name: string;
  fingerprint: string | null;
  userAgent?: string;
}

const PENDING_2FA_KEY = 'gos_pending_2fa_token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = environment.authApiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private readonly idle: IdleService) {
    this.loadCurrentUser();
  }

  // ── Identificación de dispositivo ────────────────────────────────
  // Fingerprint estable (uuid) generado una vez por navegador; se envía en
  // login/refresh/logout para agrupar y poder revocar sesiones concretas.
  getDeviceInfo(): DeviceInfo {
    let fp = localStorage.getItem('gos_device_id');
    if (!fp) {
      fp = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem('gos_device_id', fp);
    }
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    return { name: this.friendlyDeviceName(ua), fingerprint: fp, userAgent: ua };
  }

  private friendlyDeviceName(ua: string): string {
    const browser = ua.includes('Edg/') ? 'Edge' :
      ua.includes('Chrome/') ? 'Chrome' :
      ua.includes('Firefox/') ? 'Firefox' :
      ua.includes('Safari/') ? 'Safari' : 'Navegador';
    let os = 'otro sistema';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac OS')) os = 'macOS';
    else if (ua.includes('X11; Linux') || ua.includes('Linux')) os = 'Linux';
    else if (ua.includes('Android')) os = 'Android';
    else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
    // Solo ASCII en el header de dispositivo (los proxies/servidores rechazan caracteres no-ASCII).
    return `${browser} - ${os}`;
  }

  private headersWithDevice(): Record<string, string> {
    return { 'X-Device-Info': JSON.stringify(this.getDeviceInfo()) };
  }

  // ── Login ────────────────────────────────────────────────────────
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login`, credentials, { headers: this.headersWithDevice() })
      .pipe(
        tap(response => {
          if (!response.requiresTwoFactor) {
            this.storeAuthData(response);
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  // Paso 2FA: código TOTP o código de recuperación tras acreditar contraseña.
  loginWithTwoFactor(twoFactorToken: string, code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/login/two-factor`, { twoFactorToken, code }, { headers: this.headersWithDevice() })
      .pipe(
        tap(response => {
          this.storeAuthData(response);
          this.currentUserSubject.next(response.user);
        })
      );
  }

  // Guarda el token del paso previo al 2FA (memoria + sessionStorage para supervivencia ante recarga).
  setPendingTwoFactor(token: string): void {
    sessionStorage.setItem(PENDING_2FA_KEY, token);
  }

  getPendingTwoFactor(): string | null {
    return sessionStorage.getItem(PENDING_2FA_KEY);
  }

  clearPendingTwoFactor(): void {
    sessionStorage.removeItem(PENDING_2FA_KEY);
  }

  // E2E / guards: hay un segundo factor pendiente de completar.
  hasPendingTwoFactor(): boolean {
    return !!this.getPendingTwoFactor();
  }

  // ── Gestión de la verificación en dos pasos ──────────────────────
  getTwoFactorSetup(): Observable<TwoFactorSetup> {
    return this.http.get<TwoFactorSetup>(`${this.authUrl}/two-factor/setup`);
  }

  verifyTwoFactor(code: string): Observable<TwoFactorVerifyResult> {
    return this.http.post<TwoFactorVerifyResult>(`${this.authUrl}/two-factor/verify`, { code });
  }

  disableTwoFactor(code: string): Observable<string> {
    return this.http.post(`${this.authUrl}/two-factor/disable`, { code }, { responseType: 'text' });
  }

  regenerateRecoveryCodes(code: string): Observable<TwoFactorVerifyResult> {
    return this.http.post<TwoFactorVerifyResult>(`${this.authUrl}/two-factor/recovery-codes`, { code });
  }

  // ── Sesiones activas ─────────────────────────────────────────────
  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.authUrl}/sessions`);
  }

  revokeSession(sessionId: string): Observable<string> {
    return this.http.post(`${this.authUrl}/sessions/revoke`, { sessionId }, { responseType: 'text' });
  }

  // ── Registro ─────────────────────────────────────────────────────
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.authUrl}/register`, userData, { headers: this.headersWithDevice() })
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
    changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Observable<string> {
        const data = {
            currentPassword,
            newPassword,
            confirmPassword
        };
        // El backend responde Ok(string) con Content-Type text/plain
        return this.http.post(`${this.authUrl}/change-password`, data, { responseType: 'text' });
  }

  // Olvidar contraseña
  forgotPassword(email: string): Observable<string> {
    return this.http.post(`${this.authUrl}/forgot-password`, { email }, { responseType: 'text' });
  }

  // Resetear contraseña
  resetPassword(email: string, token: string, newPassword: string, confirmPassword: string): Observable<string> {
    const data = {
      email,
      token,
      newPassword,
      confirmPassword
    };
    return this.http.post(`${this.authUrl}/reset-password`, data, { responseType: 'text' });
  }

// Refresh token
    refreshToken(token: string, refreshToken: string): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.authUrl}/refresh-token`, { token, refreshToken }, { headers: this.headersWithDevice() })
            .pipe(
                tap(response => this.storeAuthData(response))
            );
    }

    // Intenta renovar la sesión con el refresh token almacenado
    // (single-flight: el interceptor comparte la misma llamada entre peticiones concurrentes).
    refreshSession(): Observable<boolean> {
        const token = this.getToken();
        const refresh = localStorage.getItem('refresh_token');
        if (!token || !refresh) {
            return of(false);
        }
        return this.refreshToken(token, refresh).pipe(
            map(() => true),
            catchError(() => {
                this.clearSession();
                return of(false);
            })
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

// Logout fiable: revoca el refresh token en el servidor y, pase lo que pase
// (éxito, error de red o timeout), limpia la sesión local al finalizar.
    logout(): void {
        this.http.post(`${this.authUrl}/logout`, {}, { headers: this.headersWithDevice() }).pipe(
            timeout(4000),
            catchError(() => of(null)),
            finalize(() => this.clearSession())
        ).subscribe();
    }

    // Limpia la sesión local
    public clearSession(): void {
        this.idle.stop();
        this.clearPendingTwoFactor();
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('token_expires_at');
        localStorage.removeItem('auth_hotel_id');
        this.currentUserSubject.next(null);
    }

    // Verificar si está autenticado (valida la expiración decodificando el JWT)
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        const expiresAt = this.getTokenExpiry();
        if (expiresAt && expiresAt <= new Date()) {
            this.clearSession();
            return false;
        }
        return true;
    }

    // Obtener token
    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    // Usuario en memoria o recuperado de localStorage (síncrono, para guards)
    getCachedUser(): User | null {
        if (this.currentUserSubject.value) {
            return this.currentUserSubject.value;
        }
        const raw = localStorage.getItem('user_data');
        if (!raw) return null;
        try {
            return JSON.parse(raw) as User;
        } catch {
            return null;
        }
    }

    // Fecha de expiración del token: claim `exp` del JWT o fallback `token_expires_at`
    getTokenExpiry(): Date | null {
        const token = this.getToken();
        if (token) {
            const jwt = this.decodeJwt(token);
            if (jwt && typeof jwt.exp === 'number' && jwt.exp > 0) {
                return new Date(jwt.exp * 1000);
            }
        }
        const expiresAt = localStorage.getItem('token_expires_at');
        if (!expiresAt) return null;
        const parsed = new Date(expiresAt);
        return isNaN(parsed.getTime()) ? null : parsed;
    }

    // Decodifica (sin validar firma) el payload de un JWT
    private decodeJwt(token: string): any | null {
        try {
            const payload = token.split('.')[1];
            if (!payload) return null;
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(json);
        } catch {
            return null;
        }
    }

    // Renueva la sesión automáticamente antes de que expire (margen 60s)
    private refreshTimer: ReturnType<typeof setTimeout> | null = null;

    private scheduleTokenRefresh(): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
        const expiresAt = this.getTokenExpiry();
        if (!expiresAt || expiresAt <= new Date()) return;

        const delay = Math.max(0, expiresAt.getTime() - Date.now() - 60_000);
        this.refreshTimer = setTimeout(() => {
            this.refreshSession().subscribe((ok) => {
                if (!ok) this.clearSession();
            });
        }, delay);
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
        if (response.user?.hotelId) {
            localStorage.setItem('auth_hotel_id', response.user.hotelId);
        }
        this.currentUserSubject.next(response.user);
        this.scheduleTokenRefresh();
        this.idle.start();
    }

    // Actualiza solo el usuario en caché (cambios de perfil, mustChangePassword, etc.)
    updateCachedUser(user: User): void {
        localStorage.setItem('user_data', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    // True si el usuario debe pasar por el cambio forzado de contraseña
    shouldChangePassword(): boolean {
        return !!this.getCachedUser()?.mustChangePassword;
    }
}