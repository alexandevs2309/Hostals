import { Component, ElementRef, OnInit, ViewChild, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DragDropModule, CdkDragEnd } from '@angular/cdk/drag-drop';
import { HotelService } from '@/app/core/services/hotel.service';
import { RoomService, Room } from '@/app/core/services/room.service';
import { ReservationService, Reservation } from '@/app/core/services/reservation.service';
import {
    ACTIVE_STATUSES,
    CalendarBlock,
    CalendarDay,
    CalendarRoom,
    addDays,
    buildDays,
    fillBlocks,
    toDateOnly
} from '@/app/core/utils/calendar-blocks';

const LABEL_W = 120;
const DAY_W = 48;
const ROW_H = 46;

const STATUS_LABEL: Record<string, string> = {
    Pending: 'Pendiente',
    Confirmed: 'Confirmada',
    CheckedIn: 'En casa',
    CheckedOut: 'Salida',
    Cancelled: 'Cancelada',
    NoShow: 'No-show'
};

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [CommonModule, FormsModule, DragDropModule],
    templateUrl: './calendar.html',
    styleUrl: './calendar.scss'
})
export class CalendarPage implements OnInit {
    private reservationsApi = inject(ReservationService);
    private roomsApi = inject(RoomService);
    private hotelsApi = inject(HotelService);
    private router = inject(Router);

    @ViewChild('grid') grid!: ElementRef<HTMLElement>;

    DAYS_COUNT = 14;

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    rooms = signal<CalendarRoom[]>([]);
    reservations = signal<Reservation[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);
    moving = signal(false);
    msg = signal('');
    msgError = signal(false);

    windowStart = signal<Date>(new Date());
    filterStatus = signal('Todos');
    statusOptions = ['Todos', 'Confirmed', 'CheckedIn', 'Pending', 'NoShow', 'Cancelled', 'CheckedOut'];

    days = computed(() => buildDays(this.windowStart(), this.DAYS_COUNT));
    todayIso = toDateOnly(new Date());

    filtered = computed(() => {
        const f = this.filterStatus();
        if (f === 'Todos') return this.reservations();
        return this.reservations().filter((r) => r.status === f);
    });

    fillResult = computed(() => fillBlocks(this.rooms(), this.days(), this.filtered()));

    blocks = computed(() => this.fillResult().blocks);

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

    rangeLabel = computed(() => {
        const days = this.days();
        if (!days.length) return '';
        const first = new Date(days[0].iso + 'T12:00:00');
        const last = new Date(days[days.length - 1].iso + 'T12:00:00');
        const fmt = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        return `${fmt(first)} – ${fmt(last)} · ${last.getFullYear()}`;
    });

    gridStyle = computed(() => {
        const cols = `${LABEL_W}px repeat(${this.days().length}, ${DAY_W}px)`;
        const rows = `repeat(${this.rooms().length + 1}, ${ROW_H}px)`;
        return { 'grid-template-columns': cols, 'grid-template-rows': rows };
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

    load(): void {
        const id = this.hotelId();
        if (!id) return;
        this.loading.set(true);
        this.error.set(null);
        const from = addDays(this.windowStart(), -2);
        const to = addDays(this.windowStart(), this.DAYS_COUNT + 2);

        this.roomsApi.getHotelRooms(id).subscribe({
            next: (rooms) => this.rooms.set(rooms.map((r: Room) => ({ id: r.id, roomNumber: r.roomNumber }))),
            error: () => this.fail('No se pudieron cargar las habitaciones.')
        });

        this.reservationsApi.getReservations(
            { pageNumber: 1, pageSize: 100 },
            { hotelId: id, from: toDateOnly(from), to: toDateOnly(to) }
        ).subscribe({
            next: (page) => {
                this.reservations.set(page.items);
                this.msg.set('');
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

    blocksFor(roomId: string): CalendarBlock[] {
        return this.blocks().filter((b) => b.roomId === roomId);
    }

    blockClass(b: CalendarBlock): string {
        const base = ['block', 'block--' + (b.status ?? 'x').toLowerCase()];
        if (b.conflict) base.push('block--conflict');
        if (!(ACTIVE_STATUSES as readonly string[]).includes(b.status)) base.push('block--inactive');
        if (b.start === 0 && b.checkIn < this.days()[0].iso) base.push('block--clipped-start');
        return base.join(' ');
    }

    headerLabel(d: CalendarDay): string {
        return `${d.weekday} ${d.day}`;
    }

    isToday(d: CalendarDay): boolean {
        return d.iso === this.todayIso;
    }

    // ── Navegación de ventana ────────────────────────────────
    goPrev(): void {
        this.windowStart.set(addDays(this.windowStart(), -this.DAYS_COUNT));
        this.load();
    }

    goNext(): void {
        this.windowStart.set(addDays(this.windowStart(), this.DAYS_COUNT));
        this.load();
    }

    goToday(): void {
        this.windowStart.set(new Date());
        this.load();
    }

    // ── Drag & drop ──────────────────────────────────────────
    private resolveDrop(event: CdkDragEnd): { roomIndex: number; dayIndex: number; inside: boolean } {
        const rect = this.grid.nativeElement.getBoundingClientRect();
        const ev = event.event;
        const x = ev instanceof TouchEvent ? (ev.changedTouches?.[0]?.clientX ?? 0) : (ev as MouseEvent).clientX;
        const y = ev instanceof TouchEvent ? (ev.changedTouches?.[0]?.clientY ?? 0) : (ev as MouseEvent).clientY;
        const rawRow = Math.floor((y - rect.top) / ROW_H);
        const rawDay = Math.floor((x - rect.left - LABEL_W) / DAY_W);
        const rowIndex = rawRow - 1;
        const inside = rowIndex >= 0 && rowIndex < this.rooms().length;
        return {
            roomIndex: inside ? rowIndex : -1,
            dayIndex: rawDay,
            inside
        };
    }

    onDrop(event: CdkDragEnd): void {
        const b: CalendarBlock = event.source.data;
        if (!b || this.moving()) return;

        const { roomIndex, dayIndex } = this.resolveDrop(event);
        if (roomIndex < 0 || dayIndex < 0) return;

        const targetRoom = this.rooms()[roomIndex];
        const days = this.days();
        const boundDay = Math.max(0, Math.min(days.length - 1, dayIndex));
        const targetDate = new Date(days[boundDay].iso + 'T12:00:00');
        const checkIn = toDateOnly(targetDate);
        const nights = Math.max(1, b.nights);
        const checkOut = toDateOnly(addDays(targetDate, nights));

        if (targetRoom.id === b.roomId && checkIn === b.checkIn) return;

        const original = this.reservations();
        const target = original.find((r) => r.id === b.reservationId);
        if (!target) return;

        const conflictAtTarget = this.fillResult().blocks.some((other) =>
            other.reservationId !== b.reservationId &&
            other.roomId === targetRoom.id &&
            (ACTIVE_STATUSES as readonly string[]).includes(other.status) &&
            boundDay < other.end &&
            boundDay + nights > other.start);
        if (conflictAtTarget) {
            this.msg.set('La habitación de destino ya está ocupada en esas fechas.');
            this.msgError.set(true);
            return;
        }

        this.moving.set(true);
        this.msg.set('');
        this.msgError.set(false);

        const moved = {
            ...target,
            roomId: targetRoom.id,
            roomNumber: targetRoom.roomNumber,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            numberOfNights: nights
        };
        this.reservations.set(original.map((r) => (r.id === moved.id ? moved : r)));

        this.reservationsApi.move(target.id, { roomId: targetRoom.id, checkInDate: checkIn, checkOutDate: checkOut }).subscribe({
            next: (saved) => {
                this.reservations.set(original.map((r) => (r.id === saved.id ? saved : r)));
                this.moving.set(false);
                this.msg.set(`Reserva ${saved.reservationNumber} movida a ${saved.roomNumber}.`);
            },
            error: (e) => {
                this.reservations.set(original);
                this.moving.set(false);
                this.msg.set(e?.error ?? 'No se pudo mover la reserva. Revisa la disponibilidad.');
                this.msgError.set(true);
            }
        });
    }

    newReservation(): void {
        const id = this.hotelId();
        this.router.navigate(['/app/reservations'], id ? { queryParams: { hotelId: id } } : undefined);
    }
}