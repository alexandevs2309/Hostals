import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HotelService } from '@/app/core/services/hotel.service';
import { GuestService, Guest, GuestReservation } from '@/app/core/services/guest.service';

@Component({
    selector: 'app-guests',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './guests.html',
    styleUrl: './guests.scss'
})
export class GuestsPage implements OnInit {
    private guestsApi = inject(GuestService);
    private hotelsApi = inject(HotelService);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    guests = signal<Guest[]>([]);
    totalCount = signal(0);
    page = signal(1);
    pageSize = 40;
    loading = signal(true);
    error = signal<string | null>(null);

    search = signal('');
    filterTier = signal('Todos');

    showModal = signal(false);
    modalMode = signal<'create' | 'edit'>('create');
    editing = signal<Guest | null>(null);
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);

    showDetail = signal(false);
    detail = signal<Guest | null>(null);
    detailReservations = signal<GuestReservation[]>([]);
    detailLoading = signal(false);

    form = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        documentType: 'DNI',
        documentNumber: '',
        nationality: '',
        city: '',
        country: '',
        specialRequests: '',
        preferences: ''
    };

    stats = computed(() => {
        const list = this.guests();
        const vip = list.filter((g) => g.isVIP).length;
        const withStays = list.filter((g) => g.totalStays > 0).length;
        const inHouse = list.filter((g) => g.activeReservations > 0).length;
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const recent = list.filter((g) => new Date(g.createdAt).getTime() >= cutoff).length;
        return { total: list.length, vip, withStays, inHouse, recent };
    });

    filtered = computed(() => {
        const q = this.search().trim().toLowerCase();
        let list = this.guests();
        if (this.filterTier() !== 'Todos') {
            list = list.filter((g) => g.loyaltyTier === this.filterTier());
        }
        if (q) {
            list = list.filter(
                (g) =>
                    g.fullName.toLowerCase().includes(q) ||
                    g.email.toLowerCase().includes(q) ||
                    g.phoneNumber.toLowerCase().includes(q) ||
                    g.documentNumber.toLowerCase().includes(q)
            );
        }
        return list;
    });

    pageInfo = computed(() => Math.max(1, Math.ceil(this.totalCount() / this.pageSize)));

    tierOptions = ['Todos', 'Standard', 'Silver', 'Gold', 'Platinum'];

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
        this.guestsApi.getGuests(
            { pageNumber: this.page(), pageSize: this.pageSize },
            { hotelId: id }
        ).subscribe({
            next: (page) => {
                this.guests.set(page.items);
                this.totalCount.set(page.totalCount);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.fail('No se pudieron cargar los huéspedes.');
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

    setTier(t: string): void {
        this.filterTier.set(t);
    }

    initials(g: Guest): string {
        return (g.firstName?.charAt(0) ?? '') + (g.lastName?.charAt(0) ?? '');
    }

    loc(g: Guest): string {
        return [g.city, g.country].filter(Boolean).join(', ') || '—';
    }

    statusLabel(s: string): string {
        const map: Record<string, string> = {
            Pending: 'Pendiente', Confirmed: 'Confirmada', CheckedIn: 'En casa',
            CheckedOut: 'Salida', Cancelled: 'Cancelada', NoShow: 'No-show'
        };
        return map[s] ?? s;
    }

    fmtDate(d?: string): string {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    fmtMoney(n: number): string {
        return '$' + (n ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

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

    // ── Modal crear/editar ─────────────────────────────────
    openCreate(): void {
        this.modalMode.set('create');
        this.editing.set(null);
        this.form = {
            firstName: '', lastName: '', email: '', phoneNumber: '',
            documentType: 'DNI', documentNumber: '', nationality: '',
            city: '', country: '', specialRequests: '', preferences: ''
        };
        this.showModal.set(true);
    }

    openEdit(g: Guest): void {
        this.modalMode.set('edit');
        this.editing.set(g);
        this.form = {
            firstName: g.firstName,
            lastName: g.lastName,
            email: g.email,
            phoneNumber: g.phoneNumber,
            documentType: g.documentType,
            documentNumber: g.documentNumber,
            nationality: g.nationality,
            city: g.city ?? '',
            country: g.country ?? '',
            specialRequests: g.specialRequests ?? '',
            preferences: ''
        };
        this.showModal.set(true);
    }

    canSave(): boolean {
        return !!this.form.firstName.trim();
    }

    submit(): void {
        const payload = {
            firstName: this.form.firstName.trim(),
            lastName: this.form.lastName.trim() || undefined,
            email: this.form.email.trim() || undefined,
            phoneNumber: this.form.phoneNumber.trim() || undefined,
            documentType: this.form.documentType,
            documentNumber: this.form.documentNumber.trim() || undefined,
            nationality: this.form.nationality.trim() || undefined,
            city: this.form.city.trim() || undefined,
            country: this.form.country.trim() || undefined,
            specialRequests: this.form.specialRequests.trim() || undefined,
            preferences: this.form.preferences.trim() || undefined
        };
        this.showModal.set(false);
        if (this.modalMode() === 'edit' && this.editing()) {
            this.act('Huésped actualizado.', () => firstValueFrom(this.guestsApi.updateGuest(this.editing()!.id, payload)));
        } else {
            this.act('Huésped creado correctamente.', () => firstValueFrom(this.guestsApi.createGuest(payload)));
        }
    }

    // ── Ficha del huésped ──────────────────────────────────
    view(g: Guest): void {
        this.detail.set(g);
        this.detailReservations.set([]);
        this.showDetail.set(true);
        this.detailLoading.set(true);
        this.guestsApi.getGuestReservations(g.id).subscribe({
            next: (res) => {
                this.detailReservations.set(res);
                this.detailLoading.set(false);
            },
            error: () => {
                this.detailLoading.set(false);
            }
        });
    }

    goPage(delta: number): void {
        const next = Math.max(1, Math.min(this.pageInfo(), this.page() + delta));
        if (next === this.page()) return;
        this.page.set(next);
        this.load();
    }
}