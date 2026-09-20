import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { RoomsPage } from './app/pages/rooms/rooms';
import { RoomTypesPage } from './app/pages/room-types/room-types';
import { WebsitesPage } from './app/pages/websites/websites';
import { MARKETING_ROUTES } from './app/features/marketing/marketing.routes';
import { authGuard } from './app/core/guards/auth.guard';
import { roleGuard } from './app/core/guards/role.guard';
import { requiresHotelGuard } from './app/core/guards/hotel.guard';
import { NoHotelPage } from './app/pages/no-hotel/no-hotel';
import { PublicSite } from './app/pages/public-site/public-site';
import { AuditPage } from './app/pages/audit/audit';
import { SecurityPage } from './app/pages/security/security';
import { SettingsPage } from './app/pages/settings/settings';
import { MaintenancePage } from './app/pages/maintenance/maintenance';
import { HousekeepingPage } from './app/pages/housekeeping/housekeeping';
import { AnalyticsPage } from './app/pages/analytics/analytics';
import { ReservationsPage } from './app/pages/reservations/reservations';
import { CalendarPage } from './app/pages/calendar/calendar';
import { GuestsPage } from './app/pages/guests/guests';
import { FinancePage } from './app/pages/finance/finance';
import { RatesPage } from './app/pages/rates/rates';
import { OnboardingPage } from './app/pages/onboarding/onboarding';
import { ChannelsPage } from './app/pages/channels/channels';
import { WorkflowsPage } from './app/pages/workflows/workflows';
import { OrganizationPage } from './app/pages/organization/organization';

export const appRoutes: Routes = [
    ...MARKETING_ROUTES,
    {
        path: 'app',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            // ── Módulos PMS (requieren propiedad activa) ────────────────
            { path: '',              component: Dashboard,          data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'hotel',         redirectTo: '/app/settings', pathMatch: 'full' },
            { path: 'reservations',  component: ReservationsPage,   data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'calendar',      component: CalendarPage,       data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'rooms',         component: RoomsPage,          data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'room-types',    component: RoomTypesPage,      data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'websites',      component: WebsitesPage,       data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'rates',         component: RatesPage,          data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'channels',      component: ChannelsPage,       data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'workflows',     component: WorkflowsPage,      data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'guests',        component: GuestsPage,         data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'housekeeping',  component: HousekeepingPage,   data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'maintenance',   component: MaintenancePage,    data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            { path: 'finance',       component: FinancePage,        data: { roles: ['Admin', 'Manager'], requiresHotel: true }, canActivate: [roleGuard, requiresHotelGuard] },
            { path: 'analytics',     component: AnalyticsPage,      data: { roles: ['Admin', 'Manager'], requiresHotel: true }, canActivate: [roleGuard, requiresHotelGuard] },
            { path: 'settings',      component: SettingsPage,       data: { roles: ['Admin'], requiresHotel: true }, canActivate: [roleGuard, requiresHotelGuard] },
            { path: 'audit',         component: AuditPage,          data: { roles: ['Admin'], requiresHotel: true }, canActivate: [roleGuard, requiresHotelGuard] },
            { path: 'security',      component: SecurityPage,       data: { requiresHotel: true }, canActivate: [requiresHotelGuard] },
            // ── Flujo de configuración (NO requieren propiedad) ──────────
            { path: 'onboarding',    component: OnboardingPage },
            { path: 'no-hotel',      component: NoHotelPage },
            { path: 'organization',  component: OrganizationPage,   data: { roles: ['Admin'] }, canActivate: [roleGuard] }
        ]
    },
    {
        path: 'account',
        loadChildren: () => import('./app/features/account/account.routes').then((m) => m.ACCOUNT_ROUTES)
    },
    { path: 'landing', redirectTo: '/', pathMatch: 'full' },
    { path: 's/:slug', component: PublicSite },
    { path: 'legal', loadChildren: () => import('./app/pages/legal/legal.routes') },
    { path: '**', redirectTo: '/account/404' }
];