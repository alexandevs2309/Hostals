import { Routes } from '@angular/router';
import { AccountShell } from './auth-shell';
import {
    LoginPage,
    RegisterPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    VerifyEmailPage,
    ActivatePage,
    LockScreenPage,
    ErrorPage,
    NotFoundPage,
    ServerErrorPage
} from './pages';

export const ACCOUNT_ROUTES: Routes = [
    // 404 renderiza standalone (sin el shell de autenticación)
    { path: '404', component: NotFoundPage },
    {
        path: '',
        component: AccountShell,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginPage },
            { path: 'register', component: RegisterPage },
            { path: 'forgot-password', component: ForgotPasswordPage },
            { path: 'reset-password', component: ResetPasswordPage },
            { path: 'verify-email', component: VerifyEmailPage },
            { path: 'activate', component: ActivatePage },
            { path: 'lock-screen', component: LockScreenPage },
            { path: 'error', component: ErrorPage },
            { path: '500', component: ServerErrorPage }
        ]
    }
];