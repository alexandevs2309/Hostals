import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService, Hotel } from '@/app/core/services/hotel.service';

const MODULE_LABELS: Record<string, string> = {
    PMS: 'PMS',
    Reservas: 'Reservas',
    Habitaciones: 'Habitaciones',
    Huespedes: 'Huéspedes',
    Housekeeping: 'Limpieza',
    Mantenimiento: 'Mantenimiento',
    Finanzas: 'Finanzas',
    Analiticas: 'Analíticas'
};

const CURRENCY_SYMBOLS: Record<string, string> = {
    USD: '$', EUR: '€', MXN: '$', GBP: '£', COP: '$', ARS: '$', BRL: 'R$', CLP: '$', PEN: 'S/', CAD: '$'
};

@Component({
    selector: 'app-hotel',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './hotel.html',
    styleUrl: './hotel.scss'
})
export class HotelPage implements OnInit {
    private hotels = inject(HotelService);

    loading = signal(true);
    error = signal<string | null>(null);
    editing = signal(false);
    saving = signal(false);
    saved = signal(false);
    msg = signal('');
    msgError = signal(false);

    hotel = signal<Hotel | null>(null);

    // ── formulario (recoge el hotel en modo edición) ──
    form = {
        name: '',
        businessName: '',
        description: '',
        address: '',
        postalCode: '',
        city: '',
        country: '',
        phoneNumber: '',
        email: '',
        website: '',
        starRating: 3,
        totalRooms: 0,
        yearOpened: 0,
        currency: 'USD',
        taxRate: 0,
        checkInTime: '',
        checkOutTime: '',
        timeZone: 'UTC',
        hotelLanguages: ''
    };

    ngOnInit(): void {
        this.load();
    }

    private resolveHotel(): void {
        const stored = localStorage.getItem('auth_hotel_id');
        if (stored) {
            this.loadHotel(stored);
            return;
        }
        this.hotels.getHotels({ pageNumber: 1, pageSize: 1 }).subscribe({
            next: (page) => {
                const hotel = page.items[0];
                if (hotel) {
                    this.loadHotel(hotel.id);
                } else {
                    this.error.set('No hay ninguna propiedad configurada todavía.');
                    this.loading.set(false);
                }
            },
            error: () => this.fail('No se pudo cargar la propiedad.')
        });
    }

    private loadHotel(id: string): void {
        this.hotels.getHotelById(id).subscribe({
            next: (h) => {
                this.hotel.set(h);
                this.msg.set('');
                this.loading.set(false);
            },
            error: () => this.fail('No se pudo cargar la propiedad. Vuelve a iniciar sesión.')
        });
    }

    load(): void {
        this.loading.set(true);
        this.error.set(null);
        this.editing.set(false);
        this.resolveHotel();
    }

    private fail(message: string): void {
        this.error.set(message);
        this.loading.set(false);
    }

    startEdit(): void {
        const h = this.hotel();
        if (!h) return;
        this.form = {
            name: h.name,
            businessName: h.businessName ?? '',
            description: h.description ?? '',
            address: h.address ?? '',
            postalCode: h.postalCode ?? '',
            city: h.city ?? '',
            country: h.country ?? '',
            phoneNumber: h.phoneNumber ?? '',
            email: h.email ?? '',
            website: h.website ?? '',
            starRating: h.starRating,
            totalRooms: h.totalRooms,
            yearOpened: h.yearOpened ?? 0,
            currency: h.currency ?? 'USD',
            taxRate: h.taxRate ?? 0,
            checkInTime: h.checkInTime ?? '',
            checkOutTime: h.checkOutTime ?? '',
            timeZone: h.timeZone ?? 'UTC',
            hotelLanguages: h.hotelLanguages ?? ''
        };
        this.msg.set('');
        this.saved.set(false);
        this.editing.set(true);
    }

    cancelEdit(): void {
        this.editing.set(false);
        this.msg.set('');
    }

    save(): void {
        const h = this.hotel();
        if (!h) return;
        this.saving.set(true);
        this.msg.set('');
        this.msgError.set(false);
        this.hotels.updateHotel({
            id: h.id,
            name: this.form.name,
            description: this.form.description || undefined,
            address: this.form.address,
            phoneNumber: this.form.phoneNumber,
            email: this.form.email,
            website: this.form.website?.trim() || undefined,
            starRating: this.form.starRating,
            totalRooms: this.form.totalRooms || 0,
            isActive: true,
            timeZone: this.form.timeZone,
            city: this.form.city,
            country: this.form.country,
            businessName: this.form.businessName?.trim() || undefined,
            yearOpened: this.form.yearOpened || undefined,
            postalCode: this.form.postalCode?.trim() || undefined,
            currency: this.form.currency || 'USD',
            taxRate: Number.isFinite(this.form.taxRate) ? this.form.taxRate : undefined,
            checkInTime: this.form.checkInTime || undefined,
            checkOutTime: this.form.checkOutTime || undefined,
            hotelLanguages: this.form.hotelLanguages?.trim() || undefined,
            selectedModules: h.selectedModules
        }).subscribe({
            next: (updated) => {
                this.saving.set(false);
                this.hotel.set(updated);
                this.editing.set(false);
                this.saved.set(true);
                this.msg.set('Propiedad actualizada.');
                this.msgError.set(false);
            },
            error: (err: { error?: string | { message?: string } }) => {
                this.saving.set(false);
                this.msg.set(typeof err.error === 'string' && err.error ? err.error : (err.error as { message?: string })?.message ?? 'No se pudo guardar la propiedad.');
                this.msgError.set(true);
            }
        });
    }

    modules(): string[] {
        return (this.hotel()?.selectedModules ?? '')
            .split(',').map((s) => s.trim()).filter(Boolean)
            .map((m) => MODULE_LABELS[m] ?? m);
    }

    currencySymbol(): string {
        return CURRENCY_SYMBOLS[this.hotel()?.currency ?? 'USD'] ?? '';
    }

    fmtDate(iso: string): string {
        return new Date(iso).toLocaleString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
}