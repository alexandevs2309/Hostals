import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { LayoutService } from '@/app/layout/service/layout.service';
import { AuthService } from '@/app/core/services/auth.service';
import { HotelService } from '@/app/core/services/hotel.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule],
    template: `
    <div class="layout-topbar">

        <!-- izquierda: burger + nombre de módulo -->
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action"
                    (click)="layoutService.onMenuToggle()"
                    aria-label="Toggle menú">
                <i class="pi pi-bars"></i>
            </button>
            <span class="hos-topbar__module">Dashboard</span>
        </div>

        <!-- derecha: acciones -->
        <div class="layout-topbar-actions">

            <button type="button" class="layout-topbar-action hos-topbar__action"
                    title="Buscar" aria-label="Buscar">
                <i class="pi pi-search"></i>
            </button>

            <button type="button"
                    class="layout-topbar-action hos-topbar__action hos-topbar__action--notif"
                    title="Notificaciones" aria-label="Notificaciones">
                <i class="pi pi-bell"></i>
                <span class="hos-topbar__notif-dot" aria-hidden="true"></span>
            </button>

            <button type="button" class="layout-topbar-action hos-topbar__action"
                    (click)="toggleDarkMode()"
                    [attr.aria-label]="layoutService.isDarkTheme() ? 'Modo claro' : 'Modo oscuro'">
                <i [class]="layoutService.isDarkTheme() ? 'pi pi-sun' : 'pi pi-moon'"></i>
            </button>

            <div class="hos-topbar__user">
                <div class="hos-topbar__avatar">{{ initials }}</div>
                <div class="hos-topbar__user-info">
                    <span class="hos-topbar__user-name">{{ userName }}</span>
                    <span class="hos-topbar__user-prop">{{ propertyName }}</span>
                </div>
                <i class="pi pi-chevron-down hos-topbar__chevron"></i>
            </div>

        </div>
    </div>
    `,
    styles: [`
        .hos-topbar__module {
            font-size: 0.9375rem;
            font-weight: 700;
            color: var(--text-color);
            letter-spacing: -0.01em;
        }
        .hos-topbar__action { position: relative; }
        .hos-topbar__notif-dot {
            position: absolute;
            top: 6px; right: 6px;
            width: 7px; height: 7px;
            border-radius: 50%;
            background: #ef4444;
            border: 2px solid var(--surface-card);
        }
        .hos-topbar__user {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px 6px 8px;
            border-radius: 99px;
            border: 1px solid var(--surface-border);
            cursor: pointer;
            transition: background .15s, border-color .15s;
        }
        .hos-topbar__user:hover {
            background: var(--surface-hover);
            border-color: var(--primary-color);
        }
        .hos-topbar__avatar {
            width: 28px; height: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--primary-400), var(--primary-700));
            color: #fff; font-size: 0.65rem; font-weight: 800;
            display: grid; place-items: center; flex-shrink: 0;
        }
        .hos-topbar__user-info {
            display: flex; flex-direction: column; gap: 1px;
        }
        .hos-topbar__user-name {
            font-size: 0.8rem; font-weight: 700;
            color: var(--text-color); line-height: 1;
        }
        .hos-topbar__user-prop {
            font-size: 0.68rem; color: var(--text-color-secondary); line-height: 1;
        }
        .hos-topbar__chevron {
            font-size: 0.6rem; color: var(--text-color-secondary);
        }
        @media (max-width: 991px) {
            .hos-topbar__user-info,
            .hos-topbar__chevron { display: none; }
            .hos-topbar__user { padding: 4px; border: none; background: transparent; }
        }
    `]
})
export class AppTopbar implements OnInit {
    layoutService = inject(LayoutService);

    userName = '';
    initials = '';
    propertyName = '';

    private readonly auth = inject(AuthService);
    private readonly hotels = inject(HotelService);

    ngOnInit(): void {
        this.auth.currentUser$.subscribe((user) => {
            this.userName = user?.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '';
            this.initials = user?.firstName?.charAt(0) ?? 'U';
        });

        const myHotelId = localStorage.getItem('auth_hotel_id');
        const hotels$ = myHotelId
            ? this.hotels.getHotelById(myHotelId)
            : this.hotels.getHotels({ pageNumber: 1, pageSize: 1 }).pipe(map((page) => page.items[0] ?? null));

        hotels$.subscribe({
            next: (hotel) => {
                this.propertyName = hotel?.name ?? '';
            }
        });
    }

    toggleDarkMode(): void {
        this.layoutService.layoutConfig.update(s => ({ ...s, darkTheme: !s.darkTheme }));
    }
}
