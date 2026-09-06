import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from './api.config';
import { ModuleContent } from '@/app/shared/models/hotel.model';

/**
 * Servicio de datos de la plataforma.
 *
 * Todos los métodos usan HttpClient y apuntan a los endpoints documentados
 * en `API` / `mock.data.ts`. Sin backend real, el `MockApiInterceptor`
 * responde con datos de ejemplo; con backend, solo cambia la base URL.
 */
@Injectable({ providedIn: 'root' })
export class ModulesApiService {
    constructor(private http: HttpClient) {}

    /** Contenido y preview de un módulo del PMS (GET /api/v1/modules/:id). */
    getModulePreview(moduleId: string): Observable<ModuleContent> {
        return this.http.get<ModuleContent>(API.module(moduleId));
    }

    /** Métricas globales del hotel activo. */
    getMetrics(hotelId = 'demo') {
        return this.http.get(API.metrics(hotelId));
    }

    /** Reservaciones del hotel (hoy). */
    getBookings(hotelId = 'demo') {
        return this.http.get(API.bookings(hotelId));
    }

    /** Estado de habitaciones para housekeeping. */
    getHousekeepingRooms(hotelId = 'demo') {
        return this.http.get(API.housekeepingRooms(hotelId));
    }

    /** Tickets de mantenimiento abiertos. */
    getMaintenanceTickets(hotelId = 'demo') {
        return this.http.get(API.maintenanceTickets(hotelId));
    }

    /** Tendencia de ocupación semanal. */
    getOccupancyTrend(hotelId = 'demo') {
        return this.http.get(API.occupancyTrend(hotelId));
    }

    /** Tendencia de ingresos mensuales. */
    getRevenueTrend(hotelId = 'demo') {
        return this.http.get(API.revenueTrend(hotelId));
    }
}