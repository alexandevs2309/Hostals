import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { HotelService, NoHotelConfiguredError, RoomTypeDto } from '@/app/core/services/hotel.service';
import { formatMoney } from '@/app/shared/utils/money';

@Component({
    selector: 'app-room-types',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './room-types.html',
    styleUrl: './room-types.scss'
})
export class RoomTypesPage implements OnInit {
    private hotelsApi = inject(HotelService);
    private confirmationService = inject(ConfirmationService);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    roomTypes = signal<RoomTypeDto[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);
    showModal = signal(false);
    editing = signal<RoomTypeDto | null>(null);
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);

    form = {
        name: '',
        description: '',
        basePrice: 0,
        capacity: 2,
        extraBedCapacity: 0,
        extraBedPrice: 0
    };

    ngOnInit(): void {
        this.resolveHotel();
    }

    private resolveHotel(): void {
        this.hotelsApi.resolveActiveHotel().subscribe({
            next: (hotel) => {
                this.hotelId.set(hotel.id);
                this.hotelName.set(hotel.name);
                this.load();
            },
            error: (err) => this.fail(err instanceof NoHotelConfiguredError
                ? 'No hay ninguna propiedad configurada todavía.'
                : 'No se pudo cargar la propiedad. Vuelve a iniciar sesión.')
        });
    }

    private load(): void {
        const id = this.hotelId();
        if (!id) return;
        this.loading.set(true);
        this.error.set(null);
        this.hotelsApi.getHotelRoomTypes(id).subscribe({
            next: (types) => {
                this.roomTypes.set(types);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.fail('No se pudieron cargar los tipos de habitación del hotel.');
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

    fmtMoney(n: number): string {
        return formatMoney(n);
    }

    roomsLabel(t: RoomTypeDto): string {
        const max = t.maxOccupancy ?? 0;
        return max > 1 ? `Hasta ${max} huéspedes` : '1 huésped';
    }

    // ── Modal alta/edición ────────────────────────────────
    openCreate(): void {
        this.editing.set(null);
        this.form = {
            name: '',
            description: '',
            basePrice: 0,
            capacity: 2,
            extraBedCapacity: 0,
            extraBedPrice: 0
        };
        this.showModal.set(true);
    }

    openEdit(t: RoomTypeDto): void {
        this.editing.set(t);
        this.form = {
            name: t.name,
            description: t.description ?? '',
            basePrice: t.basePrice,
            capacity: t.maxOccupancy,
            extraBedCapacity: 0,
            extraBedPrice: 0
        };
        this.showModal.set(true);
    }

    private run(fn: () => Promise<RoomTypeDto | void>): void {
        this.busy.set(true);
        this.msg.set('');
        fn().then(() => {
            this.showModal.set(false);
            this.msg.set(this.editing() ? 'Tipo de habitación actualizado correctamente.' : 'Tipo de habitación creado correctamente.');
            this.msgError.set(false);
            this.load();
        }).catch((e) => {
            this.msg.set(e?.error ?? 'La operación falló. Intenta de nuevo.');
            this.msgError.set(true);
        }).finally(() => this.busy.set(false));
    }

    submit(): void {
        const id = this.hotelId();
        if (!id || !this.form.name.trim()) return;
        const editing = this.editing();
        const command = {
            name: this.form.name.trim(),
            description: this.form.description.trim() || undefined,
            basePrice: Number(this.form.basePrice) || 0,
            capacity: Number(this.form.capacity) || 1,
            extraBedCapacity: Number(this.form.extraBedCapacity) || 0,
            extraBedPrice: Number(this.form.extraBedPrice) || 0
        };
        if (editing) {
            this.run(() => firstValueFrom(this.hotelsApi.updateHotelRoomType(id, editing.id, command)));
        } else {
            this.run(() => firstValueFrom(this.hotelsApi.createHotelRoomType(id, command)));
        }
    }

    remove(t: RoomTypeDto): void {
        const id = this.hotelId();
        if (!id) return;
        this.confirmationService.confirm({
            message: `¿Eliminar el tipo «${t.name}»? Las habitaciones asociadas conservarán su tipo hasta que se reasigne.`,
            header: 'Eliminar tipo de habitación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.busy.set(true);
                this.msg.set('');
                firstValueFrom(this.hotelsApi.deleteHotelRoomType(id, t.id)).then(() => {
                    this.msg.set('Tipo de habitación eliminado.');
                    this.msgError.set(false);
                    this.load();
                }).catch(() => {
                    this.msg.set('No se pudo eliminar. Puede que esté asignado a habitaciones.');
                    this.msgError.set(true);
                }).finally(() => this.busy.set(false));
            }
        });
    }
}