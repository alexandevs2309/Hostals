import { Component } from '@angular/core';

@Component({
    selector: 'analytics-view',
    standalone: true,
    template: `
        <div class="av">
            <div class="av-head">
                <span class="av-title">Analytics · Mayo 2026</span>
                <span class="av-pill">vs Abril <i class="pi pi-arrow-up"></i> +8%</span>
            </div>
            <div class="av-kpis">
                <div class="av-kpi"><span>Occupancy</span><b>82.4%</b><small class="up"><i class="pi pi-arrow-up"></i>6.8%</small></div>
                <div class="av-kpi"><span>ADR</span><b>$198</b><small class="up"><i class="pi pi-arrow-up"></i>4.2%</small></div>
                <div class="av-kpi"><span>RevPAR</span><b>$163</b><small class="up"><i class="pi pi-arrow-up"></i>9.1%</small></div>
                <div class="av-kpi"><span>Ingresos</span><b>$18.4k</b><small class="up"><i class="pi pi-arrow-up"></i>12.3%</small></div>
            </div>
            <div class="av-chart">
                @for (bar of bars; track $index) {
                    <div class="av-bar-col">
                        <span class="av-bar" [style.height.%]="bar"></span>
                        <small>{{ week[$index] }}</small>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [
        `
            .av {
                padding: 20px;
            }
            .av-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 18px;
                gap: 10px;
                flex-wrap: wrap;
            }
            .av-title {
                font-family: var(--hos-font-display);
                font-weight: 700;
                font-size: 1rem;
            }
            .av-pill {
                font-size: 0.68rem;
                font-weight: 700;
                padding: 4px 12px;
                border-radius: 999px;
                background: var(--hos-teal-50);
                color: var(--hos-teal-700);
            }
            .app-dark .av-pill {
                background: rgba(var(--hos-accent-rgb), 0.12);
                color: var(--hos-teal-300);
            }
            .av-kpis {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
                margin-bottom: 18px;
            }
            .av-kpi {
                border: 1px solid var(--hos-border);
                border-radius: 12px;
                padding: 12px;
            }
            .av-kpi span {
                font-size: 0.62rem;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                color: var(--hos-text-muted);
                font-weight: 600;
            }
            .av-kpi b {
                display: block;
                font-size: 1.05rem;
                margin: 4px 0;
            }
            .av-kpi small {
                font-size: 0.62rem;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                gap: 3px;
            }
            .av-kpi .up {
                color: var(--hos-teal-500);
            }
            .av-chart {
                display: flex;
                align-items: flex-end;
                gap: 10px;
                height: 120px;
                border: 1px solid var(--hos-border);
                border-radius: 14px;
                padding: 16px;
            }
            .av-bar-col {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                height: 100%;
                justify-content: flex-end;
            }
            .av-bar {
                width: 100%;
                max-width: 30px;
                border-radius: 6px 6px 2px 2px;
                background: linear-gradient(180deg, var(--hos-teal-400), var(--hos-teal-600));
                animation: gos-bar-grow 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
                transform-origin: bottom;
            }
            .av-bar-col small {
                font-size: 0.62rem;
                color: var(--hos-text-muted);
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
        `
    ]
})
export class AnalyticsView {
    week = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    bars = [58, 72, 66, 81, 88, 94, 78];
}