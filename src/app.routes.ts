import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Notfound } from './app/pages/notfound/notfound';
import { ComingSoonPage } from './app/pages/coming-soon/coming-soon';
import { RoomsPage } from './app/pages/rooms/rooms';
import { MARKETING_ROUTES } from './app/features/marketing/marketing.routes';
import { authGuard } from './app/core/guards/auth.guard';
import { roleGuard } from './app/core/guards/role.guard';
import { requiresHotelGuard } from './app/core/guards/hotel.guard';
import { NoHotelPage } from './app/pages/no-hotel/no-hotel';
import { AuditPage } from './app/pages/audit/audit';
import { SecurityPage } from './app/pages/security/security';
import { HotelPage } from './app/pages/hotel/hotel';
import { MaintenancePage } from './app/pages/maintenance/maintenance';
import { HousekeepingPage } from './app/pages/housekeeping/housekeeping';
import { AnalyticsPage } from './app/pages/analytics/analytics';
import { ReservationsPage } from './app/pages/reservations/reservations';
import { GuestsPage } from './app/pages/guests/guests';
import { FinancePage } from './app/pages/finance/finance';
import { RatesPage } from './app/pages/rates/rates';
import { OnboardingPage } from './app/pages/onboarding/onboarding';

export const appRoutes: Routes = [
    ...MARKETING_ROUTES,
    {
        path: 'app',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'hotel', component: HotelPage },
            // ── Módulos PMS (en desarrollo) ──────────────────────────
            { path: 'reservations', component: ReservationsPage },
            { path: 'rooms',        component: RoomsPage },
            { path: 'rates',        component: RatesPage },
            { path: 'onboarding',   component: OnboardingPage },
            { path: 'guests',       component: GuestsPage },
            { path: 'housekeeping', component: HousekeepingPage },
            { path: 'maintenance',  component: MaintenancePage },
            { path: 'finance',      component: FinancePage, data: { roles: ['Admin', 'Manager'], requiresHotel: true }, canActivate: [roleGuard, requiresHotelGuard] },
            { path: 'analytics',    component: AnalyticsPage, data: { roles: ['Admin', 'Manager'] }, canActivate: [roleGuard] },
            { path: 'settings',     component: HotelPage, data: { roles: ['Admin'] }, canActivate: [roleGuard] },
            { path: 'no-hotel',     component: NoHotelPage },
            { path: 'audit',        component: AuditPage, data: { roles: ['Admin'] }, canActivate: [roleGuard] },
            { path: 'security',     component: SecurityPage },
            // ── Sakai demos ──────────────────────────────────────────
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    {
        path: 'account',
        loadChildren: () => import('./app/features/account/account.routes').then((m) => m.ACCOUNT_ROUTES)
    },
    { path: 'landing', redirectTo: '/', pathMatch: 'full' },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'legal', loadChildren: () => import('./app/pages/legal/legal.routes') },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/account/404' }
];