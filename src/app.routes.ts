import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Notfound } from './app/pages/notfound/notfound';
import { ComingSoonPage } from './app/pages/coming-soon/coming-soon';
import { RoomsPage } from './app/pages/rooms/rooms';
import { MARKETING_ROUTES } from './app/features/marketing/marketing.routes';
import { authGuard } from './app/core/guards/auth.guard';

export const appRoutes: Routes = [
    ...MARKETING_ROUTES,
    {
        path: 'app',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', component: Dashboard },
            // ── Módulos PMS (en desarrollo) ──────────────────────────
            { path: 'reservations', component: ComingSoonPage, data: { module: 'reservations' } },
            { path: 'rooms',        component: RoomsPage },
            { path: 'guests',       component: ComingSoonPage, data: { module: 'guests'       } },
            { path: 'housekeeping', component: ComingSoonPage, data: { module: 'housekeeping' } },
            { path: 'maintenance',  component: ComingSoonPage, data: { module: 'maintenance'  } },
            { path: 'finance',      component: ComingSoonPage, data: { module: 'finance'      } },
            { path: 'analytics',    component: ComingSoonPage, data: { module: 'analytics'    } },
            { path: 'settings',     component: ComingSoonPage, data: { module: 'settings'     } },
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