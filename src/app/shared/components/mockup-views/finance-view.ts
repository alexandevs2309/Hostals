import { Component } from '@angular/core';

@Component({
    selector: 'finance-view',
    standalone: true,
    template: `
        <div class="fv">
            <div class="fv-head">
                <span class="fv-title">Finanzas · Cierre de mayo</span>
                <span class="fv-pill">Cerrado <i class="pi pi-check"></i></span>
            </div>
            <div class="fv-kpis">
                <div class="fv-kpi fv-kpi--rev">
                    <span>Ingresos totales</span>
                    <b>$18,420</b>
                    <small class="up"><i class="pi pi-arrow-up"></i>12.3%</small>
                </div>
                <div class="fv-kpi fv-kpi--exp">
                    <span>Gastos</span>
                    <b>$7,940</b>
                    <small class="down"><i class="pi pi-arrow-down"></i>3.1%</small>
                </div>
                <div class="fv-kpi fv-kpi--net">
                    <span>Margen neto</span>
                    <b>56.9%</b>
                    <small class="up"><i class="pi pi-arrow-up"></i>2.4%</small>
                </div>
            </div>
            <div class="fv-list">
                <div class="fv-row"><span>Alojamiento (habitaciones)</span><b>+$12,900</b></div>
                <div class="fv-row"><span>Restaurante & bar</span><b>+$3,280</b></div>
                <div class="fv-row"><span>Servicios adicionales</span><b>+$2,240</b></div>
                <div class="fv-row"><span>Personal & operación</span><b style="color:#ef4444">−$5,120</b></div>
                <div class="fv-row"><span>Mantenimiento y utilidades</span><b style="color:#ef4444">−$2,820</b></div>
            </div>
        </div>
    `,
    styles: [
        `
            .fv {
                padding: 20px;
            }
            .fv-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 18px;
                gap: 10px;
            }
            .fv-title {
                font-family: var(--hos-font-display);
                font-weight: 700;
                font-size: 1rem;
            }
            .fv-pill {
                font-size: 0.68rem;
                font-weight: 700;
                padding: 4px 12px;
                border-radius: 999px;
                background: var(--hos-teal-50);
                color: var(--hos-teal-700);
            }
            .app-dark .fv-pill {
                background: rgba(var(--hos-accent-rgb), 0.12);
                color: var(--hos-teal-300);
            }
            .fv-kpis {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-bottom: 18px;
            }
            .fv-kpi {
                border: 1px solid var(--hos-border);
                border-radius: 12px;
                padding: 14px;
            }
            .fv-kpi span {
                font-size: 0.62rem;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                color: var(--hos-text-muted);
                font-weight: 600;
            }
            .fv-kpi b {
                display: block;
                font-size: 1.1rem;
                margin: 4px 0;
            }
            .fv-kpi small {
                font-size: 0.62rem;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                gap: 3px;
            }
            .fv-kpi .up {
                color: var(--hos-teal-500);
            }
            .fv-kpi .down {
                color: #ef4444;
            }
            .fv-list {
                border: 1px solid var(--hos-border);
                border-radius: 14px;
                overflow: hidden;
            }
            .fv-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px 14px;
                font-size: 0.78rem;
                border-bottom: 1px solid var(--hos-border);
            }
            .fv-row:last-child {
                border-bottom: 0;
            }
            .fv-row b {
                font-variant-numeric: tabular-nums;
            }
        `
    ]
})
export class FinanceView {}