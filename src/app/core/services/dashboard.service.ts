import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface MetricsDto {
    totalRooms: number;
    occupiedRooms: number;
    availableRooms: number;
    maintenanceRooms: number;
    occupancyRate: number;
    todayRevenue: number;
    monthlyRevenue: number;
    checkInsToday: number;
    checkOutsToday: number;
}

export interface BookingRowDto {
    guest: string;
    room: string;
    checkIn: string;
    checkOut: string;
    status: string;
    amount: number;
}

export interface HousekeepingRoomDto {
    room: string;
    status: string;
    housekeeper: string;
    priority: string;
}

export interface HousekeepingStatusDto {
    clean: number;
    pending: number;
    inspection: number;
    maintenance: number;
    rooms: HousekeepingRoomDto[];
}

export interface MaintenanceTicketDto {
    ticketId?: string;
    roomId?: string;
    room: string;
    issue: string;
    priority: string;
    assignee: string;
    sla: string;
    status: string;
    createdAt?: string;
}

export interface ChartPointDto {
    label: string;
    value: number;
}

export interface DashboardWidgetsDto {
    metrics: MetricsDto;
    todayBookings: BookingRowDto[];
    housekeeping: HousekeepingStatusDto;
    maintenanceTickets: MaintenanceTicketDto[];
    occupancyTrend: ChartPointDto[];
    revenueTrend: ChartPointDto[];
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private baseUrl = environment.dashboardApiUrl;

    constructor(private http: HttpClient) {}

    private merchantParams(params: HttpParams = new HttpParams()): HttpParams {
        const hotelId = localStorage.getItem('auth_hotel_id');
        return hotelId ? params.set('hotelId', hotelId) : params;
    }

    getMetrics(): Observable<MetricsDto> {
        return this.http.get<Record<string, number>>(`${this.baseUrl}/metrics`, { params: this.merchantParams() }).pipe(
            map((raw) => ({
                totalRooms: raw['TotalRooms'] ?? raw['totalRooms'] ?? 0,
                occupiedRooms: raw['OccupiedRooms'] ?? raw['occupiedRooms'] ?? 0,
                availableRooms: raw['AvailableRooms'] ?? raw['availableRooms'] ?? 0,
                maintenanceRooms: raw['MaintenanceRooms'] ?? raw['maintenanceRooms'] ?? 0,
                occupancyRate: raw['OccupancyRate'] ?? raw['occupancyRate'] ?? 0,
                todayRevenue: raw['TodayRevenue'] ?? raw['todayRevenue'] ?? 0,
                monthlyRevenue: raw['MonthlyRevenue'] ?? raw['monthlyRevenue'] ?? 0,
                checkInsToday: raw['CheckInsToday'] ?? raw['checkInsToday'] ?? 0,
                checkOutsToday: raw['CheckOutsToday'] ?? raw['checkOutsToday'] ?? 0
            }))
        );
    }

    getKpis(): Observable<Record<string, number>> {
        return this.http.get<Record<string, number>>(`${this.baseUrl}/kpis`, { params: this.merchantParams() }).pipe(
            map((raw) => {
                const camel: Record<string, number> = {};
                for (const [key, value] of Object.entries(raw)) {
                    camel[key[0].toLowerCase() + key.slice(1)] = value;
                }
                return camel;
            })
        );
    }

    getTodayBookings(limit = 8): Observable<BookingRowDto[]> {
        const params = this.merchantParams(new HttpParams().set('limit', limit.toString()));
        return this.http.get<BookingRowDto[]>(`${this.baseUrl}/bookings/today`, { params });
    }

    getHousekeepingStatus(): Observable<HousekeepingStatusDto> {
        return this.http.get<HousekeepingStatusDto>(`${this.baseUrl}/housekeeping/status`, { params: this.merchantParams() });
    }

    getMaintenanceTickets(status = 'open', limit = 6): Observable<MaintenanceTicketDto[]> {
        const params = this.merchantParams(new HttpParams()
            .set('status', status)
            .set('limit', limit.toString()));
        return this.http.get<MaintenanceTicketDto[]>(`${this.baseUrl}/maintenance/tickets`, { params });
    }

    getOccupancyTrend(period = 'week'): Observable<ChartPointDto[]> {
        const params = this.merchantParams(new HttpParams().set('period', period));
        return this.http.get<ChartPointDto[]>(`${this.baseUrl}/analytics/occupancy`, { params });
    }

    getRevenueTrend(period = 'year'): Observable<ChartPointDto[]> {
        const params = this.merchantParams(new HttpParams().set('period', period));
        return this.http.get<ChartPointDto[]>(`${this.baseUrl}/analytics/revenue`, { params });
    }

    getWidgets(): Observable<DashboardWidgetsDto> {
        interface WidgetsPayload {
            metrics?: Record<string, number>;
            todayBookings?: BookingRowDto[];
            housekeepingStatus?: HousekeepingStatusDto;
            maintenanceTickets?: MaintenanceTicketDto[];
            occupancyTrend?: ChartPointDto[];
            revenueTrend?: ChartPointDto[];
        }
        return this.http.get<WidgetsPayload>(`${this.baseUrl}/widgets`, { params: this.merchantParams() }).pipe(
            map((raw) => {
                const m = raw.metrics ?? {};
                return {
                    metrics: {
                        totalRooms: m['totalRooms'] ?? 0,
                        occupiedRooms: m['occupiedRooms'] ?? 0,
                        availableRooms: m['availableRooms'] ?? 0,
                        maintenanceRooms: m['maintenanceRooms'] ?? 0,
                        occupancyRate: m['occupancyRate'] ?? 0,
                        todayRevenue: m['todayRevenue'] ?? 0,
                        monthlyRevenue: m['monthlyRevenue'] ?? 0,
                        checkInsToday: m['checkInsToday'] ?? 0,
                        checkOutsToday: m['checkOutsToday'] ?? 0
                    },
                    todayBookings: raw.todayBookings ?? [],
                    housekeeping: raw.housekeepingStatus ?? { clean: 0, pending: 0, inspection: 0, maintenance: 0, rooms: [] },
                    maintenanceTickets: raw.maintenanceTickets ?? [],
                    occupancyTrend: raw.occupancyTrend ?? [],
                    revenueTrend: raw.revenueTrend ?? []
                };
            })
        );
    }
}