import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, firstValueFrom } from 'rxjs';
import { HotelService, RoomTypeDto } from '@/app/core/services/hotel.service';
import { RoomService, Room, RoomType } from '@/app/core/services/room.service';
import { DashboardService, MaintenanceTicketDto } from '@/app/core/services/dashboard.service';

const STATUS_LABEL: Record<string, string> = {
    Available: 'Disponible',
    Occupied: 'Ocupada',
    OutOfOrder: 'Fuera de servicio',
    Housekeeping: 'En limpieza',
    Maintenance: 'Mantenimiento',
    Inspected: 'Lista',
    Dirty: 'Sucio'
};

@Component({
    selector: 'app-rooms',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './rooms.html',
    styleUrl: './rooms.scss'
})
export class RoomsPage implements OnInit {
    private roomsApi = inject(RoomService);
    private hotelsApi = inject(HotelService);
    private dashboardApi = inject(DashboardService);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    rooms = signal<Room[]>([]);
    roomTypes = signal<RoomTypeDto[]>([]);
    tickets = signal<MaintenanceTicketDto[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);

    filterStatus = signal('Todos');
    search = signal('');
    showCreate = signal(false);
    showMaintenance = signal(false);
    maintenanceRoom = signal<Room | null>(null);
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);

    filtered = computed(() => {
        const q = this.search().trim().toLowerCase();
        let list = this.rooms();
        if (this.filterStatus() !== 'Todos') {
            list = list.filter((r) => r.status === this.filterStatus());
        }
        if (q) {
            list = list.filter(
                (r) =>
                    r.roomNumber.toLowerCase().includes(q) ||
                    (r.roomTypeName || '').toLowerCase().includes(q) ||
                    String(r.floor).includes(q)
            );
        }
        return list;
    });

    stats = computed(() => {
        const rooms = this.rooms();
        const total = rooms.length;
        const available = rooms.filter((r) => r.status === 'Available' && !r.isMaintenanceRequired).length;
        const occupied = rooms.filter((r) => r.status === 'Occupied').length;
        const maintenance = rooms.filter((r) => r.status === 'Maintenance' || r.isMaintenanceRequired).length;
        const dirty = rooms.filter((r) => !r.isClean).length;
        const clean = rooms.filter((r) => r.isClean).length;
        const avgPrice = total ? Math.round((rooms.reduce((a, r) => a + r.price, 0) / total) * 100) / 100 : 0;
        const occupancyRate = total ? Math.round(((total - available - maintenance) / total) * 1000) / 10 : 0;
        return { total, available, occupied, maintenance, dirty, clean, avgPrice, occupancyRate };
    });

    statusOptions = ['Todos', 'Available', 'Occupied', 'Housekeeping', 'Maintenance', 'Dirty'];

    countByStatus = computed(() => {
        const counts: Record<string, number> = {};
        for (const r of this.rooms()) {
            counts[r.status] = (counts[r.status] ?? 0) + 1;
        }
        return counts;
    });

    // Formulario de nueva habitación
    form = {
        roomNumber: '',
        floor: 1,
        roomTypeId: '',
        price: 0,
        maxOccupancy: 2,
        description: ''
    };

    maint = { description: '', priority: 'Medium' };

    ngOnInit(): void {
        this.resolveHotel();
    }

    private resolveHotel(): void {
        const stored = localStorage.getItem('auth_hotel_id');
        const onHotel = (hotel: { id: string; name: string }): void => {
            this.hotelId.set(hotel.id);
            this.hotelName.set(hotel.name);
            this.load();
        };

        if (stored) {
            this.hotelsApi.getHotelById(stored).subscribe({
                next: onHotel,
                error: () => this.fail('No se pudo cargar la propiedad. Vuelve a iniciar sesión.')
            });
            return;
        }

        this.hotelsApi.getHotels({ pageNumber: 1, pageSize: 1 }).subscribe({
            next: (page) => {
                const hotel = page.items[0];
                if (hotel) {
                    onHotel(hotel);
                } else {
                    this.fail('No hay ninguna propiedad configurada todavía.');
                }
            },
            error: () => this.fail('No se pudo cargar la propiedad.')
        });
    }

    private load(): void {
        const id = this.hotelId();
        if (!id) return;
        this.loading.set(true);
        this.error.set(null);
        forkJoin({
            rooms: this.roomsApi.getHotelRooms(id),
            types: this.hotelsApi.getHotelRoomTypes(id),
            tickets: this.dashboardApi.getMaintenanceTickets('open')
        }).subscribe({
            next: ({ rooms, types, tickets }) => {
                this.rooms.set(rooms);
                this.roomTypes.set(types);
                this.tickets.set(tickets);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.fail('No se pudieron cargar las habitaciones del hotel.');
            }
        });
    }

    private fail(message: string): void {
        this.error.set(message);
        this.loading.set(false);
    }

    statusLabel(s: string): string {
        return STATUS_LABEL[s] ?? s;
    }

    statusClass(s: string): string {
        return 'badge--' + (STATUS_LABEL[s] ? s.toLowerCase() : 'x');
    }

    retry(): void {
        const id = this.hotelId();
        if (id) this.load();
        else this.resolveHotel();
    }

    setFilter(s: string): void {
        this.filterStatus.set(s);
    }

    // ── Acciones por habitación ────────────────────────────────
    private act(fn: () => Promise<unknown>): void {
        this.busy.set(true);
        this.msg.set('');
        fn().then(() => {
            this.msg.set('Habitación actualizada correctamente.');
            this.msgError.set(false);
            this.load();
        }).catch((e) => {
            this.msg.set(e?.error ?? 'La operación falló. Intenta de nuevo.');
            this.msgError.set(true);
            this.load();
        }).finally(() => this.busy.set(false));
    }

    setAvailable(room: Room): void {
        this.act(() => firstValueFrom(this.roomsApi.updateRoomStatus(room.id, {
            status: 'Available',
            isClean: true,
            isMaintenanceRequired: false
        })));
    }

    markDirty(room: Room): void {
        this.act(() => firstValueFrom(this.roomsApi.markRoomAsDirty(room.id)));
    }

    markClean(room: Room): void {
        this.act(() => firstValueFrom(this.roomsApi.markRoomAsClean(room.id)));
    }

    completeMaintenance(room: Room): void {
        this.act(() => firstValueFrom(this.roomsApi.completeMaintenance(room.id)));
    }

    completeTicket(t: MaintenanceTicketDto): void {
        if (!t.roomId) return;
        this.act(() => firstValueFrom(this.roomsApi.completeMaintenance(t.roomId!)));
    }

    priorityClass(p: string): string {
        return 'tick--' + (p ?? '').toLowerCase();
    }

    priorityLabel(p: string): string {
        const map: Record<string, string> = {
            Critical: 'Crítica',
            High: 'Alta',
            Medium: 'Media',
            Low: 'Baja'
        };
        return map[p] ?? p;
    }

    openMaintenance(room: Room): void {
        this.maintenanceRoom.set(room);
        this.maint = { description: '', priority: 'Medium' };
        this.showMaintenance.set(true);
    }

    submitMaintenance(): void {
        const room = this.maintenanceRoom();
        if (!room || !this.maint.description.trim()) return;
        this.showMaintenance.set(false);
        this.act(() => firstValueFrom(this.roomsApi.requestMaintenance(room.id, {
            description: this.maint.description.trim(),
            priority: this.maint.priority
        })));
    }

    openCreate(): void {
        const first = this.roomTypes()[0];
        this.form = {
            roomNumber: '',
            floor: 1,
            roomTypeId: first?.id ?? '',
            price: first?.basePrice ?? 0,
            maxOccupancy: first?.maxOccupancy ?? 2,
            description: ''
        };
        this.showCreate.set(true);
    }

    onTypeChange(): void {
        const t = this.roomTypes().find((x) => x.id === this.form.roomTypeId);
        if (t) {
            this.form.price = t.basePrice ?? this.form.price;
            this.form.maxOccupancy = t.maxOccupancy ?? this.form.maxOccupancy;
        }
    }

    submitCreate(): void {
        const id = this.hotelId();
        if (!id || !this.form.roomNumber.trim() || !this.form.roomTypeId) return;
        this.showCreate.set(false);
        this.act(() => firstValueFrom(this.roomsApi.createRoom({
            hotelId: id,
            roomNumber: this.form.roomNumber.trim(),
            floor: Number(this.form.floor),
            roomTypeId: this.form.roomTypeId,
            price: Number(this.form.price),
            maxOccupancy: Number(this.form.maxOccupancy),
            description: this.form.description.trim() || undefined
        })));
    }
}