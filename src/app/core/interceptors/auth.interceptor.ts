import { HttpInterceptorFn, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, mergeMap, shareReplay, throwError, finalize } from 'rxjs';
import { AuthService } from '@/app/core/services/auth.service';

const PUBLIC_ENDPOINTS: ReadonlySet<string> = new Set([
    '/auth/login',
    '/auth/login/two-factor',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/check-email',
    '/auth/refresh-token'
]);

function isPublicUrl(url: string): boolean {
    let path = '';
    try {
        path = new URL(url).pathname;
    } catch {
        path = url;
    }
    for (const endpoint of PUBLIC_ENDPOINTS) {
        if (path.endsWith(endpoint)) return true;
    }
    return false;
}

function withToken(req: HttpRequest<unknown>, auth: AuthService): HttpRequest<unknown> {
    const token = auth.getToken();
    return token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
}

// single-flight: los 401 concurrentes comparten una sola llamada de refresh
let refreshing$: Observable<boolean> | null = null;

function refreshSessionOnce(auth: AuthService): Observable<boolean> {
    if (!refreshing$) {
        refreshing$ = auth.refreshSession().pipe(
            shareReplay({ bufferSize: 1, refCount: true }),
            finalize(() => {
                refreshing$ = null;
            })
        );
    }
    return refreshing$;
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const publicCall = isPublicUrl(req.url);
    const outgoing = publicCall ? req : withToken(req, auth);

    return next(outgoing).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401 || publicCall || req.url.includes('/auth/refresh-token')) {
                return throwError(() => error);
            }

            return refreshSessionOnce(auth).pipe(
                mergeMap((ok) => {
                    if (!ok) {
                        auth.clearSession();
                        router.navigate(['/account/login']);
                        return throwError(() => error);
                    }
                    // sesión renovada: reintenta la petición original con el token fresco
                    return next(withToken(req, auth));
                })
            );
        })
    );
};