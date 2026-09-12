import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingsView } from './mockup-views/bookings-view';
import { HousekeepingView } from './mockup-views/housekeeping-view';
import { GuestView } from './mockup-views/guest-view';
import { MaintenanceView } from './mockup-views/maintenance-view';
import { AnalyticsView } from './mockup-views/analytics-view';
import { RoomsView } from './mockup-views/rooms-view';
import { FinanceView } from './mockup-views/finance-view';
import { DashboardView } from './mockup-views/dashboard-view';

export type ScreenVariant = 'dashboard' | 'reservations' | 'rooms' | 'housekeeping' | 'guests' | 'maintenance' | 'finance' | 'analytics';

@Component({
    selector: 'gos-screen-mockup',
    standalone: true,
    imports: [CommonModule, BookingsView, HousekeepingView, GuestView, MaintenanceView, AnalyticsView, RoomsView, FinanceView, DashboardView],
    template: `
        <div class="gos-mockup gos-screen">
            <div class="gos-mockup__screen">
                <div class="gos-mockup__bar">
                    <div class="gos-mockup__windows">
                        <span class="gos-mockup__dot" style="background: #f87171"></span>
                        <span class="gos-mockup__dot" style="background: #fbbf24"></span>
                        <span class="gos-mockup__dot" style="background: #34d399"></span>
                    </div>
                    <div class="gos-mockup__title"><i class="pi pi-building" style="color: var(--hos-teal-500)"></i>{{ title }}</div>
                    <span class="gos-pill"><i class="pi pi-circle-fill" style="font-size: 0.5rem"></i>En vivo</span>
                </div>

                @switch (variant) {
                    @case ('reservations') {
                        <bookings-view />
                    }
                    @case ('rooms') {
                        <rooms-view />
                    }
                    @case ('housekeeping') {
                        <housekeeping-view />
                    }
                    @case ('guests') {
                        <guest-view />
                    }
                    @case ('maintenance') {
                        <maintenance-view />
                    }
                    @case ('finance') {
                        <finance-view />
                    }
                    @case ('analytics') {
                        <analytics-view />
                    }
                    @default {
                        <dashboard-view />
                    }
                }
            </div>
        </div>
    `,
    styles: [
        `
            .gos-screen {
                transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
            }
            .gos-screen:hover {
                transform: translateY(-4px) scale(1.01);
            }
        `
    ]
})
export class GosScreenMockup {
    @Input() variant: ScreenVariant = 'dashboard';

    get title(): string {
        const map: Record<ScreenVariant, string> = {
            dashboard: 'Hotel Aurora · Dashboard',
            reservations: 'Hotel Aurora · Reservaciones',
            rooms: 'Hotel Aurora · Habitaciones',
            housekeeping: 'Hotel Aurora · Housekeeping',
            guests: 'Hotel Aurora · Huéspedes',
            maintenance: 'Hotel Aurora · Mantenimiento',
            finance: 'Hotel Aurora · Finanzas',
            analytics: 'Hotel Aurora · Analytics'
        };
        return map[this.variant];
    }
}