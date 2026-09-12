import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive, Router } from '@angular/router';
import { map } from 'rxjs';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService, User } from '@/app/core/services/auth.service';
import { HotelService, Hotel } from '@/app/core/services/hotel.service';
import { Role, hasAnyRole } from '@/app/core/auth/roles';

interface HosNavItem {
    label: string;
    icon: string;
    route?: string;
    separator?: boolean;
    badge?: string;
    soon?: boolean;
    roles?: Role[];
}

const HOTEL_NAV: HosNavItem[] = [
    { label: 'Dashboard',      icon: 'pi pi-th-large',    route: '/app'                },
    { label: 'Puesta en marcha', icon: 'pi pi-rocket',    route: '/app/onboarding'     },
    { separator: true,         label: 'Operación',        icon: '' },
    { label: 'Reservaciones',  icon: 'pi pi-calendar',    route: '/app/reservations'  },
    { label: 'Habitaciones',   icon: 'pi pi-building',    route: '/app/rooms'         },
    { label: 'Tarifas',        icon: 'pi pi-money-bill',  route: '/app/rates'         },
    { label: 'Huéspedes',      icon: 'pi pi-user',        route: '/app/guests'        },
    { label: 'Housekeeping',   icon: 'pi pi-sparkles',    route: '/app/housekeeping'  },
    { label: 'Mantenimiento',  icon: 'pi pi-wrench',      route: '/app/maintenance'   },
    { separator: true,         label: 'Finanzas',         icon: '' },
    { label: 'Finanzas',       icon: 'pi pi-dollar',      route: '/app/finance',       roles: ['Admin', 'Manager'] },
    { label: 'Analytics',      icon: 'pi pi-chart-line',  route: '/app/analytics',     roles: ['Admin', 'Manager'] },
    { separator: true,         label: 'Mi cuenta',        icon: '' },
    { label: 'Seguridad',      icon: 'pi pi-shield',      route: '/app/security' },
    { separator: true,         label: 'Sistema',          icon: '' },
    { label: 'Auditoría',      icon: 'pi pi-history',     route: '/app/audit',        roles: ['Admin'] },
    { label: 'Configuración',  icon: 'pi pi-cog',         route: '/app/settings',      roles: ['Admin'] },
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
                    <span class="hos-nav__property-name">{{ propertyName }}</span>
                    <span class="hos-nav__property-sub">{{ propertySub }}</span>
                </div>
            </div>

            <!-- items de navegación -->
            <ul class="hos-nav__list">
                @for (item of nav; track $index) {

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
                    <div class="hos-nav__avatar">{{ user?.firstName?.charAt(0) ?? 'U' }}{{ user?.lastName?.charAt(0) ?? '' }}</div>
                    <div class="hos-nav__user-info">
                        <span class="hos-nav__user-name">{{ userName }}</span>
                        <span class="hos-nav__user-role">{{ userRole }}</span>
                    </div>
                </div>
                <button type="button" class="hos-nav__logout" (click)="signOut()">
                    <i class="pi pi-sign-out"></i> Cerrar sesión
                </button>
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
        .hos-nav__logout {
            display: flex; align-items: center; gap: 6px;
            margin-top: 10px; width: 100%; padding: 7px 10px;
            border: 1px solid var(--surface-border); border-radius: 8px;
            background: transparent; color: var(--text-color-secondary);
            font-family: var(--font-family); font-size: 0.8rem; font-weight: 600;
            cursor: pointer; transition: color .15s, border-color .15s, background .15s;
        }
        .hos-nav__logout:hover {
            color: #ef4444; border-color: color-mix(in srgb, #ef4444 45%, transparent);
            background: color-mix(in srgb, #ef4444 8%, transparent);
        }
    `]
})
export class AppMenu implements OnInit {
    nav = HOTEL_NAV;
    layoutService = inject(LayoutService);

    user: User | null = null;
    userName = '';
    userRole = '';
    propertyName = 'Sin propiedad';
    propertySub = '';

    private readonly auth = inject(AuthService);
    private readonly hotels = inject(HotelService);
    private readonly router = inject(Router);

    ngOnInit(): void {
        this.auth.currentUser$.subscribe((user) => {
            this.user = user;
            this.applyNavPermissions(user);
            this.userName = user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : 'Usuario';
            this.userRole = user?.position || user?.roles?.[0] || 'Miembro del equipo';
        });

        // Propiedad del usuario (auth_hotel_id) o primera activa (GET /api/v1/hotels)
        const myHotelId = localStorage.getItem('auth_hotel_id');
        const hotels$ = myHotelId
            ? this.hotels.getHotelById(myHotelId)
            : this.hotels.getHotels({ pageNumber: 1, pageSize: 1 }).pipe(map((page) => page.items[0] ?? null));

        hotels$.subscribe({
            next: (hotel: Hotel | null) => {
                if (hotel) {
                    this.propertyName = hotel.name;
                    const location = [hotel.city, hotel.country].filter(Boolean).join(', ');
                    this.propertySub = `${hotel.totalRooms || 0} habitaciones${location ? ` · ${location}` : ''}`;
                } else {
                    this.propertySub = 'Sin propiedad configurada';
                }
            },
            error: () => {
                this.propertySub = 'Pendiente de cargar';
            }
        });
    }

    signOut(): void {
        this.auth.logout();
        this.router.navigate(['/account/login']);
    }

    // Filtra los items del menú según los roles del usuario
    private applyNavPermissions(user: User | null): void {
        const roles = user?.roles ?? [];
        this.nav = HOTEL_NAV.filter((item) => !item.roles || hasAnyRole(roles, item.roles));
    }
}
