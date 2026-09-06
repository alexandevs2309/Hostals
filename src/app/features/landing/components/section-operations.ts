import { Component } from '@angular/core';
import { StaggerDirective, RevealDirective } from '@/app/shared/directives/reveal.directive';
import { CountUpDirective } from '@/app/shared/directives/count-up.directive';

@Component({
    selector: 'gos-section-operations',
    standalone: true,
    imports: [StaggerDirective, RevealDirective, CountUpDirective],
    template: `
        <section class="ops-section" id="operacion">
            <!-- fondo -->
            <div class="ops-bg" aria-hidden="true"></div>
            <div class="ops-grid-pattern" aria-hidden="true"></div>

            <div class="gos-container">

                <!-- cabecera -->
                <div class="ops-head" hosReveal>
                    <span class="ops-eyebrow"><i class="pi pi-bolt"></i>Operación en vivo</span>
                    <h2 class="ops-title">
                        La operación de tu hotel,<br>
                        <span class="ops-grad">en tiempo real.</span>
                    </h2>
                    <p class="ops-subtitle">
                        Detecta, coordina y decide. Nada se queda esperando en pases de turno o grupos de WhatsApp.
                    </p>
                </div>

                <!-- 3 pasos con conector -->
                <div class="ops-steps" hosStagger>

                    <!-- conector horizontal (solo desktop) -->
                    <div class="ops-connector" aria-hidden="true">
                        <div class="ops-connector__line"></div>
                        <div class="ops-connector__arrow"></div>
                    </div>

                    <!-- Paso 1 -->
                    <div class="ops-step">
                        <div class="ops-step__num">01</div>
                        <div class="ops-step__icon ops-step__icon--1">
                            <i class="pi pi-eye"></i>
                        </div>
                        <h3 class="ops-step__title">Detecta</h3>
                        <p class="ops-step__text">
                            Alertas sobre habitaciones, reservas, tareas e incidencias en el momento exacto en que ocurren.
                        </p>
                        <!-- chip de ejemplo -->
                        <div class="ops-alert ops-alert--warn">
                            <i class="pi pi-exclamation-circle"></i>
                            Room 301 · Checkout pendiente
                        </div>
                    </div>

                    <!-- Paso 2 -->
                    <div class="ops-step">
                        <div class="ops-step__num">02</div>
                        <div class="ops-step__icon ops-step__icon--2">
                            <i class="pi pi-send"></i>
                        </div>
                        <h3 class="ops-step__title">Coordina</h3>
                        <p class="ops-step__text">
                            Cada departamento recibe su trabajo y prioridades claras. Recepción, housekeeping y mantenimiento conectados.
                        </p>
                        <div class="ops-team">
                            <span class="ops-avatar ops-avatar--a">RC</span>
                            <span class="ops-avatar ops-avatar--b">HK</span>
                            <span class="ops-avatar ops-avatar--c">MT</span>
                            <span class="ops-team__label">En coordinación</span>
                        </div>
                    </div>

                    <!-- Paso 3 -->
                    <div class="ops-step">
                        <div class="ops-step__num">03</div>
                        <div class="ops-step__icon ops-step__icon--3">
                            <i class="pi pi-chart-line"></i>
                        </div>
                        <h3 class="ops-step__title">Decide</h3>
                        <p class="ops-step__text">
                            La gerencia obtiene datos accionables: occupancy, ADR y RevPAR para tomar decisiones con información, no intuición.
                        </p>
                        <div class="ops-kpis">
                            <div class="ops-kpi">
                                <span class="ops-kpi__val" hosCountUp>82%</span>
                                <span class="ops-kpi__lbl">Occ.</span>
                            </div>
                            <div class="ops-kpi">
                                <span class="ops-kpi__val" hosCountUp>$198</span>
                                <span class="ops-kpi__lbl">ADR</span>
                            </div>
                            <div class="ops-kpi">
                                <span class="ops-kpi__val" hosCountUp>$163</span>
                                <span class="ops-kpi__lbl">RevPAR</span>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- banda inferior de estadísticas -->
                <div class="ops-stats" hosReveal>
                    @for (s of stats; track s.label) {
                        <div class="ops-stat">
                            <i [class]="s.icon + ' ops-stat__icon'"></i>
                            <span class="ops-stat__val" hosCountUp>{{ s.value }}</span>
                            <span class="ops-stat__lbl">{{ s.label }}</span>
                        </div>
                    }
                </div>

            </div>
        </section>
    `,
    styles: [`
        /* ══════════════════════════════════════════════════
           FONDO
        ══════════════════════════════════════════════════ */
        .ops-section {
            position: relative;
            padding-block: 96px;
            overflow: hidden;
            background: var(--hos-slate-950, #020617);
            /* sobreescribir tokens para modo oscuro forzado */
            --hos-text: #f8fafc;
            --hos-text-muted: #94a3b8;
            --hos-border: rgba(255,255,255,.08);
            --hos-surface: rgba(255,255,255,.03);
        }
        .ops-bg {
            position: absolute; inset: 0;
            background:
                radial-gradient(ellipse 80% 60% at 50% -10%, rgba(20,184,166,.13) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 90% 80%, rgba(99,102,241,.09) 0%, transparent 55%),
                radial-gradient(ellipse 40% 35% at 0% 60%, rgba(20,184,166,.07) 0%, transparent 55%);
            pointer-events: none;
        }
        .ops-grid-pattern {
            position: absolute; inset: 0;
            background-image:
                linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
            background-size: 48px 48px;
            mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent);
            -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black, transparent);
            pointer-events: none;
        }

        /* ══════════════════════════════════════════════════
           CABECERA
        ══════════════════════════════════════════════════ */
        .ops-head {
            text-align: center;
            max-width: 680px;
            margin-inline: auto;
            margin-bottom: 4rem;
        }
        .ops-eyebrow {
            display: inline-flex; align-items: center; gap: 8px;
            font-size: 0.72rem; font-weight: 700;
            letter-spacing: .14em; text-transform: uppercase;
            color: var(--hos-teal-400);
            padding: 7px 14px; border-radius: 999px;
            border: 1px solid rgba(20,184,166,.3);
            background: rgba(20,184,166,.1);
        }
        .ops-title {
            font-family: var(--hos-font-display);
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 800; letter-spacing: -0.04em;
            line-height: 1.1; color: #fff;
            margin: 1.25rem 0 1rem;
        }
        .ops-grad {
            background: linear-gradient(120deg, var(--hos-teal-400) 0%, #a5f3fc 50%, var(--hos-teal-300) 100%);
            -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent; color: transparent;
        }
        .ops-subtitle {
            color: #94a3b8; font-size: 1.05rem;
            line-height: 1.7; margin: 0;
        }

        /* ══════════════════════════════════════════════════
           STEPS GRID
        ══════════════════════════════════════════════════ */
        .ops-steps {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0;
            position: relative;
            margin-bottom: 4rem;
        }

        /* conector */
        .ops-connector {
            position: absolute;
            top: 64px;
            left: calc(16.66% + 40px);
            right: calc(16.66% + 40px);
            height: 2px;
            pointer-events: none;
            z-index: 0;
        }
        .ops-connector__line {
            width: 100%; height: 2px;
            background: linear-gradient(90deg,
                rgba(20,184,166,.6) 0%,
                rgba(20,184,166,.3) 50%,
                rgba(20,184,166,.6) 100%
            );
        }
        .ops-connector__arrow {
            /* puntos intermedios */
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 8px; height: 8px;
            border-radius: 50%;
            background: var(--hos-teal-400);
            box-shadow: 0 0 12px rgba(20,184,166,.6);
        }

        /* ── paso individual ────────────────────────────── */
        .ops-step {
            display: flex; flex-direction: column;
            align-items: center; text-align: center;
            padding: 0 32px;
            gap: 14px;
            position: relative; z-index: 1;
        }

        .ops-step__num {
            font-family: var(--hos-font-display);
            font-size: 0.75rem; font-weight: 800;
            letter-spacing: .16em; text-transform: uppercase;
            color: rgba(20,184,166,.6);
        }

        .ops-step__icon {
            width: 72px; height: 72px;
            border-radius: 22px;
            display: grid; place-items: center;
            font-size: 1.6rem;
            transition: transform .4s ease, box-shadow .4s ease;
            position: relative;
        }
        .ops-step__icon::after {
            content: '';
            position: absolute; inset: -2px;
            border-radius: 24px;
            padding: 2px;
            background: var(--hos-grad);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor; mask-composite: exclude;
            opacity: .5;
        }
        .ops-step__icon--1 {
            background: rgba(20,184,166,.12); color: var(--hos-teal-400);
            box-shadow: 0 0 32px rgba(20,184,166,.15);
        }
        .ops-step__icon--2 {
            background: rgba(99,102,241,.12); color: #818cf8;
            box-shadow: 0 0 32px rgba(99,102,241,.15);
        }
        .ops-step__icon--3 {
            background: rgba(20,184,166,.14); color: var(--hos-teal-300);
            box-shadow: 0 0 32px rgba(20,184,166,.18);
        }
        .ops-step:hover .ops-step__icon {
            transform: translateY(-6px) scale(1.06);
            box-shadow: 0 16px 40px rgba(20,184,166,.25);
        }

        .ops-step__title {
            font-family: var(--hos-font-display);
            font-size: 1.375rem; font-weight: 800;
            letter-spacing: -0.02em; color: #fff; margin: 0;
        }
        .ops-step__text {
            color: #94a3b8; font-size: 0.9375rem;
            line-height: 1.65; margin: 0;
            max-width: 280px;
        }

        /* ── widget alerta ──────────────────────────────── */
        .ops-alert {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 10px 14px; border-radius: 10px;
            font-size: 0.8rem; font-weight: 600;
        }
        .ops-alert--warn {
            background: rgba(245,158,11,.1);
            border: 1px solid rgba(245,158,11,.25);
            color: #fbbf24;
        }

        /* ── widget equipo ──────────────────────────────── */
        .ops-team {
            display: flex; align-items: center; gap: 6px;
            padding: 10px 14px; border-radius: 10px;
            background: rgba(255,255,255,.04);
            border: 1px solid rgba(255,255,255,.08);
        }
        .ops-avatar {
            width: 28px; height: 28px; border-radius: 50%;
            display: grid; place-items: center;
            font-size: 0.6rem; font-weight: 800; color: #fff;
            flex-shrink: 0;
        }
        .ops-avatar--a { background: linear-gradient(135deg, var(--hos-teal-500), var(--hos-teal-700)); }
        .ops-avatar--b { background: linear-gradient(135deg, #6366f1, #4338ca); }
        .ops-avatar--c { background: linear-gradient(135deg, #f59e0b, #b45309); }
        .ops-team__label {
            font-size: 0.75rem; color: #94a3b8; font-weight: 600;
            margin-left: 4px; white-space: nowrap;
        }

        /* ── widget KPIs ─────────────────────────────────── */
        .ops-kpis {
            display: flex; align-items: center; gap: 0;
            background: rgba(255,255,255,.04);
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 10px; overflow: hidden;
        }
        .ops-kpi {
            display: flex; flex-direction: column;
            align-items: center; gap: 2px;
            padding: 10px 16px;
            border-right: 1px solid rgba(255,255,255,.06);
        }
        .ops-kpi:last-child { border-right: none; }
        .ops-kpi__val {
            font-family: var(--hos-font-display);
            font-size: 1rem; font-weight: 800;
            color: var(--hos-teal-400); letter-spacing: -0.02em;
        }
        .ops-kpi__lbl {
            font-size: 0.62rem; text-transform: uppercase;
            letter-spacing: .08em; color: #64748b; font-weight: 600;
        }

        /* ══════════════════════════════════════════════════
           BANDA INFERIOR DE ESTADÍSTICAS
        ══════════════════════════════════════════════════ */
        .ops-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 1px;
            background: rgba(255,255,255,.06);
            border: 1px solid rgba(255,255,255,.06);
            border-radius: 20px;
            overflow: hidden;
        }
        .ops-stat {
            display: flex; flex-direction: column;
            align-items: center; gap: 6px;
            padding: 28px 20px;
            background: rgba(255,255,255,.02);
            text-align: center;
            transition: background .2s;
        }
        .ops-stat:hover { background: rgba(20,184,166,.06); }
        .ops-stat__icon {
            font-size: 1.25rem; color: var(--hos-teal-400);
        }
        .ops-stat__val {
            font-family: var(--hos-font-display);
            font-size: 1.875rem; font-weight: 800;
            letter-spacing: -0.03em; color: #fff;
        }
        .ops-stat__lbl {
            font-size: 0.75rem; color: #64748b;
            font-weight: 600; text-transform: uppercase;
            letter-spacing: .06em;
        }

        /* ══════════════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════════════ */
        @media (max-width: 900px) {
            .ops-steps {
                grid-template-columns: 1fr;
                gap: 48px;
            }
            .ops-connector { display: none; }
            .ops-stats {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        @media (max-width: 640px) {
            .ops-section { padding-block: 64px; }
            .ops-stats {
                grid-template-columns: 1fr 1fr;
            }
        }
    `]
})
export class GosSectionOperations {
    stats = [
        { icon: 'pi pi-clock',        value: '−42%',  label: 'Tiempo por check-in'        },
        { icon: 'pi pi-check-circle', value: '99.2%', label: 'Uptime de la plataforma'     },
        { icon: 'pi pi-bolt',         value: '3x',    label: 'Más habitaciones/turno HK'   },
        { icon: 'pi pi-moon',         value: '1 día', label: 'Para cerrar el mes'          },
    ];
}
