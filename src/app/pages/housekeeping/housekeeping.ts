import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, firstValueFrom } from 'rxjs';
import { HotelService } from '@/app/core/services/hotel.service';
import { RoomService, Room } from '@/app/core/services/room.service';
import { DashboardService, HousekeepingStatusDto } from '@/app/core/services/dashboard.service';

@Component({
    selector: 'app-housekeeping',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './housekeeping.html',
    styleUrl: './housekeeping.scss'
})
export class HousekeepingPage implements OnInit {
    private hotelsApi = inject(HotelService);
    private roomsApi = inject(RoomService);
    private dashboardApi = inject(DashboardService);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    rooms = signal<Room[]>([]);
    hk = signal<HousekeepingStatusDto | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);
    filter = signal<'todas' | 'dirty' | 'clean'>('todas');

    filtered = computed(() => {
        const f = this.filter();
        if (f === 'dirty') return this.rooms().filter((r) => !r.isClean);
        if (f === 'clean') return this.rooms().filter((r) => r.isClean);
        return this.rooms();
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
        const id = this.hotelId();
        if (!id) return;
        this.loading.set(true);
        this.error.set(null);
        forkJoin({
            rooms: this.roomsApi.getHotelRooms(id),
            hk: this.dashboardApi.getHousekeepingStatus()
        }).subscribe({
            next: ({ rooms, hk }) => {
                this.rooms.set(rooms);
                this.hk.set(hk);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.error.set('No se pudieron cargar los datos de housekeeping.');
            }
        });
    }

    setFilter(f: 'todas' | 'dirty' | 'clean'): void {
        this.filter.set(f);
    }

    markDirty(room: Room): void {
        this.act(() => firstValueFrom(this.roomsApi.markRoomAsDirty(room.id)));
    }

    markClean(room: Room): void {
        this.act(() => firstValueFrom(this.roomsApi.markRoomAsClean(room.id)));
    }

    private act(fn: () => Promise<unknown>): void {
        this.busy.set(true);
        this.msg.set('');
        fn().then(() => {
            this.msg.set('Estado actualizado.');
            this.msgError.set(false);
            this.load();
        }).catch((e) => {
            this.msg.set(e?.error ?? 'La operación falló.');
            this.msgError.set(true);
            this.load();
        }).finally(() => this.busy.set(false));
    }

    retry(): void {
        this.load();
    }
}