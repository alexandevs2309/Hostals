import { Component } from '@angular/core';

@Component({
    selector: 'dashboard-view',
    standalone: true,
    template: `
        <div class="dv">
            <div class="dv-head">
                <span class="dv-title">Buenos días, equipo 👋</span>
                <span class="dv-pill"><i class="pi pi-calendar"></i>Mayo 2026</span>
            </div>
            <div class="dv-kpis">
                <div class="dv-kpi"><span>Ocupación</span><b>82.4%</b><small class="up"><i class="pi pi-arrow-up"></i>6.8%</small></div>
                <div class="dv-kpi"><span>Ingresos</span><b>$18,420</b><small class="up"><i class="pi pi-arrow-up"></i>12.3%</small></div>
                <div class="dv-kpi"><span>Check-in</span><b>34</b><small>12 pendientes</small></div>
                <div class="dv-kpi"><span>Habitaciones</span><b>118/142</b><small style="color: var(--hos-teal-500)">24 libres</small></div>
            </div>
            <div class="dv-bottom">
                <div class="dv-chart">
                    <span class="dv-sub">Ocupación semanal</span>
                    <div class="dv-bars">
                        @for (bar of bars; track $index) {
                            <span [style.height.%]="bar" style="animation-delay: {{ $index * 0.08 }}s"></span>
                        }
                    </div>
                </div>
                <div class="dv-act">
                    <span class="dv-sub">Actividad</span>
                    <div class="dv-act-row"><i style="background: var(--hos-teal-400)"></i>Room 301 listo <small>2m</small></div>
                    <div class="dv-act-row"><i style="background: #f59e0b"></i>102 pendiente <small>8m</small></div>
                    <div class="dv-act-row"><i style="background: #818cf8"></i>Inspección piso 1 <small>15m</small></div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .dv {
                padding: 20px;
            }
            .dv-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 16px;
                gap: 10px;
                flex-wrap: wrap;
            }
            .dv-title {
                font-family: var(--hos-font-display);
                font-weight: 700;
                font-size: 1.05rem;
            }
            .dv-pill {
                font-size: 0.68rem;
                font-weight: 700;
                padding: 4px 12px;
                border-radius: 999px;
                background: var(--hos-primary-soft);
                color: var(--hos-primary);
            }
            .dv-kpis {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin-bottom: 16px;
            }
            .dv-kpi {
                border: 1px solid var(--hos-border);
                border-radius: 12px;
                padding: 12px;
            }
            .dv-kpi span {
                font-size: 0.62rem;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                color: var(--hos-text-muted);
                font-weight: 600;
            }
            .dv-kpi b {
                display: block;
                font-size: 1.05rem;
                margin: 4px 0;
            }
            .dv-kpi small {
                font-size: 0.62rem;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                gap: 3px;
            }
            .dv-kpi .up {
                color: var(--hos-teal-500);
            }
            .dv-bottom {
                display: grid;
                grid-template-columns: 1.4fr 1fr;
                gap: 14px;
            }
            .dv-chart,
            .dv-act {
                border: 1px solid var(--hos-border);
                border-radius: 14px;
                padding: 16px;
            }
            .dv-sub {
                font-size: 0.75rem;
                font-weight: 700;
                display: block;
                margin-bottom: 12px;
            }
            .dv-bars {
                display: flex;
                align-items: flex-end;
                gap: 8px;
                height: 90px;
            }
            .dv-bars span {
                flex: 1;
                border-radius: 6px 6px 2px 2px;
                background: linear-gradient(180deg, var(--hos-teal-400), var(--hos-teal-600));
                animation: gos-bar-grow 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
                transform-origin: bottom;
            }
            .dv-act-row {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.7rem;
                padding: 6px 0;
            }
            .dv-act-row i {
                width: 8px;
                height: 8px;
                border-radius: 50%;
            }
            .dv-act-row small {
                margin-left: auto;
                color: var(--hos-text-muted);
                font-size: 0.62rem;
            }
            @keyframes gos-bar-grow {
                from {
                    opacity: 0;
                    transform: scaleY(0);
                }
                to {
                    opacity: 1;
                    transform: scaleY(1);
                }
            }
            @media (max-width: 640px) {
                .dv-bottom {
                    grid-template-columns: 1fr;
                }
                .dv-kpis {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        `
    ]
})
export class DashboardView {
    bars = [62, 71, 68, 78, 84, 90, 82];
}