import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountUpDirective } from '@/app/shared/directives/count-up.directive';
import { OCCUPANCY_TREND, SIDEBAR_NAV } from '@/app/shared/data/mock.data';

@Component({
    selector: 'gos-dashboard-mockup',
    standalone: true,
    imports: [CommonModule, CountUpDirective],
    template: `
        <div class="gos-mockup" role="img" aria-label="Vista previa del dashboard de Hospitality OS">
            <div class="gos-mockup__screen">
                <div class="gos-mockup__bar">
                    <div class="gos-mockup__windows">
                        <span class="gos-mockup__dot" style="background: #f87171"></span>
                        <span class="gos-mockup__dot" style="background: #fbbf24"></span>
                        <span class="gos-mockup__dot" style="background: #34d399"></span>
                    </div>
                    <div class="gos-mockup__title">
                        <i class="pi pi-building" style="color: var(--hos-teal-500)"></i>
                        Hospitality OS · Hotel Aurora
                    </div>
                    <span class="gos-pill"><i class="pi pi-circle-fill" style="font-size: 0.5rem"></i>Operación activa</span>
                </div>

                <div class="gos-dash">
                    <aside class="gos-dash__side">
                        @for (item of sidebar; track item.label; let i = $index) {
                            <div class="gos-dash__nav" [class.gos-dash__nav--active]="i === 0">
                                <i [ngClass]="item.icon"></i>{{ item.label }}
                            </div>
                        }
                    </aside>

                    <div class="gos-dash__main">
                        <div class="gos-dash__header">
                            <div>
                                <div class="gos-dash__title">Buenos días, equipo 👋</div>
                                <div class="gos-stat__label" style="margin-top: 4px">Vista general · Hotel Aurora</div>
                            </div>
                            <span class="gos-pill"><i class="pi pi-calendar"></i>Mayo 2026</span>
                        </div>

                        <div class="gos-stats">
                            <div class="gos-stat">
                                <div class="gos-stat__label">Ocupación</div>
                                <div class="gos-stat__value" hosCountUp>82.4%</div>
                                <span class="gos-stat__trend gos-trend--up"><i class="pi pi-arrow-up"></i>+6.8%</span>
                            </div>
                            <div class="gos-stat">
                                <div class="gos-stat__label">Ingresos</div>
                                <div class="gos-stat__value" hosCountUp>$18,420</div>
                                <span class="gos-stat__trend gos-trend--up"><i class="pi pi-arrow-up"></i>+12.3%</span>
                            </div>
                            <div class="gos-stat">
                                <div class="gos-stat__label">Check-in</div>
                                <div class="gos-stat__value" hosCountUp>34</div>
                                <span class="gos-stat__trend gos-trend--down"><i class="pi pi-clock"></i>12 pendientes</span>
                            </div>
                            <div class="gos-stat">
                                <div class="gos-stat__label">Habitaciones</div>
                                <div class="gos-stat__value" hosCountUp>118/142</div>
                                <span class="gos-stat__trend" style="color: var(--hos-teal-500)"><i class="pi pi-circle-off"></i>24 libres</span>
                            </div>
                        </div>

                        <div class="gos-dash__grid">
                            <div class="gos-chart-card gos-card">
                                <div class="gos-card-head">
                                    <span class="gos-card-title">Ocupación semanal</span>
                                    <span class="gos-pill"><i class="pi pi-chart-bar"></i>78% promedio</span>
                                </div>
                                <div class="gos-bars">
                                    @for (point of occupancy; track point.label; let i = $index) {
                                        <span [style.height.%]="point.value" [ngStyle]="{ 'animation-delay': i * 0.08 + 's' }" class="gos-bar"></span>
                                    }
                                </div>
                                <div class="gos-bars-labels">
                                    @for (point of occupancy; track point.label) {
                                        <span>{{ point.label }}</span>
                                    }
                                </div>
                            </div>

                            <div class="gos-rooms-card gos-card">
                                <div class="gos-card-head">
                                    <span class="gos-card-title">Estado de habitaciones</span>
                                </div>
                                <div class="gos-room-legend">
                                    <span><i style="background: var(--hos-teal-400)"></i>Limpias</span>
                                    <span><i style="background: #f59e0b"></i>Pendientes</span>
                                    <span><i style="background: #818cf8"></i>Inspección</span>
                                </div>
                                <div class="gos-rooms">
                                    @for (r of roomStates; track $index) {
                                        <span class="gos-room" [class]="roomClass(r)" title="{{ roomTitle(r) }}"></span>
                                    }
                                </div>
                                <div class="gos-activity" style="margin-top: 18px">
                                    <div class="gos-activity__item"><span class="gos-activity__dot" style="background: var(--hos-teal-400)"></span>Room 301 listo para check-in<span class="gos-activity__meta">hace 2 min</span></div>
                                    <div class="gos-activity__item"><span class="gos-activity__dot" style="background: #f59e0b"></span>Room 102 pendiente de limpieza<span class="gos-activity__meta">hace 8 min</span></div>
                                    <div class="gos-activity__item"><span class="gos-activity__dot" style="background: #818cf8"></span>Inspección en piso 1 completada<span class="gos-activity__meta">hace 15 min</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .gos-dash__grid {
                display: grid;
                grid-template-columns: 1.4fr 1fr;
                gap: 14px;
                margin-top: 16px;
            }
            .gos-card-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                gap: 10px;
                flex-wrap: wrap;
            }
            .gos-card-title {
                font-size: 0.85rem;
                font-weight: 700;
            }
            .gos-bars-labels {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                font-size: 0.68rem;
                color: var(--hos-text-muted);
            }
            .gos-bar {
                animation: gos-bar-grow 1s cubic-bezier(0.22, 1, 0.36, 1) both;
                transform-origin: bottom;
            }
            @keyframes gos-bar-grow {
                from {
                    opacity: 0;
                    transform: scaleY(0);
                }
                to {
                    opacity: 0.8;
                    transform: scaleY(1);
                }
            }
            .gos-room-legend {
                display: flex;
                gap: 16px;
                font-size: 0.7rem;
                color: var(--hos-text-muted);
                margin-bottom: 12px;
                flex-wrap: wrap;
            }
            .gos-room-legend span {
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .gos-room-legend i {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                display: inline-block;
            }
            @media (max-width: 900px) {
                .gos-dash__grid {
                    grid-template-columns: 1fr;
                }
            }
            @media (max-width: 640px) {
                .gos-dash {
                    grid-template-columns: 1fr;
                }
                .gos-dash__side {
                    display: none;
                }
                .gos-stats {
                    grid-template-columns: repeat(2, 1fr);
                }
                .gos-rooms {
                    grid-template-columns: repeat(5, 1fr);
                }
            }
        `
    ]
})
export class GosDashboardMockup {
    sidebar = SIDEBAR_NAV;
    occupancy = OCCUPANCY_TREND;

    roomStates = this.buildRoomStates();

    roomClass(value: string): string {
        return `gos-room--${value}`;
    }

    roomTitle(value: string): string {
        const map: Record<string, string> = {
            clean: 'Limpia',
            dirty: 'Pendiente',
            inspection: 'Inspección',
            maintenance: 'Mantenimiento'
        };
        return map[value] ?? value;
    }

    private buildRoomStates(): string[] {
        const states: string[] = [];
        for (let i = 0; i < 40; i++) {
            const roll = (i * 7 + 3) % 10;
            if (roll < 6) states.push('clean');
            else if (roll < 8) states.push('dirty');
            else if (roll < 9) states.push('inspection');
            else states.push('maintenance');
        }
        return states;
    }
}