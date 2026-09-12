import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HotelService } from '@/app/core/services/hotel.service';
import { RoomService, Room } from '@/app/core/services/room.service';
import { ReservationService, Reservation } from '@/app/core/services/reservation.service';

const STATUS_LABEL: Record<string, string> = {
    Pending: 'Pendiente',
    Confirmed: 'Confirmada',
    CheckedIn: 'En casa',
    CheckedOut: 'Salida',
    Cancelled: 'Cancelada',
    NoShow: 'No-show'
};

const STATUS_OPTIONS = ['Todos', 'Confirmed', 'CheckedIn', 'Pending', 'NoShow', 'Cancelled', 'CheckedOut'];

@Component({
    selector: 'app-reservations',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './reservations.html',
    styleUrl: './reservations.scss'
})
export class ReservationsPage implements OnInit {
    private reservationsApi = inject(ReservationService);
    private hotelsApi = inject(HotelService);
    private roomsApi = inject(RoomService);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    reservations = signal<Reservation[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);

    filterStatus = signal('Todos');
    statusOptions = STATUS_OPTIONS;
    search = signal('');
    page = signal(1);
    pageSize = 40;
    totalCount = signal(0);

    showCreate = signal(false);
    showCancel = signal(false);
    cancelTarget = signal<Reservation | null>(null);
    cancelReason = signal('');
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);

    availableRooms = signal<Room[]>([]);
    selectedRoomPrice = computed(() => this.availableRooms().find((r) => r.id === this.form.roomId)?.price ?? 0);
    roomTypes = signal<{ id: string; name: string }[]>([]);
    loadingRooms = signal(false);

    form = {
        checkIn: '',
        checkOut: '',
        roomId: '',
        roomTypeId: '' as string | null,
        numberOfGuests: 2,
        hasExtraBed: false,
        source: 'Directo',
        specialRequests: '',
        guestFirstName: '',
        guestLastName: '',
        guestEmail: '',
        guestPhone: '',
        guestDocumentType: 'DNI',
        guestDocumentNumber: ''
    };

    counts = computed(() => {
        let confirmed = 0, checkedIn = 0, pending = 0, cancelled = 0, checkedOut = 0, noShow = 0;
        for (const r of this.reservations()) {
            switch (r.status) {
                case 'Confirmed': confirmed++; break;
                case 'CheckedIn': checkedIn++; break;
                case 'Pending': pending++; break;
                case 'Cancelled': cancelled++; break;
                case 'CheckedOut': checkedOut++; break;
                case 'NoShow': noShow++; break;
            }
        }
        return { confirmed, checkedIn, pending, cancelled, checkedOut, noShow };
    });

    filtered = computed(() => {
        const q = this.search().trim().toLowerCase();
        let list = this.reservations();
        if (this.filterStatus() !== 'Todos') {
            list = list.filter((r) => r.status === this.filterStatus());
        }
        if (q) {
            list = list.filter(
                (r) =>
                    r.reservationNumber.toLowerCase().includes(q) ||
                    r.guestName.toLowerCase().includes(q) ||
                    r.guestEmail.toLowerCase().includes(q) ||
                    r.roomNumber.toLowerCase().includes(q)
            );
        }
        return list;
    });

    pageInfo = computed(() => {
        const totalPages = Math.max(1, Math.ceil(this.totalCount() / this.pageSize));
        return totalPages;
    });

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
                if (hotel) onHotel(hotel);
                else this.fail('No hay ninguna propiedad configurada todavía.');
            },
            error: () => this.fail('No se pudo cargar la propiedad.')
        });
    }

    private load(): void {
        const id = this.hotelId();
        if (!id) return;
        this.loading.set(true);
        this.error.set(null);
        this.reservationsApi.getReservations(
            { pageNumber: this.page(), pageSize: this.pageSize },
            { hotelId: id, status: undefined, search: undefined }
        ).subscribe({
            next: (page) => {
                this.reservations.set(page.items);
                this.totalCount.set(page.totalCount);
                this.hotelsApi.getHotelRoomTypes(id).subscribe({
                    next: (types) => this.roomTypes.set(types.map((t) => ({ id: t.id, name: t.name }))),
                    error: () => {}
                });
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.fail('No se pudieron cargar las reservas.');
            }
        });
    }

    private fail(message: string): void {
        this.error.set(message);
        this.loading.set(false);
    }

    retry(): void {
        const id = this.hotelId();
        if (id) this.load();
        else this.resolveHotel();
    }

    statusLabel(s: string): string {
        return STATUS_LABEL[s] ?? s;
    }

    statusClass(s: string): string {
        return 'badge--' + (s ?? 'x').toLowerCase();
    }

    setFilter(s: string): void {
        this.filterStatus.set(s);
    }

    fmtDate(d: string): string {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    }

    fmtMoney(n: number): string {
        return '$' + (n ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // ── Acciones ───────────────────────────────────────────
    private act(title: string, fn: () => Promise<unknown>): void {
        this.busy.set(true);
        this.msg.set('');
        fn().then(() => {
            this.msg.set(title);
            this.msgError.set(false);
            this.load();
        }).catch((e) => {
            this.msg.set(e?.error ?? 'La operación falló. Intenta de nuevo.');
            this.msgError.set(true);
            this.load();
        }).finally(() => this.busy.set(false));
    }

    confirm(r: Reservation): void {
        this.act('Reserva confirmada.', () => firstValueFrom(this.reservationsApi.confirm(r.id)));
    }

    checkIn(r: Reservation): void {
        this.act('Check-in registrado. La habitación quedó ocupada.', () => firstValueFrom(this.reservationsApi.checkIn(r.id)));
    }

    checkOut(r: Reservation): void {
        this.act('Check-out registrado. La habitación está pendiente de limpieza.', () => firstValueFrom(this.reservationsApi.checkOut(r.id)));
    }

    openCancel(r: Reservation): void {
        this.cancelTarget.set(r);
        this.cancelReason.set('');
        this.showCancel.set(true);
    }

    submitCancel(): void {
        const r = this.cancelTarget();
        if (!r) return;
        this.showCancel.set(false);
        this.act('Reserva cancelada.', () => firstValueFrom(this.reservationsApi.cancel(r.id, this.cancelReason().trim() || undefined)));
    }

    // ── Nueva reserva ──────────────────────────────────────
    openCreate(): void {
        const today = new Date();
        const iso = (d: Date) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };
        const checkIn = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const checkOut = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
        this.form = {
            checkIn: iso(checkIn),
            checkOut: iso(checkOut),
            roomId: '',
            roomTypeId: null,
            numberOfGuests: 2,
            hasExtraBed: false,
            source: 'Directo',
            specialRequests: '',
            guestFirstName: '',
            guestLastName: '',
            guestEmail: '',
            guestPhone: '',
            guestDocumentType: 'DNI',
            guestDocumentNumber: ''
        };
        this.availableRooms.set([]);
        this.showCreate.set(true);
        this.loadAvailableRooms();
    }

    onDatesChanged(): void {
        this.loadAvailableRooms();
    }

    onTypeFilterChanged(): void {
        this.loadAvailableRooms();
    }

    private loadAvailableRooms(): void {
        const id = this.hotelId();
        if (!id || !this.form.checkIn || !this.form.checkOut) return;
        this.loadingRooms.set(true);
        this.availableRooms.set([]);
        this.form.roomId = '';
        this.form.roomTypeId = null;
        this.roomsApi.getAvailableRooms({
            hotelId: id,
            checkIn: this.toUtcIso(this.form.checkIn),
            checkOut: this.toUtcIso(this.form.checkOut),
            roomTypeId: this.form.roomTypeId ?? undefined
        }).subscribe({
            next: (rooms) => {
                this.availableRooms.set(rooms);
                this.loadingRooms.set(false);
            },
            error: () => {
                this.loadingRooms.set(false);
            }
        });
    }

    private toUtcIso(dateStr: string): string {
        return new Date(dateStr + 'T14:00:00').toISOString();
    }

    selectType(roomTypeId: string | null): void {
        this.form.roomTypeId = roomTypeId;
        this.loadAvailableRooms();
    }

    canCreate(): boolean {
        return !!(this.hotelId() && this.form.checkIn && this.form.checkOut &&
            this.form.checkOut > this.form.checkIn && this.form.roomId &&
            this.form.guestFirstName.trim());
    }

    submitCreate(): void {
        const id = this.hotelId();
        if (!id || !this.canCreate()) return;
        this.showCreate.set(false);
        this.act('Reserva creada correctamente.', () => firstValueFrom(this.reservationsApi.createReservation({
            hotelId: id,
            roomId: this.form.roomId,
            checkInDate: this.toUtcIso(this.form.checkIn),
            checkOutDate: this.toUtcIso(this.form.checkOut),
            numberOfGuests: Number(this.form.numberOfGuests),
            hasExtraBed: this.form.hasExtraBed,
            source: this.form.source,
            specialRequests: this.form.specialRequests.trim() || undefined,
            guestFirstName: this.form.guestFirstName.trim(),
            guestLastName: this.form.guestLastName.trim() || undefined,
            guestEmail: this.form.guestEmail.trim() || undefined,
            guestPhone: this.form.guestPhone.trim() || undefined,
            guestDocumentType: this.form.guestDocumentType,
            guestDocumentNumber: this.form.guestDocumentNumber.trim() || undefined
        })));
    }

    goPage(delta: number): void {
        const next = Math.max(1, Math.min(this.pageInfo(), this.page() + delta));
        if (next === this.page()) return;
        this.page.set(next);
        this.load();
    }
}