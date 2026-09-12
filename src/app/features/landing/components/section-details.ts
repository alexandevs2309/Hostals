import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GosScreenMockup } from '@/app/shared/components/screen-mockup';
import { RevealDirective } from '@/app/shared/directives/reveal.directive';
import { CountUpDirective } from '@/app/shared/directives/count-up.directive';

// ─── Estilos compartidos entre secciones split ─────────────────────────────
function sharedStyles(): string[] {
    return [`
        .det-split {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 72px;
            align-items: center;
        }
        .det-split--rev .det-content { order: 2; }
        .det-split--rev .det-mock    { order: 1; }

        .det-content {
            display: flex;
            flex-direction: column;
            gap: 18px;
            align-items: flex-start;
        }
        .det-content h2 {
            font-size: clamp(1.75rem, 3.4vw, 2.5rem);
            font-weight: 800;
            letter-spacing: -0.035em;
            line-height: 1.1;
            margin: 0;
        }
        .det-content p {
            color: var(--hos-text-muted);
            font-size: 1.02rem;
            line-height: 1.72;
            margin: 0;
            max-width: 480px;
        }
        .det-list {
            list-style: none;
            margin: 0; padding: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .det-list li {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 0.95rem;
            line-height: 1.5;
        }
        .det-list li i {
            color: var(--hos-teal-500);
            font-size: 0.85rem;
            margin-top: 3px;
            flex-shrink: 0;
        }
        .det-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-top: 4px;
            font-weight: 700;
            font-size: 0.9rem;
            color: var(--hos-teal-600);
            transition: gap 0.2s ease;
        }
        .app-dark .det-link { color: var(--hos-teal-400); }
        .det-link:hover { gap: 12px; }

        .det-mock {
            position: relative;
        }
        .det-glow {
            position: absolute;
            width: 380px; height: 380px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(45,212,191,.16), transparent 65%);
            filter: blur(60px);
            z-index: 0;
            top: 50%; left: 50%;
            translate: -50% -50%;
            pointer-events: none;
        }

        @media (max-width: 900px) {
            .det-split {
                grid-template-columns: 1fr;
                gap: 40px;
            }
            .det-split--rev .det-content { order: 0; }
            .det-split--rev .det-mock    { order: 1; }
        }
    `];
}

// ════════════════════════════════════════════════════════════════════════════
// RESERVACIONES — sección hero de módulo, ancho completo, más visual
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'gos-section-reservations-detail',
    standalone: true,
    imports: [RouterModule, GosScreenMockup, RevealDirective, CountUpDirective],
    template: `
        <section class="gos-section res-section">
            <!-- fondo degradado sutil -->
            <div class="res-bg" aria-hidden="true"></div>

            <div class="gos-container">
                <!-- cabecera centrada -->
                <div class="res-head" hosReveal>
                    <span class="gos-eyebrow"><i class="pi pi-calendar"></i>Reservaciones & PMS</span>
                    <h2 class="res-head__title">
                        Controla cada reserva.<br>
                        <span class="gos-grad-text">Sin salir de la plataforma.</span>
                    </h2>
                    <p class="res-head__sub">
                        Calendario, disponibilidad, tarifas y folios. Todo lo que recepción necesita para hospedar impecablemente, sin cambiar de sistema.
                    </p>
                </div>

                <!-- stats rápidos -->
                <div class="res-stats" hosReveal>
                    <div class="res-stat">
                        <span class="res-stat__val" hosCountUp>−35%</span>
                        <span class="res-stat__lbl">tiempo de check-in</span>
                    </div>
                    <div class="res-stat__sep"></div>
                    <div class="res-stat">
                        <span class="res-stat__val" hosCountUp>0</span>
                        <span class="res-stat__lbl">overbookings</span>
                    </div>
                    <div class="res-stat__sep"></div>
                    <div class="res-stat">
                        <span class="res-stat__val" hosCountUp>100%</span>
                        <span class="res-stat__lbl">tarifas sincronizadas</span>
                    </div>
                    <div class="res-stat__sep"></div>
                    <div class="res-stat">
                        <span class="res-stat__val" hosCountUp>1 clic</span>
                        <span class="res-stat__lbl">para check-out</span>
                    </div>
                </div>

                <!-- mockup grande centrado -->
                <div class="res-mock" hosReveal>
                    <div class="res-mock__glow" aria-hidden="true"></div>
                    <gos-screen-mockup variant="reservations" />
                    <a class="det-link res-cta" routerLink="/modules/reservations">
                        Ver módulo completo <i class="pi pi-arrow-right"></i>
                    </a>
                </div>
            </div>
        </section>
    `,
    styles: [`
        .res-section {
            position: relative;
            overflow: hidden;
        }
        .res-bg {
            position: absolute;
            inset: 0;
            background:
                radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20,184,166,.07) 0%, transparent 65%),
                radial-gradient(ellipse 60% 40% at 80% 100%, rgba(99,102,241,.05) 0%, transparent 60%);
            pointer-events: none;
        }
        .res-head {
            text-align: center;
            max-width: 760px;
            margin-inline: auto;
            margin-bottom: 2.5rem;
        }
        .res-head__title {
            font-family: var(--hos-font-display);
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 800;
            letter-spacing: -0.04em;
            line-height: 1.1;
            margin: 1rem 0 1rem;
        }
        .res-head__sub {
            color: var(--hos-text-muted);
            font-size: 1.05rem;
            line-height: 1.7;
            margin: 0;
        }

        /* stats horizontales */
        .res-stats {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            gap: 0;
            padding: 1.5rem 2.5rem;
            background: var(--hos-surface);
            border: 1px solid var(--hos-border);
            border-radius: 20px;
            max-width: 860px;
            margin: 0 auto 3rem;
            box-shadow: var(--hos-shadow-sm);
        }
        .res-stat {
            display: flex; flex-direction: column;
            align-items: center; gap: 4px;
            padding: 0 32px;
        }
        .res-stat__val {
            font-family: var(--hos-font-display);
            font-size: 1.875rem; font-weight: 800;
            letter-spacing: -0.03em;
            color: var(--hos-primary);
        }
        .res-stat__lbl {
            font-size: 0.72rem; font-weight: 600;
            text-transform: uppercase; letter-spacing: .08em;
            color: var(--hos-text-muted); white-space: nowrap;
        }
        .res-stat__sep {
            width: 1px; height: 40px;
            background: var(--hos-border); flex-shrink: 0;
        }
        .res-mock {
            position: relative;
            max-width: 1000px;
            margin-inline: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
        }
        .res-mock__glow {
            position: absolute;
            width: 600px; height: 400px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(20,184,166,.12), transparent 65%);
            filter: blur(80px);
            top: 50%; left: 50%;
            translate: -50% -50%;
            pointer-events: none; z-index: 0;
        }
        .res-mock gos-screen-mockup { position: relative; z-index: 1; }
        .res-cta { font-size: 1rem; }

        @media (max-width: 640px) {
            .res-stats { border-radius: 14px; padding: 1rem 1.25rem; }
            .res-stat { padding: 0 16px; }
            .res-stat__sep { height: 1px; width: 40px; }
        }
    `]
})
export class GosSectionReservationsDetail {}

// ════════════════════════════════════════════════════════════════════════════
// HOUSEKEEPING — split inverso, fondo suave, badge de estado en vivo
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'gos-section-housekeeping-detail',
    standalone: true,
    imports: [RouterModule, GosScreenMockup, RevealDirective],
    template: `
        <section class="gos-section gos-section--soft hk-section">
            <div class="gos-container">
                <div class="det-split det-split--rev">
                    <div class="det-content" hosReveal>
                        <span class="gos-eyebrow"><i class="pi pi-sparkles"></i>Housekeeping</span>
                        <h2>Habitaciones listas<br><em class="hk-em">cuando deben estarlo.</em></h2>
                        <p>Estados de habitación en vivo, asignación de cámaras e inspecciones. Recepción y limpieza siempre sincronizadas — sin radios, sin papel.</p>

                        <!-- tarjeta de estado inline -->
                        <div class="hk-status-strip">
                            <div class="hk-dot hk-dot--clean"></div>
                            <span><strong>86</strong> limpias</span>
                            <div class="hk-dot hk-dot--dirty"></div>
                            <span><strong>24</strong> pendientes</span>
                            <div class="hk-dot hk-dot--inspect"></div>
                            <span><strong>8</strong> inspección</span>
                        </div>

                        <ul class="det-list">
                            <li><i class="pi pi-check"></i>Pendientes y prioridades ordenadas en un vistazo</li>
                            <li><i class="pi pi-check"></i>Asignación de camareras por turno</li>
                            <li><i class="pi pi-check"></i>Inspecciones y transición automática de estados</li>
                        </ul>
                        <a class="det-link" routerLink="/modules/housekeeping">Ver módulo Housekeeping <i class="pi pi-arrow-right"></i></a>
                    </div>
                    <div class="det-mock" hosReveal="left">
                        <span class="det-glow"></span>
                        <gos-screen-mockup variant="housekeeping" />
                    </div>
                </div>
            </div>
        </section>
    `,
    styles: [
        ...sharedStyles(),
        `
        .hk-em {
            font-style: normal;
            background: var(--hos-grad);
            -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent; color: transparent;
        }
        .hk-status-strip {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            padding: 12px 18px;
            background: var(--hos-surface);
            border: 1px solid var(--hos-border);
            border-radius: 12px;
            font-size: 0.85rem;
            color: var(--hos-text);
        }
        .hk-status-strip strong { font-weight: 700; }
        .hk-dot {
            width: 10px; height: 10px;
            border-radius: 50%; flex-shrink: 0;
        }
        .hk-dot--clean     { background: var(--hos-teal-400); }
        .hk-dot--dirty     { background: #f59e0b; }
        .hk-dot--inspect   { background: #818cf8; }
    `]
})
export class GosSectionHousekeepingDetail {}

// ════════════════════════════════════════════════════════════════════════════
// HUÉSPEDES — fondo blanco, tarjeta de perfil inline antes de la lista
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'gos-section-guests-detail',
    standalone: true,
    imports: [RouterModule, GosScreenMockup, RevealDirective],
    template: `
        <section class="gos-section gu-section">
            <div class="gu-pattern" aria-hidden="true"></div>
            <div class="gos-container">
                <div class="det-split">
                    <div class="det-content" hosReveal>
                        <span class="gos-eyebrow"><i class="pi pi-user"></i>Huéspedes</span>
                        <h2>Una vista <span class="gu-accent">360°</span> de cada huésped.</h2>
                        <p>Historial, preferencias, solicitudes y gasto acumulado en un solo perfil. Personaliza cada estancia como si fuera la primera.</p>

                        <!-- mini perfil ficticio -->
                        <div class="gu-profile">
                            <div class="gu-avatar">MS</div>
                            <div class="gu-profile__info">
                                <span class="gu-profile__name">María Soler</span>
                                <span class="gu-profile__meta">12 estancias · $4,850 LTV · Suite Deluxe</span>
                            </div>
                            <span class="gos-pill gu-pill"><i class="pi pi-star-fill"></i>VIP</span>
                        </div>

                        <ul class="det-list">
                            <li><i class="pi pi-check"></i>Perfil completo con historial de estancias</li>
                            <li><i class="pi pi-check"></i>Preferencias y solicitudes recordadas</li>
                            <li><i class="pi pi-check"></i>Gasto total y última estancia</li>
                        </ul>
                        <a class="det-link" routerLink="/modules/guests">Ver módulo Huéspedes <i class="pi pi-arrow-right"></i></a>
                    </div>
                    <div class="det-mock" hosReveal="right">
                        <span class="det-glow"></span>
                        <gos-screen-mockup variant="guests" />
                    </div>
                </div>
            </div>
        </section>
    `,
    styles: [
        ...sharedStyles(),
        `
        .gu-section { position: relative; overflow: hidden; }
        .gu-pattern {
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, rgba(20,184,166,.08) 1px, transparent 1px);
            background-size: 28px 28px;
            mask-image: radial-gradient(ellipse 70% 80% at 80% 50%, black, transparent);
            -webkit-mask-image: radial-gradient(ellipse 70% 80% at 80% 50%, black, transparent);
            pointer-events: none;
        }
        .gu-accent {
            background: var(--hos-grad);
            -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent; color: transparent;
        }
        .gu-profile {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            background: var(--hos-surface);
            border: 1px solid var(--hos-border);
            border-radius: 14px;
            box-shadow: var(--hos-shadow-sm);
            width: 100%;
            max-width: 440px;
        }
        .gu-avatar {
            width: 42px; height: 42px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--hos-teal-500), var(--hos-teal-700));
            color: #fff; font-weight: 700; font-size: 0.9rem;
            display: grid; place-items: center; flex-shrink: 0;
        }
        .gu-profile__info {
            display: flex; flex-direction: column; gap: 2px; flex: 1;
        }
        .gu-profile__name {
            font-weight: 700; font-size: 0.9rem;
        }
        .gu-profile__meta {
            font-size: 0.72rem; color: var(--hos-text-muted);
        }
        .gu-pill {
            font-size: 0.68rem; flex-shrink: 0;
        }
    `]
})
export class GosSectionGuestsDetail {}

// ════════════════════════════════════════════════════════════════════════════
// MANTENIMIENTO — fondo soft, ticket de prioridad crítica inline
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'gos-section-maintenance-detail',
    standalone: true,
    imports: [RouterModule, GosScreenMockup, RevealDirective],
    template: `
        <section class="gos-section gos-section--soft mt-section">
            <div class="gos-container">
                <div class="det-split det-split--rev">
                    <div class="det-content" hosReveal>
                        <span class="gos-eyebrow"><i class="pi pi-wrench"></i>Mantenimiento</span>
                        <h2>Incidencias que<br><span class="mt-accent">no esperan.</span></h2>
                        <p>Tickets con prioridad, responsable y SLA. Mantenimiento prioriza lo crítico y la gerencia ve el estado real de cada activo.</p>

                        <!-- ticket ficticio -->
                        <div class="mt-ticket">
                            <div class="mt-ticket__badge mt-ticket__badge--crit">Crítico</div>
                            <div class="mt-ticket__info">
                                <span class="mt-ticket__room">Hab. 412</span>
                                <span class="mt-ticket__issue">Fuga de agua en baño</span>
                            </div>
                            <div class="mt-ticket__sla">
                                <span class="mt-ticket__sla-label">SLA</span>
                                <span class="mt-ticket__sla-val">1h</span>
                            </div>
                        </div>

                        <ul class="det-list">
                            <li><i class="pi pi-check"></i>Prioridades y estados claros</li>
                            <li><i class="pi pi-check"></i>Responsables y seguimiento por ticket</li>
                            <li><i class="pi pi-check"></i>Cumplimiento de SLA en el tablero</li>
                        </ul>
                        <a class="det-link" routerLink="/modules/maintenance">Ver módulo Mantenimiento <i class="pi pi-arrow-right"></i></a>
                    </div>
                    <div class="det-mock" hosReveal="left">
                        <span class="det-glow"></span>
                        <gos-screen-mockup variant="maintenance" />
                    </div>
                </div>
            </div>
        </section>
    `,
    styles: [
        ...sharedStyles(),
        `
        .mt-accent {
            background: var(--hos-grad);
            -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent; color: transparent;
        }
        .mt-ticket {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            background: var(--hos-surface);
            border: 1px solid var(--hos-border);
            border-left: 4px solid #ef4444;
            border-radius: 12px;
            max-width: 440px;
            width: 100%;
        }
        .mt-ticket__badge {
            font-size: 0.68rem; font-weight: 800;
            letter-spacing: .08em; text-transform: uppercase;
            padding: 4px 10px; border-radius: 6px;
            flex-shrink: 0;
        }
        .mt-ticket__badge--crit {
            background: rgba(239,68,68,.12);
            color: #ef4444;
        }
        .mt-ticket__info {
            display: flex; flex-direction: column; gap: 2px; flex: 1;
        }
        .mt-ticket__room {
            font-size: 0.72rem; text-transform: uppercase;
            letter-spacing: .06em; color: var(--hos-text-muted);
        }
        .mt-ticket__issue {
            font-size: 0.875rem; font-weight: 600; color: var(--hos-text);
        }
        .mt-ticket__sla {
            display: flex; flex-direction: column; align-items: center; gap: 1px;
            padding: 6px 12px;
            background: rgba(239,68,68,.07);
            border-radius: 8px; flex-shrink: 0;
        }
        .mt-ticket__sla-label {
            font-size: 0.62rem; text-transform: uppercase;
            letter-spacing: .08em; color: #ef4444; font-weight: 700;
        }
        .mt-ticket__sla-val {
            font-family: var(--hos-font-display);
            font-size: 1rem; font-weight: 800; color: #ef4444;
        }
    `]
})
export class GosSectionMaintenanceDetail {}

// ════════════════════════════════════════════════════════════════════════════
// ANALYTICS — fondo oscuro tipo "data room", métricas flotantes
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'gos-section-analytics-detail',
    standalone: true,
    imports: [RouterModule, GosScreenMockup, RevealDirective, CountUpDirective],
    template: `
        <section class="gos-section an-section">
            <div class="an-bg" aria-hidden="true"></div>
            <div class="gos-container">
                <div class="det-split">
                    <div class="det-content" hosReveal>
                        <span class="gos-eyebrow an-eyebrow"><i class="pi pi-chart-line"></i>Analytics</span>
                        <h2 class="an-title">Decide con datos,<br>no con corazonadas.</h2>
                        <p class="an-sub">Occupancy, ADR, RevPAR, ingresos y tendencias en un tablero que la gerencia revisa cada mañana antes del primer café.</p>

                        <div class="an-metrics">
                            <div class="an-metric">
                                <span class="an-metric__lbl">Occupancy</span>
                                <span class="an-metric__val" hosCountUp>82.4%</span>
                                <span class="an-metric__trend up"><i class="pi pi-arrow-up"></i>+6.8%</span>
                            </div>
                            <div class="an-metric">
                                <span class="an-metric__lbl">ADR</span>
                                <span class="an-metric__val" hosCountUp>$198</span>
                                <span class="an-metric__trend up"><i class="pi pi-arrow-up"></i>+12%</span>
                            </div>
                            <div class="an-metric">
                                <span class="an-metric__lbl">RevPAR</span>
                                <span class="an-metric__val" hosCountUp>$163</span>
                                <span class="an-metric__trend up"><i class="pi pi-arrow-up"></i>+9.4%</span>
                            </div>
                            <div class="an-metric">
                                <span class="an-metric__lbl">Ingresos</span>
                                <span class="an-metric__val" hosCountUp>$18,420</span>
                                <span class="an-metric__trend up"><i class="pi pi-arrow-up"></i>+15%</span>
                            </div>
                        </div>

                        <a class="det-link an-link" routerLink="/modules/analytics">Ver módulo Analytics <i class="pi pi-arrow-right"></i></a>
                    </div>
                    <div class="det-mock" hosReveal="right">
                        <span class="det-glow" style="background: radial-gradient(circle, rgba(45,212,191,.18), transparent 65%)"></span>
                        <gos-screen-mockup variant="analytics" />
                    </div>
                </div>
            </div>
        </section>
    `,
    styles: [
        ...sharedStyles(),
        `
        .an-section {
            position: relative;
            overflow: hidden;
            background: var(--hos-slate-950, #020617);
            --hos-text: #f8fafc;
            --hos-text-muted: #94a3b8;
            --hos-border: #1e293b;
            --hos-surface: #0f172a;
            --hos-bg: #020617;
            --hos-primary-soft: rgba(20,184,166,.15);
        }
        .app-dark .an-section {
            background: #010409;
        }
        .an-bg {
            position: absolute; inset: 0;
            background:
                radial-gradient(ellipse 70% 55% at 10% 50%, rgba(20,184,166,.1) 0%, transparent 65%),
                radial-gradient(ellipse 60% 45% at 90% 20%, rgba(99,102,241,.08) 0%, transparent 60%);
            pointer-events: none;
        }
        .an-eyebrow {
            background: rgba(20,184,166,.15);
            border-color: rgba(20,184,166,.3);
            color: var(--hos-teal-400);
        }
        .an-title {
            font-family: var(--hos-font-display);
            font-size: clamp(1.75rem, 3.4vw, 2.5rem);
            font-weight: 800;
            letter-spacing: -0.04em;
            line-height: 1.1;
            color: #fff;
            margin: 0;
        }
        .an-sub {
            color: #94a3b8;
            font-size: 1.02rem;
            line-height: 1.72;
            margin: 0;
            max-width: 480px;
        }

        /* grid de métricas */
        .an-metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            width: 100%;
            max-width: 440px;
        }
        .an-metric {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 16px 18px;
            background: rgba(255,255,255,.04);
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 14px;
            transition: background 0.2s, border-color 0.2s;
        }
        .an-metric:hover {
            background: rgba(20,184,166,.07);
            border-color: rgba(20,184,166,.25);
        }
        .an-metric__lbl {
            font-size: 0.68rem; text-transform: uppercase;
            letter-spacing: .1em; color: #64748b; font-weight: 600;
        }
        .an-metric__val {
            font-family: var(--hos-font-display);
            font-size: 1.5rem; font-weight: 800;
            letter-spacing: -0.02em; color: #fff;
        }
        .an-metric__trend {
            display: inline-flex; align-items: center;
            gap: 4px; font-size: 0.72rem; font-weight: 700;
        }
        .an-metric__trend.up { color: var(--hos-teal-400); }
        .an-link { color: var(--hos-teal-400); }
        .an-link:hover { color: var(--hos-teal-300); }

        .det-link { color: inherit; }
    `]
})
export class GosSectionAnalyticsDetail {}
