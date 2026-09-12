import { Routes } from '@angular/router';
import { AccountShell } from './auth-shell';
import { authGuard } from '@/app/core/guards/auth.guard';
import {
    LoginPage,
    TwoFactorPage,
    RegisterPage,
    ForgotPasswordPage,
    ResetPasswordPage,
    VerifyEmailPage,
    ActivatePage,
    LockScreenPage,
    ChangePasswordPage,
    ErrorPage,
    NotFoundPage,
    ServerErrorPage,
    AccessDeniedPage
} from './pages';

/** Guard del paso 2FA: solo se accede si hay un segundo factor pendiente. */
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@/app/core/services/auth.service';

export const pendingTwoFactorGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    return auth.hasPendingTwoFactor() ? true : router.createUrlTree(['/account/login']);
};

export const ACCOUNT_ROUTES: Routes = [
    // 404 renderiza standalone (sin el shell de autenticación)
    { path: '404', component: NotFoundPage },
    // 403 renderiza standalone (sin el shell de autenticación)
    { path: '403', component: AccessDeniedPage },
    {
        path: '',
        component: AccountShell,
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: LoginPage },
            { path: 'two-factor', component: TwoFactorPage, canActivate: [pendingTwoFactorGuard] },
            { path: 'register', component: RegisterPage },
            { path: 'forgot-password', component: ForgotPasswordPage },
            { path: 'reset-password', component: ResetPasswordPage },
            { path: 'verify-email', component: VerifyEmailPage },
            { path: 'activate', component: ActivatePage },
            { path: 'lock-screen', component: LockScreenPage },
            { path: 'change-password', component: ChangePasswordPage, canActivate: [authGuard] },
            { path: 'error', component: ErrorPage },
            { path: '500', component: ServerErrorPage }
        ]
    }
];