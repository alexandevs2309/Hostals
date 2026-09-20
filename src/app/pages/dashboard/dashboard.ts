import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HotelService } from '@/app/core/services/hotel.service';
import { DashboardService, DashboardWidgetsDto, RangeAnalyticsDto } from '@/app/core/services/dashboard.service';
import {
    HotelMetrics,
    BookingRow,
    HousekeepingRoom,
    MaintenanceTicket,
    ChartPoint
} from '@/app/shared/models/hotel.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit, OnDestroy {
    private dashboard = inject(DashboardService);
    private hotels = inject(HotelService);

    readonly today = new Date().toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    hotelName = signal('');
    lastUpdated = signal<Date | null>(null);
    updatedLabel = computed(() => {
        const d = this.lastUpdated();
        return d ? d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '';
    });

    loading = signal(true);
    refreshing = signal(false);
    error = signal<string | null>(null);

    metrics = signal<HotelMetrics>({ rooms: 0, occupancy: 0, revenue: 0, checkIns: 0, availableRooms: 0, adr: 0, revpar: 0 });
    kpis = signal<Record<string, number | undefined>>({});
    bookings = signal<BookingRow[]>([]);
    housekeeping = signal<HousekeepingRoom[]>([]);
    tickets = signal<MaintenanceTicket[]>([]);
    occupancy = signal<ChartPoint[]>([]);
    revenue = signal<ChartPoint[]>([]);
    hkCounts = signal({ clean: 0, pending: 0, inspection: 0, maintenance: 0 });

    rangeFrom = signal('');
    rangeTo = signal('');
    rangeLoading = signal(false);
    rangeAnalytics = signal<RangeAnalyticsDto | null>(null);

    private timer?: ReturnType<typeof setInterval>;

    avgOccupancy = computed(() => {
        const vals = this.occupancy().map(p => p.value);
        if (!vals.length) return 0;
        return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    });

    revenueTotal = computed(() =>
        Math.round(this.revenue().reduce((acc, p) => acc + p.value, 0) ?? 0));

    ngOnInit(): void {
        this.resolveHotel();
        this.timer = setInterval(() => this.refresh(), 60_000);
    }

    ngOnDestroy(): void {
        if (this.timer) clearInterval(this.timer);
    }

    private resolveHotel(): void {
        this.hotels.resolveActiveHotel().subscribe({
            next: (h) => this.hotelName.set(h.name ?? ''),
            error: () => {}
        });
    }

    refresh(): void {
        this.refreshing.set(true);
        const stored = localStorage.getItem('auth_hotel_id');
        if (!stored) {
            this.error.set('No hay una propiedad asociada a tu cuenta todavía.');
            this.loading.set(false);
            this.refreshing.set(false);
            return;
        }
        if (!this.rangeFrom()) {
            const today = new Date();
            const from = new Date();
            from.setDate(from.getDate() - 29);
            this.rangeFrom.set(this.toIso(from));
            this.rangeTo.set(this.toIso(today));
            this.loadRangeAnalytics();
        }
        this.error.set(null);
        forkJoin({
            widgets: this.dashboard.getWidgets().pipe(catchError(() => of(null))),
            kpis: this.dashboard.getKpis().pipe(catchError(() => of(null)))
        }).subscribe(({ widgets, kpis }) => {
            if (!widgets) {
                this.error.set('No se pudieron cargar los datos del dashboard.');
                this.loading.set(false);
                this.refreshing.set(false);
                return;
            }
            this.applyWidgets(widgets, kpis ?? {});
            this.loading.set(false);
            this.refreshing.set(false);
            this.lastUpdated.set(new Date());
        });
    }

    private applyWidgets(w: DashboardWidgetsDto, k: Record<string, number>): void {
        const m = w.metrics;
        this.metrics.set({
            rooms: Math.round(m.totalRooms ?? 0),
            occupiedRooms: Math.round(m.occupiedRooms ?? 0),
            occupancy: Math.round(m.occupancyRate ?? 0),
            revenue: Math.round(m.todayRevenue ?? 0),
            monthlyRevenue: Math.round(m.monthlyRevenue ?? 0),
            checkIns: Math.round(m.checkInsToday ?? 0),
            checkOutsToday: Math.round(m.checkOutsToday ?? 0),
            availableRooms: Math.round(m.availableRooms ?? 0),
            maintenanceRooms: Math.round(m.maintenanceRooms ?? 0),
            adr: Math.round(k['averageDailyRate'] ?? 0),
            revpar: Math.round(k['revenuePerAvailableRoom'] ?? 0)
        });
        this.kpis.set(k);

        this.bookings.set(w.todayBookings.map((b) => ({
            guest: b.guest,
            room: b.room,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            status: this.bookingStatus(b.status),
            amount: b.amount ?? 0
        })));

        const hk = w.housekeeping;
        this.housekeeping.set(hk.rooms.map((r) => ({
            room: r.room,
            status: this.housekeepingStatus(r.status),
            housekeeper: r.housekeeper ?? '',
            priority: this.housekeepingPriority(r.priority)
        })));
        this.hkCounts.set({
            clean: hk.clean ?? 0,
            pending: hk.pending ?? 0,
            inspection: hk.inspection ?? 0,
            maintenance: hk.maintenance ?? 0
        });

        this.tickets.set(w.maintenanceTickets.map((t) => ({
            room: t.room,
            issue: t.issue,
            priority: this.priorityLabel(t.priority),
            assignee: t.assignee ?? '',
            sla: t.sla ?? '',
            status: 'abierto'
        })));

        this.occupancy.set(w.occupancyTrend.map((p) => ({ label: p.label, value: Math.round(p.value ?? 0) })));
        this.revenue.set(w.revenueTrend.map((p) => ({ label: p.label, value: Math.round(p.value ?? 0) })));
    }

    private bookingStatus(status: string): BookingRow['status'] {
        const map: Record<string, BookingRow['status']> = {
            'Pending': 'pendiente',
            'Confirmed': 'confirmada',
            'CheckedIn': 'check-in',
            'CheckedOut': 'check-out',
            'Cancelled': 'pendiente',
            'NoShow': 'pendiente'
        };
        return map[status] ?? 'pendiente';
    }

    private housekeepingStatus(status: string): HousekeepingRoom['status'] {
        const map: Record<string, HousekeepingRoom['status']> = {
            'Dirty': 'pendiente',
            'InProgress': 'pendiente',
            'Inspection': 'inspeccion',
            'Clean': 'limpia',
            'OutOfService': 'mantenimiento'
        };
        return map[status] ?? 'pendiente';
    }

    private housekeepingPriority(priority: string): HousekeepingRoom['priority'] {
        const map: Record<string, HousekeepingRoom['priority']> = {
            'Critical': 'alta',
            'High': 'alta',
            'Medium': 'media',
            'Low': 'baja'
        };
        return map[priority] ?? 'baja';
    }

    private priorityLabel(priority: string): MaintenanceTicket['priority'] {
        const map: Record<string, MaintenanceTicket['priority']> = {
            'Critical': 'critica',
            'High': 'alta',
            'Medium': 'media',
            'Low': 'baja'
        };
        return map[priority] ?? 'baja';
    }

    statusClass(status: string): string {
        const map: Record<string, string> = {
            'check-in':  'hos-badge--occupied',
            'confirmada':'hos-badge--active',
            'pendiente': 'hos-badge--pending',
            'check-out': 'hos-badge--inactive',
        };
        return map[status] ?? '';
    }

    hkDotClass(status: string): string {
        const map: Record<string, string> = {
            'limpia':        'hos-status-dot--clean',
            'pendiente':     'hos-status-dot--dirty',
            'inspeccion':    'hos-status-dot--inspection',
            'mantenimiento': 'hos-status-dot--maintenance',
        };
        return map[status] ?? 'hos-status-dot--maintenance';
    }

    hkBadge(status: string): string {
        const map: Record<string, string> = {
            'limpia':        'hos-badge--clean',
            'pendiente':     'hos-badge--dirty',
            'inspeccion':    'hos-badge--inspection',
            'mantenimiento': 'hos-badge--maintenance',
        };
        return map[status] ?? '';
    }

    priorityClass(p: string): string {
        return `hos-priority--${p}`;
    }

    barPct(value: number): number {
        const max = Math.max(...this.revenue().map(r => r.value));
        if (max <= 0) return 0;
        return Math.max(3, Math.round((value / max) * 100));
    }

    private toIso(d: Date): string {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    loadRangeAnalytics(): void {
        if (!this.rangeFrom() || !this.rangeTo()) {
            return;
        }
        this.rangeLoading.set(true);
        this.dashboard.getRangeAnalytics(this.rangeFrom(), this.rangeTo())
            .pipe(catchError(() => of(null)))
            .subscribe({
                next: (r) => this.rangeAnalytics.set(r),
                error: () => this.rangeLoading.set(false),
                complete: () => this.rangeLoading.set(false)
            });
    }

    rangeBarPct(value: number): number {
        const a = this.rangeAnalytics();
        const max = Math.max(...(a?.occupancySeries ?? []).map((p) => p.value));
        if (max <= 0) return 0;
        return Math.max(4, Math.round((value / max) * 100));
    }
}