import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/app/core/services/auth.service';
import { Role, hasAnyRole } from '@/app/core/auth/roles';

// Controla acceso por rol. Requiere ir precedido de authGuard (ruta padre).
// Uso: { path: 'x', component: X, data: { roles: ['Admin', 'Manager'] }, canActivate: [roleGuard] }
export const roleGuard: CanActivateFn = (route) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const allowed = route.data?.['roles'] as Role[] | undefined;
    const user = auth.getCachedUser();

    if (hasAnyRole(user?.roles ?? [], allowed)) {
        return true;
    }

    return router.createUrlTree(['/account/403']);
};