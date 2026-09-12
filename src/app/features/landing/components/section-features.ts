import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StaggerDirective, RevealDirective } from '@/app/shared/directives/reveal.directive';

@Component({
    selector: 'gos-section-features',
    standalone: true,
    imports: [RouterModule, StaggerDirective, RevealDirective],
    template: `
        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-section-head" hosReveal>
                    <span class="gos-eyebrow"><i class="pi pi-box"></i>Una plataforma</span>
                    <h2 class="gos-title gos-title--center">De la recepción al back office, todo conectado.</h2>
                    <p class="gos-subtitle">Elimina hojas de cálculo, aplicaciones aisladas y procesos manuales. Cada equipo trabaja con la misma información en tiempo real.</p>
                </div>

                <div class="gos-bento" hosStagger>

                    <div class="gos-bento__item hos-hover-lift" style="grid-column: span 7">
                        <div class="gos-bento__icon"><i class="pi pi-calendar"></i></div>
                        <h3>Reservaciones</h3>
                        <p>Calendario, disponibilidad, tarifas, check-in, check-out y folios sin salir de la plataforma.</p>
                        <div class="gos-bento__stats">
                            <span><b>0</b> overbookings</span>
                            <span><b>−35%</b> tiempo de check-in</span>
                        </div>
                        <a class="gos-text-link" routerLink="/modules/reservations">Ver módulo <i class="pi pi-arrow-right" style="font-size: 0.7rem"></i></a>
                    </div>

                    <div class="gos-bento__item hos-hover-scale hos-bento-rotate" style="grid-column: span 5">
                        <div class="gos-bento__icon"><i class="pi pi-building"></i></div>
                        <h3>Habitaciones</h3>
                        <p>Inventario, tipos de habitación y estado en tiempo real.</p>
                        <div class="gos-bento__room-strip">
                            <span class="gos-bento__room r-clean" title="Limpia"></span>
                            <span class="gos-bento__room r-clean" title="Limpia"></span>
                            <span class="gos-bento__room r-clean" title="Limpia"></span>
                            <span class="gos-bento__room r-dirty" title="Pendiente"></span>
                            <span class="gos-bento__room r-inspect" title="Inspección"></span>
                            <span class="gos-bento__room r-clean" title="Limpia"></span>
                            <span class="gos-bento__room r-clean" title="Limpia"></span>
                            <span class="gos-bento__room r-maint" title="Mantenimiento"></span>
                        </div>
                    </div>

                    <div class="gos-bento__item hos-bento-gradient hos-bento-reveal" style="grid-column: span 5">
                        <div class="gos-bento__icon"><i class="pi pi-user"></i></div>
                        <h3>Huéspedes</h3>
                        <p>Vista 360° de cada huésped.</p>
                        <div class="gos-bento__extra">
                            <p>Historial, preferencias, solicitudes y gasto acumulado para personalizar cada estancia.</p>
                            <div class="gos-bento__guest-pill">
                                <span class="gos-bento__guest-av">MS</span>
                                <span><b>María S.</b> · 12 estancias · $4,850 LTV</span>
                            </div>
                            <a class="gos-text-link" routerLink="/modules/guests">Ver módulo <i class="pi pi-arrow-right" style="font-size: 0.7rem"></i></a>
                        </div>
                    </div>

                    <div class="gos-bento__item hos-hover-lift hos-bento-rotate" style="grid-column: span 7">
                        <div class="gos-bento__icon"><i class="pi pi-box"></i></div>
                        <h3>Housekeeping</h3>
                        <p>Estados de habitación en vivo, asignación de cámaras y sincronización automática con el front desk.</p>
                        <div class="gos-bento__stats">
                            <span><b>−42%</b> tiempo de respuesta</span>
                            <span><b>2.5x</b> habitaciones/turno</span>
                        </div>
                    </div>

                    <div class="gos-bento__item hos-bento-reveal hos-bento-border" style="grid-column: span 4">
                        <div class="gos-bento__icon"><i class="pi pi-wrench"></i></div>
                        <h3>Mantenimiento</h3>
                        <p>Incidencias y seguimiento.</p>
                        <div class="gos-bento__extra">
                            <div class="gos-bento__ticket">
                                <span class="gos-bento__ticket-badge">Crítico</span>
                                <span>Hab. 412 · Fuga de agua</span>
                                <span class="gos-bento__ticket-sla">SLA 1h</span>
                            </div>
                        </div>
                    </div>

                    <div class="gos-bento__item hos-bento-glow" style="grid-column: span 4">
                        <div class="gos-bento__icon"><i class="pi pi-dollar"></i></div>
                        <h3>Finanzas</h3>
                        <p>Ingresos, gastos, cierres de caja y métricas en un solo lugar.</p>
                        <div class="gos-bento__stats">
                            <span><b>1 día</b> para cerrar el mes</span>
                        </div>
                    </div>

                    <div class="gos-bento__item hos-hover-scale hos-bento-reveal" style="grid-column: span 4">
                        <div class="gos-bento__icon"><i class="pi pi-chart-line"></i></div>
                        <h3>Analytics</h3>
                        <p>KPIs y reportes.</p>
                        <div class="gos-bento__extra">
                            <div class="gos-bento__kpi-row">
                                <div class="gos-bento__kpi"><span>Occ.</span><b>82%</b></div>
                                <div class="gos-bento__kpi"><span>ADR</span><b>$198</b></div>
                                <div class="gos-bento__kpi"><span>RevPAR</span><b>$163</b></div>
                            </div>
                        </div>
                    </div>

                    <div class="gos-bento__item hos-bento-border hos-hover-lift" style="grid-column: span 12">
                        <div class="gos-bento__row">
                            <div class="gos-bento__icon"><i class="pi pi-sitemap"></i></div>
                            <div>
                                <h3>Integraciones</h3>
                                <p>Conecta canales de distribución, pagos, cerraduras electrónicas y tu stack tecnológico completo.</p>
                            </div>
                            <a class="gos-btn gos-btn--ghost" routerLink="/integrations">Ver integraciones <i class="pi pi-arrow-right"></i></a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    `,
    styles: [
        `
            .gos-text-link {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                margin-top: 16px;
                font-size: 0.85rem;
                font-weight: 700;
                color: var(--hos-teal-600);
                transition: gap 0.2s ease, color 0.2s ease;
            }
            .app-dark .gos-text-link {
                color: var(--hos-teal-400);
            }
            .gos-text-link:hover {
                gap: 10px;
                color: var(--hos-teal-500);
            }
            .gos-bento__row {
                display: flex;
                align-items: center;
                gap: 24px;
                flex-wrap: wrap;
            }
            .gos-bento__row .gos-btn {
                margin-left: auto;
            }
            /* Stats en bento */
            .gos-bento__stats {
                display: flex;
                gap: 16px;
                flex-wrap: wrap;
                margin-top: 14px;
            }
            .gos-bento__stats span {
                font-size: 0.82rem;
                color: var(--hos-text-muted);
            }
            .gos-bento__stats b {
                color: var(--hos-primary);
                font-weight: 800;
            }
            /* Mini habitaciones */
            .gos-bento__room-strip {
                display: flex;
                gap: 6px;
                flex-wrap: wrap;
                margin-top: 14px;
            }
            .gos-bento__room {
                width: 22px; height: 22px;
                border-radius: 6px;
            }
            .r-clean   { background: var(--hos-teal-400); }
            .r-dirty   { background: #f59e0b; }
            .r-inspect { background: #818cf8; }
            .r-maint   { background: #94a3b8; }
            /* Perfil de huésped */
            .gos-bento__guest-pill {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                background: var(--hos-bg);
                border: 1px solid var(--hos-border);
                border-radius: 10px;
                font-size: 0.78rem;
                margin-top: 10px;
            }
            .gos-bento__guest-av {
                width: 28px; height: 28px;
                border-radius: 50%;
                background: linear-gradient(135deg, var(--hos-teal-500), var(--hos-teal-700));
                color: #fff; font-size: 0.62rem; font-weight: 800;
                display: grid; place-items: center; flex-shrink: 0;
            }
            /* Ticket de mantenimiento */
            .gos-bento__ticket {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 8px 12px;
                background: var(--hos-bg);
                border: 1px solid var(--hos-border);
                border-left: 3px solid #ef4444;
                border-radius: 8px;
                font-size: 0.78rem;
                margin-top: 10px;
                flex-wrap: wrap;
            }
            .gos-bento__ticket-badge {
                font-size: 0.62rem; font-weight: 800;
                padding: 2px 8px; border-radius: 6px;
                background: rgba(239,68,68,.1); color: #ef4444;
                white-space: nowrap;
            }
            .gos-bento__ticket-sla {
                margin-left: auto;
                font-size: 0.68rem; font-weight: 800;
                color: #ef4444; white-space: nowrap;
            }
            /* KPI row analytics */
            .gos-bento__kpi-row {
                display: flex;
                gap: 8px;
                margin-top: 10px;
            }
            .gos-bento__kpi {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 2px;
                padding: 8px 6px;
                background: var(--hos-bg);
                border: 1px solid var(--hos-border);
                border-radius: 8px;
            }
            .gos-bento__kpi span {
                font-size: 0.6rem; text-transform: uppercase;
                letter-spacing: .06em; color: var(--hos-text-muted); font-weight: 600;
            }
            .gos-bento__kpi b {
                font-family: var(--hos-font-display);
                font-size: 0.9rem; font-weight: 800;
                color: var(--hos-primary);
            }
            @media (max-width: 900px) {
                .gos-bento__item {
                    grid-column: span 12 !important;
                }
                .gos-bento__row .gos-btn {
                    margin-left: 0;
                }
            }
        `
    ]
})
export class GosSectionFeatures {}