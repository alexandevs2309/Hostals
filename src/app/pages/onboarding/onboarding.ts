import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { HotelService, RoomTypeDto } from '@/app/core/services/hotel.service';
import { ChannelService, Channel } from '@/app/core/services/channel.service';
import { OnboardingService, OnboardingStatus } from '@/app/core/services/onboarding.service';
import { RateService } from '@/app/core/services/rate.service';

const CHANNEL_TYPES = ['Ota', 'Agency', 'Phone', 'WalkIn', 'Site'];

const CHANNEL_TYPE_LABELS: Record<string, string> = {
    Ota: 'OTA',
    Agency: 'Agencia',
    Phone: 'Teléfono',
    WalkIn: 'Walk-in',
    Site: 'Sitio web'
};

@Component({
    selector: 'app-onboarding',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './onboarding.html',
    styleUrl: './onboarding.scss'
})
export class OnboardingPage implements OnInit {
    private hotelsApi = inject(HotelService);
    private channelApi = inject(ChannelService);
    private onboardingApi = inject(OnboardingService);
    private ratesApi = inject(RateService);
    private router = inject(Router);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    loading = signal(true);
    error = signal<string | null>(null);
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);

    status = signal<OnboardingStatus | null>(null);
    roomTypes = signal<RoomTypeDto[]>([]);
    channels = signal<Channel[]>([]);
    step = signal(1);

    showTypeForm = signal(false);
    typeForm = { name: '', basePrice: 0, capacity: 1 };

    showChannelForm = signal(false);
    channelForm = { name: '', channelType: 'Ota', commissionRate: 0 };

    steps = [
        { n: 1, icon: 'pi pi-building', title: 'Propiedad' },
        { n: 2, icon: 'pi pi-th-large', title: 'Tipos y habitaciones' },
        { n: 3, icon: 'pi pi-tag', title: 'Tarifas y políticas' },
        { n: 4, icon: 'pi pi-globe', title: 'Canales de venta' }
    ];

    channelTypes = CHANNEL_TYPES.map((t) => ({ value: t, label: CHANNEL_TYPE_LABELS[t] }));

    progressLabel = computed(() => {
        const s = this.status();
        return s ? `${s.completedSteps} de ${s.totalSteps}` : '';
    });

    current = computed(() => {
        const n = this.step();
        const s = this.status();
        const done: Record<number, boolean> = {
            1: true,
            2: !!s?.hasRoomTypes && (s?.roomCount ?? 0) > 0,
            3: !!s?.hasRatePlan,
            4: !!s?.hasChannel
        };
        return { n, done };
    });

    canFinish = computed(() => this.status()?.allComplete ?? false);

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
        this.onboardingApi.getStatus(id).subscribe({
            next: (status) => {
                this.status.set(status);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.fail('No se pudo cargar el estado del registro.');
            }
        });
        this.hotelsApi.getHotelRoomTypes(id).subscribe({
            next: (types) => this.roomTypes.set(types),
            error: () => this.roomTypes.set([])
        });
        this.channelApi.getChannels(id).subscribe({
            next: (channels) => this.channels.set(channels),
            error: () => this.channels.set([])
        });
    }

    retry(): void {
        this.load();
    }

    private fail(message: string): void {
        this.error.set(message);
        this.loading.set(false);
    }

    goStep(n: number): void {
        this.step.set(n);
    }

    next(): void {
        const n = Math.min(4, this.step() + 1);
        this.step.set(n);
    }

    prev(): void {
        const n = Math.max(1, this.step() - 1);
        this.step.set(n);
    }

    isDone(step: number): boolean {
        return this.current().done[step] ?? false;
    }

    goDashboard(): void {
        this.router.navigate(['/app']);
    }

    // ── Paso 2: tipos de habitación ────────────────────────
    openTypeForm(): void {
        this.typeForm = { name: '', basePrice: 0, capacity: 1 };
        this.showTypeForm.set(true);
    }

    saveType(): void {
        const id = this.hotelId();
        if (!id || !this.typeForm.name.trim() || this.typeForm.basePrice <= 0) return;
        this.showTypeForm.set(false);
        this.act(() => firstValueFrom(this.hotelsApi.createHotelRoomType(id, {
            name: this.typeForm.name.trim(),
            basePrice: Number(this.typeForm.basePrice),
            capacity: Number(this.typeForm.capacity)
        })), 'Tipo de habitación creado.');
    }

    removeType(t: RoomTypeDto): void {
        const id = this.hotelId();
        if (!id) return;
        this.act(() => firstValueFrom(this.hotelsApi.deleteHotelRoomType(id, t.id)), `Tipo «${t.name}» eliminado.`);
    }

    // ── Paso 3: plan por defecto ───────────────────────────
    async createDefaultPlan(): Promise<void> {
        const id = this.hotelId();
        if (!id) return;
        this.act(async () => {
            const plans = await firstValueFrom(this.ratesApi.getRatePlans(id));
            if (plans.length === 0) {
                await firstValueFrom(this.ratesApi.createRatePlan({
                    hotelId: id,
                    name: 'Flexible',
                    multiplier: 1,
                    minStay: 1,
                    refundability: 0,
                    cancellationDeadlineHours: 24,
                    isDefault: true
                }));
            }
        }, 'Plan por defecto configurado.');
        this.step.set(3);
    }

    // ── Paso 4: canales ────────────────────────────────────
    openChannelForm(): void {
        this.channelForm = { name: '', channelType: 'Ota', commissionRate: 0 };
        this.showChannelForm.set(true);
    }

    channelTypeLabel(t: string): string {
        return CHANNEL_TYPE_LABELS[t] ?? t;
    }

    saveChannel(): void {
        const id = this.hotelId();
        if (!id || !this.channelForm.name.trim()) return;
        this.showChannelForm.set(false);
        this.act(() => firstValueFrom(this.channelApi.createChannel({
            hotelId: id,
            name: this.channelForm.name.trim(),
            channelType: this.channelForm.channelType,
            commissionRate: Number(this.channelForm.commissionRate),
            isActive: true
        })), 'Canal de venta creado.');
    }

    removeChannel(c: Channel): void {
        const id = this.hotelId();
        if (!id) return;
        this.act(() => firstValueFrom(this.channelApi.deleteChannel(c.id, id)), `Canal «${c.name}» eliminado.`);
    }

    fmtMoney(n: number): string {
        return '$' + (n ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    private act(fn: () => Promise<unknown>, ok: string): void {
        this.busy.set(true);
        this.msg.set('');
        fn().then(() => {
            this.msg.set(ok);
            this.msgError.set(false);
            this.load();
        }).catch((e) => {
            this.msg.set(e?.error ?? 'La operación falló. Intenta de nuevo.');
            this.msgError.set(true);
            this.load();
        }).finally(() => this.busy.set(false));
    }
}