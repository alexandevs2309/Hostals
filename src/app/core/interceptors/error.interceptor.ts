import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService, { optional: true });

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 0) {
                messageService?.add({
                    severity: 'error',
                    summary: 'Sin conexión',
                    detail: 'No se pudo conectar con el servidor. Verifica tu conexión.',
                    life: 5000
                });
            } else if (error.status === 403) {
                messageService?.add({
                    severity: 'error',
                    summary: 'Acceso denegado',
                    detail: 'No tienes permisos para realizar esta acción.',
                    life: 5000
                });
            } else if (error.status === 404) {
                messageService?.add({
                    severity: 'warn',
                    summary: 'No encontrado',
                    detail: error.error?.message ?? 'El recurso solicitado no existe.',
                    life: 5000
                });
            } else if (error.status >= 500) {
                messageService?.add({
                    severity: 'error',
                    summary: 'Error del servidor',
                    detail: 'Ocurrió un error inesperado. Intenta de nuevo más tarde.',
                    life: 5000
                });
            } else if (error.status === 400) {
                const msg = error.error?.message ?? error.error?.title ?? 'Solicitud inválida';
                messageService?.add({
                    severity: 'warn',
                    summary: 'Error de validación',
                    detail: msg,
                    life: 5000
                });
            }

            return throwError(() => error);
        })
    );
};