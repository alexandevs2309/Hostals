import { Component } from '@angular/core';
import { HOUSEKEEPING_ROOMS } from '@/app/shared/data/mock.data';

@Component({
    selector: 'housekeeping-view',
    standalone: true,
    template: `
        <div class="hv">
            <div class="hv-head">
                <span class="hv-title">Housekeeping · Turno mañana</span>
                <span class="hv-pill hv-pill--ok"><i class="pi pi-check"></i>14 · 6 pendientes</span>
            </div>
            <div class="hv-grid">
                @for (r of rooms; track r.room) {
                    <div class="hv-card" [class]="'hv-card--' + r.status">
                        <div class="hv-card__top">
                            <b>{{ r.room }}</b>
                            <span class="hv-status">{{ label(r.status) }}</span>
                        </div>
                        <div class="hv-card__meta">
                            <span><i class="pi pi-user"></i>{{ r.housekeeper }}</span>
                            <span class="hv-prio" [class]="'hv-prio--' + r.priority"><i class="pi pi-flag"></i>{{ r.priority }}</span>
                        </div>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [
        `
            .hv {
                padding: 20px;
            }
            .hv-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                gap: 10px;
                flex-wrap: wrap;
            }
            .hv-title {
                font-family: var(--hos-font-display);
                font-weight: 700;
                font-size: 1rem;
            }
            .hv-pill {
                font-size: 0.7rem;
                font-weight: 700;
                padding: 4px 12px;
                border-radius: 999px;
            }
            .hv-pill--ok {
                background: var(--hos-teal-50);
                color: var(--hos-teal-700);
            }
            .app-dark .hv-pill--ok {
                background: rgba(var(--hos-accent-rgb), 0.12);
                color: var(--hos-teal-300);
            }
            .hv-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
            }
            .hv-card {
                border: 1px solid var(--hos-border);
                border-radius: 14px;
                padding: 12px 14px;
                transition: transform 0.3s ease, border-color 0.3s ease;
            }
            .hv-card:hover {
                transform: translateY(-3px);
                border-color: var(--hos-teal-300);
            }
            .hv-card__top {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
            }
            .hv-card__top b {
                font-size: 0.9rem;
            }
            .hv-status {
                font-size: 0.6rem;
                font-weight: 700;
                padding: 3px 9px;
                border-radius: 999px;
                text-transform: capitalize;
            }
            .hv-card--limpia {
                border-color: rgba(45, 212, 191, 0.4);
            }
            .hv-card--limpia .hv-status {
                background: var(--hos-teal-50);
                color: var(--hos-teal-700);
            }
            .app-dark .hv-card--limpia .hv-status {
                background: rgba(var(--hos-accent-rgb), 0.12);
                color: var(--hos-teal-300);
            }
            .hv-card--pendiente .hv-status {
                background: #fef3c7;
                color: #b45309;
            }
            .app-dark .hv-card--pendiente .hv-status {
                background: rgba(245, 158, 11, 0.15);
                color: #fbbf24;
            }
            .hv-card--inspeccion .hv-status {
                background: #eef2ff;
                color: #4f46e5;
            }
            .app-dark .hv-card--inspeccion .hv-status {
                background: rgba(99, 102, 241, 0.15);
                color: #a5b4fc;
            }
            .hv-card--mantenimiento .hv-status {
                background: #f1f5f9;
                color: var(--hos-slate-500);
            }
            .app-dark .hv-card--mantenimiento .hv-status {
                background: rgba(100, 116, 139, 0.2);
                color: var(--hos-slate-300);
            }
            .hv-card__meta {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 0.68rem;
                color: var(--hos-text-muted);
                gap: 8px;
            }
            .hv-card__meta span {
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }
            .hv-prio i {
                font-size: 0.6rem;
            }
            .hv-prio--alta {
                color: #ef4444;
            }
            .hv-prio--media {
                color: #f59e0b;
            }
            .hv-prio--baja {
                color: var(--hos-text-muted);
            }
        `
    ]
})
export class HousekeepingView {
    rooms = HOUSEKEEPING_ROOMS;

    label(status: string): string {
        const map: Record<string, string> = {
            limpia: 'Limpia',
            pendiente: 'Pendiente',
            inspeccion: 'Inspección',
            mantenimiento: 'Mantenimiento',
            lista: 'Lista'
        };
        return map[status] ?? status;
    }
}