import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, firstValueFrom } from 'rxjs';
import { RoomService } from '@/app/core/services/room.service';
import { DashboardService, MaintenanceTicketDto } from '@/app/core/services/dashboard.service';
import { HotelService } from '@/app/core/services/hotel.service';

const PRIORITY_LABEL: Record<string, string> = {
    Critical: 'Crítica',
    High: 'Alta',
    Medium: 'Media',
    Low: 'Baja'
};

const STATUS_LABEL: Record<string, string> = {
    open: 'Abiertos',
    inprogress: 'En progreso',
    resolved: 'Resueltos',
    closed: 'Cerrados'
};

const FILTERS = ['open', 'inprogress', 'resolved', 'closed'] as const;

@Component({
    selector: 'app-maintenance',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './maintenance.html',
    styleUrl: './maintenance.scss'
})
export class MaintenancePage implements OnInit {
    private dashboardApi = inject(DashboardService);
    private roomsApi = inject(RoomService);
    private hotelsApi = inject(HotelService);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    tickets = signal<MaintenanceTicketDto[]>([]);
    all = signal<MaintenanceTicketDto[]>([]);
    filter = signal<(typeof FILTERS)[number]>('open');
    loading = signal(true);
    error = signal<string | null>(null);
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);

    filters = FILTERS;

    filtered = computed(() => {
        const f = this.filter();
        if (f === 'resolved' || f === 'closed') {
            return this.all().filter((t) => t.status.toLowerCase() === f);
        }
        return this.tickets().filter((t) => {
            const s = t.status.toLowerCase();
            if (f === 'inprogress') return s === 'inprogress' || s === 'onhold' || s === 'open';
            return s === 'open';
        });
    });

    counts = computed(() => {
        const count = (vals: string[]): number => this.all().filter((t) => vals.includes(t.status.toLowerCase())).length;
        return {
            open: count(['open']),
            inprogress: count(['inprogress', 'onhold']),
            resolved: count(['resolved']),
            closed: count(['closed'])
        };
    });

    ngOnInit(): void {
        this.resolveHotel();
    }

    private resolveHotel(): void {
        const stored = localStorage.getItem('auth_hotel_id');
        if (stored) {
            this.hotelsApi.getHotelById(stored).subscribe({
                next: (h) => {
                    this.hotelId.set(h.id);
                    this.hotelName.set(h.name);
                    this.load();
                },
                error: () => this.load()
            });
            return;
        }
        this.hotelsApi.getHotels({ pageNumber: 1, pageSize: 1 }).subscribe({
            next: (page) => {
                const h = page.items[0];
                if (h) {
                    this.hotelId.set(h.id);
                    this.hotelName.set(h.name);
                }
                this.load();
            },
            error: () => this.load()
        });
    }

    private load(): void {
        this.loading.set(true);
        this.error.set(null);
        forkJoin({
            open: this.dashboardApi.getMaintenanceTickets('open', 50),
            inprogress: this.dashboardApi.getMaintenanceTickets('inprogress', 50),
            resolved: this.dashboardApi.getMaintenanceTickets('resolved', 50),
            closed: this.dashboardApi.getMaintenanceTickets('closed', 50)
        }).subscribe({
            next: ({ open, inprogress, resolved, closed }) => {
                this.tickets.set([...open, ...inprogress]);
                this.all.set([...open, ...inprogress, ...resolved, ...closed]);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.error.set('No se pudieron cargar los tickets de mantenimiento.');
            }
        });
    }

    setFilter(f: (typeof FILTERS)[number]): void {
        this.filter.set(f);
    }

    complete(t: MaintenanceTicketDto): void {
        if (!t.roomId) return;
        this.busy.set(true);
        this.msg.set('');
        firstValueFrom(this.roomsApi.completeMaintenance(t.roomId))
            .then(() => {
                this.msg.set(`Ticket de la habitación ${t.room} completado.`);
                this.msgError.set(false);
                this.load();
            })
            .catch((e) => {
                this.msg.set(e?.error ?? 'No se pudo completar el ticket.');
                this.msgError.set(true);
            })
            .finally(() => this.busy.set(false));
    }

    priorityLabel(p: string): string {
        return PRIORITY_LABEL[p] ?? p;
    }

    statusLabel(s: string): string {
        return STATUS_LABEL[(s ?? '').toLowerCase()] ?? s;
    }

    retry(): void {
        this.load();
    }
}