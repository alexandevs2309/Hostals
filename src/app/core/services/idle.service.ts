import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';

const DEFAULT_IDLE_MS = 5 * 60 * 1000; // 5 minutos sin actividad
const LOCK_ROUTE = '/account/lock-screen';
const PUBLIC_ROUTES = ['/account/login', '/account/register', '/account/forgot-password'];

@Injectable({ providedIn: 'root' })
export class IdleService implements OnDestroy {
    private readonly router = inject(Router);
    private timer: ReturnType<typeof setTimeout> | null = null;
    private active = false;
    private idleMs = DEFAULT_IDLE_MS;

    constructor() {
        // Override para demos/tests: localStorage gos_idle_timeout_ms
        const override = typeof localStorage !== 'undefined' ? Number(localStorage.getItem('gos_idle_timeout_ms')) : 0;
        if (Number.isFinite(override) && override > 0) {
            this.idleMs = override;
        }
        const events = ['mousedown', 'keydown', 'scroll', 'wheel', 'touchstart'];
        events.forEach((event) => window.addEventListener(event, this.onActivity, { passive: true } as AddEventListenerOptions));
    }

    /** Tiempo de inactividad para el bloqueo (por defecto 5 min). */
    set idleTime(ms: number) {
        this.idleMs = ms;
        if (this.active) {
            this.reset();
        }
    }

    start(): void {
        this.active = true;
        this.reset();
    }

    stop(): void {
        this.active = false;
        this.clear();
    }

    private readonly onActivity = (): void => {
        if (this.active) {
            this.reset();
        }
    };

    private reset(): void {
        if (!this.active) return;
        this.clear();
        this.timer = setTimeout(() => this.lock(), this.idleMs);
    }

    private clear(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    private lock(): void {
        const path = this.router.url.split('?')[0];
        if (path === LOCK_ROUTE || PUBLIC_ROUTES.includes(path)) {
            this.stop();
            return;
        }
        this.stop();
        this.router.navigate([LOCK_ROUTE]);
    }

    ngOnDestroy(): void {
        this.clear();
        const events = ['mousedown', 'keydown', 'scroll', 'wheel', 'touchstart'];
        events.forEach((event) => window.removeEventListener(event, this.onActivity));
    }
}