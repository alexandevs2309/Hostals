import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HotelService } from '@/app/core/services/hotel.service';
import { RateService, RoomRate, RatePlan } from '@/app/core/services/rate.service';

interface RateRow {
    roomTypeId: string;
    roomTypeName: string;
    isActive: boolean;
}

interface EditCell {
    roomTypeId: string;
    roomTypeName: string;
    date: string;
    price: number;
    isOverride: boolean;
}

@Component({
    selector: 'app-rates',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './rates.html',
    styleUrl: './rates.scss'
})
export class RatesPage implements OnInit {
    private ratesApi = inject(RateService);
    private hotelsApi = inject(HotelService);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    rates = signal<RoomRate[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);

    month = signal<Date>(this.startOfMonth(new Date()));
    showEdit = signal(false);
    editCell = signal<EditCell | null>(null);
    showBulk = signal(false);
    bulkForm = { roomTypeId: '', from: '', to: '', price: 0 };

    plans = signal<RatePlan[]>([]);
    showPlans = signal(false);
    editingPlan = signal(false);
    editingPlanId = signal('');
    planForm = { name: '', multiplier: 1, minStay: 1, refundability: 0, cancellationDeadlineHours: 24, isDefault: false };
    showAssign = signal(false);
    assignPlanId = signal('');
    assignSelection = signal<Record<string, boolean>>({});

    days = computed(() => {
        const m = this.month();
        const y = m.getFullYear();
        const mm = m.getMonth();
        const count = new Date(y, mm + 1, 0).getDate();
        const list: string[] = [];
        for (let d = 1; d <= count; d++) {
            list.push(this.iso(new Date(y, mm, d)));
        }
        return list;
    });

    monthLabel = computed(() => {
        const m = this.month();
        return m.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    });

    rows = computed(() => {
        const map = new Map<string, RateRow>();
        for (const r of this.rates()) {
            if (!map.has(r.roomTypeId)) {
                map.set(r.roomTypeId, { roomTypeId: r.roomTypeId, roomTypeName: r.roomTypeName, isActive: true });
            }
        }
        return Array.from(map.values());
    });

    cells = computed(() => {
        const map = new Map<string, RoomRate>();
        for (const r of this.rates()) {
            map.set(r.roomTypeId + '|' + r.date, r);
        }
        return map;
    });

    stats = computed(() => {
        const rates = this.rates();
        const types = this.rows().length;
        const overrideDays = rates.filter((r) => r.isOverride).length;
        const min = rates.length ? Math.min(...rates.map((r) => r.effectivePrice)) : 0;
        const max = rates.length ? Math.max(...rates.map((r) => r.effectivePrice)) : 0;
        return { types, overrideDays, min, max };
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
        const days = this.days();
        this.ratesApi.getRates(id, null, days[0], days[days.length - 1]).subscribe({
            next: (rates) => {
                this.rates.set(rates);
                this.loading.set(false);
            },
            error: () => {
                this.loading.set(false);
                this.fail('No se pudieron cargar las tarifas del mes.');
            }
        });
    }

    reload(): void {
        const id = this.hotelId();
        if (id) this.load();
        else this.resolveHotel();
    }

    retry(): void {
        this.reload();
    }

    private fail(message: string): void {
        this.error.set(message);
        this.loading.set(false);
    }

    goMonth(delta: number): void {
        const m = this.month();
        this.month.set(this.startOfMonth(new Date(m.getFullYear(), m.getMonth() + delta, 1)));
        if (this.hotelId()) this.load();
    }

    goToday(): void {
        this.month.set(this.startOfMonth(new Date()));
        if (this.hotelId()) this.load();
    }

    isToday(date: string): boolean {
        return date === this.iso(new Date());
    }

    cellOf(roomTypeId: string, date: string): RoomRate | undefined {
        return this.cells().get(roomTypeId + '|' + date);
    }

    openEdit(roomTypeId: string, roomTypeName: string, date: string): void {
        const cell = this.cellOf(roomTypeId, date);
        if (!cell) return;
        this.editCell.set({
            roomTypeId,
            roomTypeName,
            date,
            price: cell.effectivePrice,
            isOverride: cell.isOverride
        });
        this.showEdit.set(true);
    }

    openBulk(): void {
        const first = this.rows()[0];
        this.bulkForm = {
            roomTypeId: first?.roomTypeId ?? '',
            from: this.days()[0],
            to: this.days()[this.days().length - 1],
            price: 0
        };
        this.showBulk.set(true);
    }

    saveCell(): void {
        const cell = this.editCell();
        const id = this.hotelId();
        if (!cell || !id || cell.price <= 0) return;
        this.showEdit.set(false);
        this.act(() => firstValueFrom(this.ratesApi.setRateRange({
            hotelId: id,
            roomTypeId: cell.roomTypeId,
            from: cell.date,
            to: cell.date,
            price: cell.price
        })), 'Tarifa actualizada para el día seleccionado.');
    }

    resetCell(): void {
        const cell = this.editCell();
        const id = this.hotelId();
        if (!cell || !id) return;
        this.showEdit.set(false);
        this.act(() => firstValueFrom(this.ratesApi.clearRateRange(id, cell.roomTypeId, cell.date, cell.date)),
            'Tarifa restaurada a la base.');
    }

    applyBulk(): void {
        const id = this.hotelId();
        if (!id || !this.bulkForm.roomTypeId || !this.bulkForm.from || !this.bulkForm.to || this.bulkForm.price <= 0) return;
        this.showBulk.set(false);
        this.act(() => firstValueFrom(this.ratesApi.setRateRange({
            hotelId: id,
            roomTypeId: this.bulkForm.roomTypeId,
            from: this.bulkForm.from,
            to: this.bulkForm.to,
            price: this.bulkForm.price
        })), `Tarifa aplicada del ${this.bulkForm.from} al ${this.bulkForm.to}.`);
    }

    resetBulk(): void {
        const id = this.hotelId();
        if (!id || !this.bulkForm.roomTypeId || !this.bulkForm.from || !this.bulkForm.to) return;
        this.showBulk.set(false);
        this.act(() => firstValueFrom(this.ratesApi.clearRateRange(id, this.bulkForm.roomTypeId, this.bulkForm.from, this.bulkForm.to)),
            'Rango restaurado a la tarifa base.');
    }

    fmtMoney(n: number): string {
        return '$' + (n ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    dayName(date: string): string {
        return new Date(date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' });
    }

    private act(fn: () => Promise<unknown>, ok: string): void {
        this.busy.set(true);
        this.msg.set('');
        fn().then(() => {
            this.msg.set(ok + ' Se actualizó el calendario.');
            this.msgError.set(false);
            this.load();
        }).catch((e) => {
            this.msg.set(e?.error ?? 'La operación falló. Intenta de nuevo.');
            this.msgError.set(true);
            this.load();
        }).finally(() => this.busy.set(false));
    }

    refundLabel(n: number): string {
        return n === 2 ? 'No reembolsable' : n === 1 ? 'Moderada' : 'Flexible';
    }

    // ── Planes de tarifas (1B) ─────────────────────────────
    loadPlans(): void {
        const id = this.hotelId();
        if (!id) return;
        this.ratesApi.getRatePlans(id).subscribe({
            next: (plans) => this.plans.set(plans),
            error: () => this.plans.set([])
        });
    }

    openPlans(): void {
        this.editingPlan.set(false);
        this.editingPlanId.set('');
        this.planForm = { name: '', multiplier: 1, minStay: 1, refundability: 0, cancellationDeadlineHours: 24, isDefault: false };
        this.showPlans.set(true);
        this.loadPlans();
    }

    startCreatePlan(): void {
        this.editingPlan.set(false);
        this.editingPlanId.set('');
        this.planForm = { name: '', multiplier: 1, minStay: 1, refundability: 0, cancellationDeadlineHours: 24, isDefault: false };
    }

    startEditPlan(p: RatePlan): void {
        this.editingPlan.set(true);
        this.editingPlanId.set(p.id);
        this.planForm = {
            name: p.name,
            multiplier: p.multiplier,
            minStay: p.minStay,
            refundability: p.refundability,
            cancellationDeadlineHours: p.cancellationDeadlineHours,
            isDefault: p.isDefault
        };
    }

    savePlan(): void {
        const id = this.hotelId();
        if (!id || !this.planForm.name.trim()) return;
        const command = {
            hotelId: id,
            name: this.planForm.name.trim(),
            multiplier: Number(this.planForm.multiplier),
            minStay: Number(this.planForm.minStay),
            refundability: Number(this.planForm.refundability),
            cancellationDeadlineHours: Number(this.planForm.cancellationDeadlineHours),
            isDefault: this.planForm.isDefault
        };
        const editing = this.editingPlan();
        const op = editing
            ? firstValueFrom(this.ratesApi.updateRatePlan(this.editingPlanId() || this.plans()[0]?.id!, command)).then(() => undefined)
            : firstValueFrom(this.ratesApi.createRatePlan(command)).then(() => undefined);
        this.showPlans.set(false);
        this.act(async () => {
            await op;
            this.loadPlans();
        }, editing ? 'Plan actualizado.' : 'Plan creado.');
    }

    removePlan(p: RatePlan): void {
        const id = this.hotelId();
        if (!id) return;
        this.act(() => firstValueFrom(this.ratesApi.deleteRatePlan(p.id, id)), `Plan «${p.name}» eliminado.`);
        this.loadPlans();
    }

    openAssign(p: RatePlan): void {
        this.assignPlanId.set(p.id);
        const sel: Record<string, boolean> = {};
        for (const row of this.rows()) {
            sel[row.roomTypeId] = false;
        }
        this.assignSelection.set(sel);
        this.showAssign.set(true);
    }

    toggleAssign(roomTypeId: string, checked: boolean): void {
        const sel = { ...this.assignSelection() };
        sel[roomTypeId] = checked;
        this.assignSelection.set(sel);
    }

    assignPlan(): void {
        const id = this.hotelId();
        const planId = this.assignPlanId();
        if (!id || !planId) return;
        const selected = Object.entries(this.assignSelection())
            .filter(([, v]) => v)
            .map(([k]) => k);
        this.showAssign.set(false);
        this.busy.set(true);
        this.msg.set('');
        this.ratesApi.assignRatePlan(planId, id, selected).subscribe({
            next: () => {
                this.msg.set('Asignación actualizada.');
                this.msgError.set(false);
                this.busy.set(false);
                this.loadPlans();
                this.load();
            },
            error: (e) => {
                this.msg.set(e?.error ?? 'No se pudo asignar el plan.');
                this.msgError.set(true);
                this.busy.set(false);
                this.load();
            }
        });
    }

    private iso(d: Date): string {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    startOfMonth(d: Date): Date {
        return new Date(d.getFullYear(), d.getMonth(), 1);
    }
}