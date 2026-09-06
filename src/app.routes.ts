import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Notfound } from './app/pages/notfound/notfound';
import { MARKETING_ROUTES } from './app/features/marketing/marketing.routes';

export const appRoutes: Routes = [
    ...MARKETING_ROUTES,
    {
        path: 'app',
        component: AppLayout,
        children: [
            { path: '', component: Dashboard },
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