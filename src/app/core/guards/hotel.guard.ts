import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '@/app/core/services/auth.service';
import { HotelService } from '@/app/core/services/hotel.service';

// Asegura que el usuario tenga una propiedad activa.
// Si no tiene hotelId, adopta la primera propiedad del sistema; si no existe ninguna,
// redirige a la pantalla de configuración inicial (/app/no-hotel).
export const requiresHotelGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
    const auth = inject(AuthService);
    const hotels = inject(HotelService);
    const router = inject(Router);

    const user = auth.getCachedUser();
    const storedHotelId = localStorage.getItem('auth_hotel_id') || user?.hotelId;
    if (storedHotelId) {
        return of(true);
    }

    return hotels.resolveActiveHotel().pipe(
        map((hotel) => {
            localStorage.setItem('auth_hotel_id', hotel.id);
            return true;
        }),
        catchError(() => of(router.createUrlTree(['/app/no-hotel'])))
    );
};