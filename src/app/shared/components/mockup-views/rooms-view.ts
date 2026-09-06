import { Component } from '@angular/core';

@Component({
    selector: 'rooms-view',
    standalone: true,
    template: `
        <div class="rv">
            <div class="rv-head">
                <span class="rv-title">Plano de piso · Disponibilidad</span>
                <div class="rv-legend">
                    <span><i class="rv-dot" style="background: var(--hos-teal-400)"></i>Disponible</span>
                    <span><i class="rv-dot" style="background: #f59e0b"></i>Ocupada</span>
                </div>
            </div>
            <div class="rv-grid">
                @for (room of rooms; track $index) {
                    <div class="rv-room" [class.rv-room--occupied]="room.occupied" [class.rv-room--suite]="room.suite">
                        <b>{{ room.num }}</b>
                        <small>{{ room.type }}</small>
                    </div>
                }
            </div>
            <div class="rv-foot">
                <span class="rv-stat"><b>118</b> ocupadas</span>
                <span class="rv-stat"><b>24</b> disponibles</span>
                <span class="rv-stat"><b>€198</b> ADR</span>
            </div>
        </div>
    `,
    styles: [
        `
            .rv {
                padding: 20px;
            }
            .rv-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                gap: 10px;
                flex-wrap: wrap;
            }
            .rv-title {
                font-family: var(--hos-font-display);
                font-weight: 700;
                font-size: 1rem;
            }
            .rv-legend {
                display: flex;
                gap: 14px;
                font-size: 0.7rem;
                color: var(--hos-text-muted);
            }
            .rv-legend span {
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .rv-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                display: inline-block;
            }
            .rv-grid {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 10px;
            }
            .rv-room {
                border: 1px solid var(--hos-border);
                border-radius: 12px;
                padding: 12px 8px;
                text-align: center;
                background: var(--hos-surface-soft);
                transition: transform 0.3s ease, border-color 0.3s ease;
            }
            .rv-room:hover {
                transform: translateY(-3px);
                border-color: var(--hos-teal-300);
            }
            .rv-room b {
                display: block;
                font-size: 0.9rem;
            }
            .rv-room small {
                font-size: 0.62rem;
                color: var(--hos-text-muted);
            }
            .rv-room--occupied {
                border-color: rgba(245, 158, 11, 0.4);
                background: rgba(245, 158, 11, 0.06);
            }
            .rv-room--suite {
                grid-column: span 2;
            }
            .rv-foot {
                display: flex;
                gap: 16px;
                margin-top: 18px;
                flex-wrap: wrap;
            }
            .rv-stat {
                font-size: 0.75rem;
                color: var(--hos-text-muted);
            }
            .rv-stat b {
                font-size: 1rem;
                color: var(--hos-text);
                margin-right: 4px;
            }
        `
    ]
})
export class RoomsView {
    rooms = this.buildRooms();

    private buildRooms(): { num: string; type: string; occupied: boolean; suite: boolean }[] {
        const rooms: { num: string; type: string; occupied: boolean; suite: boolean }[] = [];
        const types = ['Estándar', 'Superior', 'Deluxe', 'Suite'];
        for (let i = 1; i <= 24; i++) {
            rooms.push({
                num: `${100 + i}`,
                type: types[i % 4],
                occupied: i % 3 === 0,
                suite: i % 8 === 0
            });
        }
        return rooms;
    }
}