import { Component } from '@angular/core';
import { BOOKINGS } from '@/app/shared/data/mock.data';

@Component({
    selector: 'bookings-view',
    standalone: true,
    template: `
        <div class="mv">
            <div class="mv-head">
                <span class="mv-title">Próximas reservas</span>
                <div class="mv-week">
                    @for (d of week; track d) {
                        <span class="mv-day" [class.mv-day--on]="d.on"><small>{{ d.d }}</small><b>{{ d.n }}</b></span>
                    }
                </div>
            </div>
            <div class="mv-table">
                <div class="mv-tr mv-tr--head"><span>Huésped</span><span>Habitación</span><span>Check-in</span><span>Check-out</span><span>Estado</span></div>
                @for (b of bookings; track $index) {
                    <div class="mv-tr">
                        <span class="mv-bold">{{ b.guest }}</span>
                        <span>{{ b.room }}</span>
                        <span>{{ b.checkIn }}</span>
                        <span>{{ b.checkOut }}</span>
                        <span class="mv-status" [class]="'mv-status--' + b.status">{{ b.status }}</span>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [
        `
            .mv {
                padding: 20px;
            }
            .mv-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                gap: 12px;
                flex-wrap: wrap;
            }
            .mv-title {
                font-family: var(--hos-font-display);
                font-weight: 700;
                font-size: 1rem;
            }
            .mv-week {
                display: flex;
                gap: 6px;
            }
            .mv-day {
                width: 40px;
                border-radius: 10px;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 6px 0;
                border: 1px solid var(--hos-border);
                font-size: 0.6rem;
                color: var(--hos-text-muted);
            }
            .mv-day b {
                font-size: 0.8rem;
                color: var(--hos-text);
            }
            .mv-day--on {
                background: var(--hos-teal-500);
                border-color: var(--hos-teal-500);
                color: #fff;
            }
            .mv-day--on b {
                color: #fff;
            }
            .mv-table {
                border: 1px solid var(--hos-border);
                border-radius: 12px;
                overflow: hidden;
            }
            .mv-tr {
                display: grid;
                grid-template-columns: 1.4fr 0.8fr 0.8fr 0.9fr 1fr;
                gap: 8px;
                padding: 10px 14px;
                font-size: 0.75rem;
                color: var(--hos-text-muted);
                align-items: center;
                border-bottom: 1px solid var(--hos-border);
            }
            .mv-tr:last-child {
                border-bottom: 0;
            }
            .mv-tr--head {
                background: var(--hos-surface-soft);
                font-weight: 700;
                color: var(--hos-text);
                text-transform: uppercase;
                font-size: 0.62rem;
                letter-spacing: 0.06em;
            }
            .mv-bold {
                font-weight: 600;
                color: var(--hos-text);
            }
            .mv-status {
                justify-self: start;
                font-size: 0.62rem;
                font-weight: 700;
                padding: 3px 10px;
                border-radius: 999px;
                white-space: nowrap;
            }
            .mv-status--confirmada {
                background: var(--hos-teal-50);
                color: var(--hos-teal-700);
            }
            .app-dark .mv-status--confirmada {
                background: rgba(20, 184, 166, 0.12);
                color: var(--hos-teal-300);
            }
            .mv-status--check-in {
                background: #eff6ff;
                color: #2563eb;
            }
            .app-dark .mv-status--check-in {
                background: rgba(59, 130, 246, 0.15);
                color: #93c5fd;
            }
            .mv-status--pendiente {
                background: #fef3c7;
                color: #b45309;
            }
            .app-dark .mv-status--pendiente {
                background: rgba(245, 158, 11, 0.15);
                color: #fbbf24;
            }
            .mv-status--check-out {
                background: #f1f5f9;
                color: var(--hos-slate-500);
            }
            .app-dark .mv-status--check-out {
                background: rgba(100, 116, 139, 0.2);
                color: var(--hos-slate-300);
            }
            @media (max-width: 640px) {
                .mv-tr {
                    grid-template-columns: 1.2fr 0.7fr 0.8fr 1fr;
                }
                .mv-tr span:nth-child(2) {
                    display: none;
                }
                .mv-week {
                    display: none;
                }
            }
        `
    ]
})
export class BookingsView {
    bookings = BOOKINGS;
    week = [
        { d: 'L', n: '11' },
        { d: 'M', n: '12', on: true },
        { d: 'X', n: '13' },
        { d: 'J', n: '14' },
        { d: 'V', n: '15' },
        { d: 'S', n: '16' },
        { d: 'D', n: '17' }
    ];
}