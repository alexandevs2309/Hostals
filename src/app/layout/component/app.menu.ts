import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { LayoutService } from '@/app/layout/service/layout.service';

interface HosNavItem {
    label: string;
    icon: string;
    route?: string;
    separator?: boolean;
    badge?: string;
    soon?: boolean;
}

const HOTEL_NAV: HosNavItem[] = [
    { label: 'Dashboard',      icon: 'pi pi-th-large',    route: '/app'                },
    { separator: true,         label: 'Operación',        icon: '' },
    { label: 'Reservaciones',  icon: 'pi pi-calendar',    route: '/app/reservations',  soon: true },
    { label: 'Habitaciones',   icon: 'pi pi-building',    route: '/app/rooms',         soon: true },
    { label: 'Huéspedes',      icon: 'pi pi-user',        route: '/app/guests',        soon: true },
    { label: 'Housekeeping',   icon: 'pi pi-sparkles',    route: '/app/housekeeping',  soon: true },
    { label: 'Mantenimiento',  icon: 'pi pi-wrench',      route: '/app/maintenance',   soon: true },
    { separator: true,         label: 'Finanzas',         icon: '' },
    { label: 'Finanzas',       icon: 'pi pi-dollar',      route: '/app/finance',       soon: true },
    { label: 'Analytics',      icon: 'pi pi-chart-line',  route: '/app/analytics',     soon: true },
    { separator: true,         label: 'Sistema',          icon: '' },
    { label: 'Configuración',  icon: 'pi pi-cog',         route: '/app/settings',      soon: true },
];

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <nav class="hos-nav" aria-label="Menú principal">

            <!-- brand dentro del sidebar -->
            <div class="hos-nav__brand">
                <div class="hos-nav__brand-icon"><i class="pi pi-building"></i></div>
                <div class="hos-nav__brand-text">
                    <span class="hos-nav__brand-name">Hospitality</span>
                    <span class="hos-nav__brand-os">OS</span>
                </div>
            </div>

            <!-- propiedad activa -->
            <div class="hos-nav__property">
                <div class="hos-nav__property-dot"></div>
                <div class="hos-nav__property-info">
                    <span class="hos-nav__property-name">Hotel Aurora</span>
                    <span class="hos-nav__property-sub">Demo · 142 habitaciones</span>
                </div>
                <button type="button" class="hos-nav__property-btn" title="Cambiar propiedad">
                    <i class="pi pi-chevron-down"></i>
                </button>
            </div>

            <!-- items de navegación -->
            <ul class="hos-nav__list">
                @for (item of nav; track item.label) {

                    @if (item.separator) {
                        <li class="hos-nav__group-label">{{ item.label }}</li>
                    } @else {
                        <li>
                            <a class="hos-nav__item"
                               [routerLink]="item.route"
                               routerLinkActive="hos-nav__item--active"
                               [routerLinkActiveOptions]="{ exact: item.route === '/app' }"
                               [attr.aria-label]="item.label + (item.soon ? ' (próximamente)' : '')">
                                <i [class]="item.icon + ' hos-nav__icon'"></i>
                                <span class="hos-nav__label">{{ item.label }}</span>
                                @if (item.badge) {
                                    <span class="hos-nav__badge">{{ item.badge }}</span>
                                }
                                @if (item.soon) {
                                    <span class="hos-nav__soon">Pronto</span>
                                }
                            </a>
                        </li>
                    }
                }
            </ul>

            <!-- footer del sidebar -->
            <div class="hos-nav__foot">
                <div class="hos-nav__user">
                    <div class="hos-nav__avatar">GM</div>
                    <div class="hos-nav__user-info">
                        <span class="hos-nav__user-name">Demo User</span>
                        <span class="hos-nav__user-role">Gerente General</span>
                    </div>
                </div>
            </div>

        </nav>
    `,
    styles: [`
        /* ══════════════════════════════════════════════════════
           NAV WRAPPER — respeta las dimensiones del layout Sakai
        ══════════════════════════════════════════════════════ */
        .hos-nav {
            display: flex;
            flex-direction: column;
            height: 100%;
            padding: 0;
            overflow: hidden;
        }

        /* ── Brand ─────────────────────────────────────────── */
        .hos-nav__brand {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 22px 20px 18px;
            border-bottom: 1px solid var(--surface-border);
        }
        .hos-nav__brand-icon {
            width: 34px; height: 34px;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--primary-400), var(--primary-600));
            color: #fff;
            display: grid; place-items: center;
            font-size: 1rem;
            box-shadow: 0 4px 12px color-mix(in srgb, var(--primary-500) 40%, transparent);
            flex-shrink: 0;
        }
        .hos-nav__brand-text {
            display: flex;
            align-items: baseline;
            gap: 3px;
            font-family: var(--font-family);
            font-weight: 800;
            font-size: 1.05rem;
            letter-spacing: -0.02em;
        }
        .hos-nav__brand-name { color: var(--text-color); }
        .hos-nav__brand-os   { color: var(--primary-color); }

        /* ── Propiedad activa ───────────────────────────────── */
        .hos-nav__property {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 12px 12px 6px;
            padding: 10px 12px;
            background: var(--surface-hover);
            border-radius: 10px;
            border: 1px solid var(--surface-border);
        }
        .hos-nav__property-dot {
            width: 8px; height: 8px;
            border-radius: 50%;
            background: #22c55e;
            box-shadow: 0 0 0 2px rgba(34,197,94,.2);
            flex-shrink: 0;
        }
        .hos-nav__property-info {
            display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;
        }
        .hos-nav__property-name {
            font-size: 0.8125rem; font-weight: 700;
            color: var(--text-color); white-space: nowrap;
            overflow: hidden; text-overflow: ellipsis;
        }
        .hos-nav__property-sub {
            font-size: 0.7rem; color: var(--text-color-secondary);
        }
        .hos-nav__property-btn {
            background: none; border: none; cursor: pointer;
            color: var(--text-color-secondary); padding: 2px;
            display: grid; place-items: center;
            font-size: 0.65rem;
            transition: color .15s;
        }
        .hos-nav__property-btn:hover { color: var(--primary-color); }

        /* ── Lista de items ─────────────────────────────────── */
        .hos-nav__list {
            list-style: none;
            margin: 8px 0 0; padding: 0 8px;
            display: flex; flex-direction: column; gap: 2px;
            flex: 1; overflow-y: auto;
            overflow-x: hidden;
        }

        /* scrollbar fino */
        .hos-nav__list::-webkit-scrollbar { width: 4px; }
        .hos-nav__list::-webkit-scrollbar-track { background: transparent; }
        .hos-nav__list::-webkit-scrollbar-thumb {
            background: var(--surface-border); border-radius: 4px;
        }

        /* ── Separador / grupo ──────────────────────────────── */
        .hos-nav__group-label {
            font-size: 0.65rem;
            font-weight: 700;
            letter-spacing: .1em;
            text-transform: uppercase;
            color: var(--text-color-secondary);
            padding: 14px 12px 4px;
        }

        /* ── Item de nav ────────────────────────────────────── */
        .hos-nav__item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 9px 12px;
            border-radius: 8px;
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--text-color-secondary);
            cursor: pointer;
            text-decoration: none;
            transition: background .15s, color .15s;
            white-space: nowrap;
        }
        .hos-nav__item:hover {
            background: var(--surface-hover);
            color: var(--text-color);
        }
        .hos-nav__item--active {
            background: color-mix(in srgb, var(--primary-color) 12%, transparent);
            color: var(--primary-color);
        }
        .hos-nav__item--active .hos-nav__icon {
            color: var(--primary-color);
        }

        /* ── Icono ──────────────────────────────────────────── */
        .hos-nav__icon {
            font-size: 0.875rem;
            width: 16px;
            text-align: center;
            flex-shrink: 0;
            color: var(--text-color-secondary);
            transition: color .15s;
        }
        .hos-nav__item:hover .hos-nav__icon {
            color: var(--text-color);
        }

        /* ── Label ──────────────────────────────────────────── */
        .hos-nav__label { flex: 1; }

        /* ── Badge ──────────────────────────────────────────── */
        .hos-nav__badge {
            font-size: 0.62rem; font-weight: 800;
            padding: 2px 7px; border-radius: 999px;
            background: var(--primary-color);
            color: #fff; flex-shrink: 0;
        }

        /* ── Soon ───────────────────────────────────────────── */
        .hos-nav__soon {
            font-size: 0.6rem; font-weight: 700;
            padding: 2px 6px; border-radius: 999px;
            background: var(--surface-hover);
            color: var(--text-color-secondary);
            border: 1px solid var(--surface-border);
            flex-shrink: 0;
            letter-spacing: .04em;
        }

        /* ── Footer del sidebar ─────────────────────────────── */
        .hos-nav__foot {
            padding: 12px 12px 16px;
            border-top: 1px solid var(--surface-border);
            margin-top: 8px;
        }
        .hos-nav__user {
            display: flex; align-items: center; gap: 10px;
        }
        .hos-nav__avatar {
            width: 34px; height: 34px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-400), var(--primary-700));
            color: #fff; font-size: 0.7rem; font-weight: 800;
            display: grid; place-items: center; flex-shrink: 0;
        }
        .hos-nav__user-info {
            display: flex; flex-direction: column; gap: 1px; min-width: 0;
        }
        .hos-nav__user-name {
            font-size: 0.8125rem; font-weight: 700;
            color: var(--text-color); white-space: nowrap;
            overflow: hidden; text-overflow: ellipsis;
        }
        .hos-nav__user-role {
            font-size: 0.7rem; color: var(--text-color-secondary);
        }
    `]
})
export class AppMenu {
    nav = HOTEL_NAV;
    layoutService = inject(LayoutService);
}
