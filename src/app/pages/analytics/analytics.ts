import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { DashboardService, ChartPointDto } from '@/app/core/services/dashboard.service';

type Period = 'week' | 'month' | 'year';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './analytics.html',
    styleUrl: './analytics.scss'
})
export class AnalyticsPage implements OnInit {
    private dashboardApi = inject(DashboardService);

    kpis = signal<Record<string, number>>({});
    occupancy = signal<ChartPointDto[]>([]);
    revenue = signal<ChartPointDto[]>([]);
    period = signal<Period>('week');
    loading = signal(true);
    error = signal<string | null>(null);

    maxOcc = computed(() => Math.max(...this.occupancy().map((p) => Number(p.value)), 0));
    maxRev = computed(() => Math.max(...this.revenue().map((p) => Number(p.value)), 0));

    periods: { value: Period; label: string }[] = [
        { value: 'week', label: 'Semana' },
        { value: 'month', label: 'Mes' },
        { value: 'year', label: 'Año' }
    ];

    barHeight = (value: number, max: number): string => {
        if (max <= 0 || value <= 0) return '4px';
        const pct = Math.max(6, Math.round((value / max) * 100));
        return pct + '%';
    };

    fmtKpi(key: string): string {
        const v = this.kpis()[key] ?? 0;
        if (key.toLowerCase().includes('rate') || key.toLowerCase().includes('occupancy')) {
            return v + ' %';
        }
        if (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('adr') || key.toLowerCase().includes('revpar')) {
            return '$' + Number(v).toLocaleString('en-US', { maximumFractionDigits: 2 });
        }
        return Number(v).toLocaleString('en-US');
    }

    kpiLabel(key: string): string {
        const map: Record<string, string> = {
            OccupancyRate: 'Ocupación',
            AverageDailyRate: 'Tarifa media (ADR)',
            RevenuePerAvailableRoom: 'RevPAR',
            TotalRevenue: 'Ingresos totales',
            CheckInsToday: 'Check-ins hoy',
            CheckOutsToday: 'Check-outs hoy',
            PendingBookings: 'Reservas pendientes',
            OpenTickets: 'Tickets abiertos',
            TotalBookings: 'Reservas totales'
        };
        return map[key] ?? key.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    ngOnInit(): void {
        this.load();
    }

    setPeriod(p: Period): void {
        this.period.set(p);
        this.load();
    }

    private load(): void {
        this.loading.set(true);
        this.error.set(null);
        forkJoin({
            kpis: this.dashboardApi.getKpis(),
            occupancy: this.dashboardApi.getOccupancyTrend(this.period()),
            revenue: this.dashboardApi.getRevenueTrend(this.period())
        }).subscribe({
            next: ({ kpis, occupancy, revenue }) => {
                this.kpis.set(kpis);
                this.occupancy.set(occupancy);
                this.revenue.set(revenue);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.error.set('No se pudieron cargar los datos de analytics.');
            }
        });
    }

    retry(): void {
        this.load();
    }
}