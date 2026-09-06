import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { API_BASE } from './api.config';
import {
    BOOKINGS,
    HOTEL_METRICS,
    HOUSEKEEPING_ROOMS,
    MAINTENANCE_TICKETS,
    MODULE_CONTENT,
    OCCUPANCY_TREND,
    REVENUE_TREND
} from '@/app/shared/data/mock.data';

/**
 * Interceptor funcional que emula la API v1 en local.
 *
 * Mientras no exista backend real, todas las peticiones bajo `API_BASE`
 * se responden con los datos de mock.data.ts y una latencia simulada.
 *
 * ┌ Para conectar un backend real:
 * ├─ 1. Cambiar `API_BASE` en api.config.ts a la URL real, y
 * ├─ 2. Quitar `withInterceptors([mockApiInterceptor])` de app.config.ts
 * └─ (o condicionar por entorno: environment.apiMock = true/false)
 */
type RouteHandler = (url: string, match: RegExpMatchArray) => unknown;

interface MockRoute {
    pattern: RegExp;
    resolve: RouteHandler;
}

const MOCK_ROUTES: MockRoute[] = [
    { pattern: /\/modules\/([a-z-]+)$/, resolve: (_u, m) => MODULE_CONTENT[m[1]] ?? null },
    { pattern: /\/hotels\/[^/]+\/metrics$/, resolve: () => HOTEL_METRICS },
    { pattern: /\/hotels\/[^/]+\/bookings$/, resolve: () => BOOKINGS },
    { pattern: /\/hotels\/[^/]+\/housekeeping\/rooms$/, resolve: () => HOUSEKEEPING_ROOMS },
    { pattern: /\/hotels\/[^/]+\/maintenance\/tickets$/, resolve: () => MAINTENANCE_TICKETS },
    { pattern: /\/hotels\/[^/]+\/analytics\/occupancy$/, resolve: () => OCCUPANCY_TREND },
    { pattern: /\/hotels\/[^/]+\/analytics\/revenue$/, resolve: () => REVENUE_TREND }
];

const LATENCY_MIN = 200;
const LATENCY_MAX = 450;

export function mockApiInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
    if (!req.url.includes(API_BASE)) {
        return next(req);
    }

    const latency = LATENCY_MIN + Math.random() * (LATENCY_MAX - LATENCY_MIN);

    const route = MOCK_ROUTES.find((r) => r.pattern.test(req.url));
    if (!route) {
        return throwError(
            () => new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: req.url })
        ).pipe(delay(latency));
    }

    const match = req.url.match(route.pattern) as RegExpMatchArray;
    const body = route.resolve(req.url, match);

    if (body === null || body === undefined) {
        return throwError(
            () => new HttpErrorResponse({ status: 404, statusText: 'Not Found', url: req.url })
        ).pipe(delay(latency));
    }

    return of(new HttpResponse({ status: 200, body })).pipe(delay(latency));
}