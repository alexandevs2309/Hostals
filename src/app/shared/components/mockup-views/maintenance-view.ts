import { Component } from '@angular/core';
import { MAINTENANCE_TICKETS } from '@/app/shared/data/mock.data';

@Component({
    selector: 'maintenance-view',
    standalone: true,
    template: `
        <div class="mntv">
            <div class="mntv-head">
                <span class="mntv-title">Mantenimiento · Tickets</span>
                <div class="mntv-stats">
                    <span><i class="pi pi-times-circle"></i>Abiertos <b>2</b></span>
                    <span><i class="pi pi-minus-circle"></i>En progreso <b>2</b></span>
                    <span style="color: #f87171"><i class="pi pi-exclamation-triangle"></i>Críticos <b>1</b></span>
                </div>
            </div>
            <div class="mntv-list">
                @for (t of tickets; track t.room + t.issue) {
                    <div class="mntv-row">
                        <div class="mntv-row__main">
                            <span class="mntv-tag" [style]="'background:' + prioBg(t.priority) + ';color:' + prioColor(t.priority)">{{ t.priority }}</span>
                            <div>
                                <b>{{ t.room }} · {{ t.issue }}</b>
                                <small><i class="pi pi-user"></i>{{ t.assignee }} · SLA {{ t.sla }}</small>
                            </div>
                        </div>
                        <span class="mntv-state" [class]="'mntv-state--' + t.status">{{ label(t.status) }}</span>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [
        `
            .mntv {
                padding: 20px;
            }
            .mntv-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                gap: 10px;
                flex-wrap: wrap;
            }
            .mntv-title {
                font-family: var(--hos-font-display);
                font-weight: 700;
                font-size: 1rem;
            }
            .mntv-stats {
                display: flex;
                gap: 14px;
                font-size: 0.7rem;
                color: var(--hos-text-muted);
                flex-wrap: wrap;
            }
            .mntv-stats span {
                display: inline-flex;
                align-items: center;
                gap: 5px;
            }
            .mntv-stats b {
                color: var(--hos-text);
            }
            .mntv-list {
                border: 1px solid var(--hos-border);
                border-radius: 14px;
                overflow: hidden;
            }
            .mntv-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                padding: 11px 14px;
                border-bottom: 1px solid var(--hos-border);
                transition: background 0.2s ease;
            }
            .mntv-row:last-child {
                border-bottom: 0;
            }
            .mntv-row:hover {
                background: var(--hos-surface-soft);
            }
            .mntv-row__main {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .mntv-row__main b {
                font-size: 0.82rem;
                display: block;
            }
            .mntv-row__main small {
                font-size: 0.68rem;
                color: var(--hos-text-muted);
                display: inline-flex;
                align-items: center;
                gap: 4px;
                margin-top: 2px;
            }
            .mntv-tag {
                font-size: 0.6rem;
                font-weight: 800;
                text-transform: uppercase;
                padding: 3px 9px;
                border-radius: 999px;
            }
            .mntv-state {
                font-size: 0.68rem;
                font-weight: 700;
                white-space: nowrap;
            }
            .mntv-state--abierto {
                color: #ef4444;
            }
            .mntv-state--progreso {
                color: #f59e0b;
            }
            .mntv-state--resuelto {
                color: var(--hos-teal-500);
            }
        `
    ]
})
export class MaintenanceView {
    tickets = MAINTENANCE_TICKETS.filter((t) => t.status !== 'resuelto');

    label(status: string): string {
        const map: Record<string, string> = {
            abierto: 'Abierto',
            progreso: 'En progreso',
            resuelto: 'Resuelto'
        };
        return map[status] ?? status;
    }

    prioBg(priority: string): string {
        const map: Record<string, string> = {
            critica: 'rgba(239,68,68,0.14)',
            alta: 'rgba(249,115,22,0.14)',
            media: 'rgba(250,204,21,0.14)',
            baja: 'rgba(100,116,139,0.14)'
        };
        return map[priority] ?? map['media'];
    }

    prioColor(priority: string): string {
        const map: Record<string, string> = {
            critica: '#ef4444',
            alta: '#f97316',
            media: '#ca8a04',
            baja: '#64748b'
        };
        return map[priority] ?? map['media'];
    }
}