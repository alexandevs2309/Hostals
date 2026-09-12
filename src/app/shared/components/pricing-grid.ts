import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Plan } from '@/app/shared/models/hotel.model';
import { PLANS } from '@/app/shared/data/mock.data';
import { StaggerDirective } from '@/app/shared/directives/reveal.directive';

@Component({
    selector: 'gos-pricing-grid',
    standalone: true,
    imports: [CommonModule, RouterModule, StaggerDirective],
    template: `
        <!-- Toggle mensual / anual -->
        <div class="pg-toggle-wrap">
            <div class="pg-toggle" role="group" aria-label="Ciclo de facturación">
                <button type="button" class="pg-toggle__btn"
                    [class.pg-toggle__btn--active]="!annual()"
                    (click)="annual.set(false)">
                    Mensual
                </button>
                <button type="button" class="pg-toggle__btn"
                    [class.pg-toggle__btn--active]="annual()"
                    (click)="annual.set(true)">
                    Anual
                    <span class="pg-toggle__save">−20%</span>
                </button>
            </div>
            @if (annual()) {
                <p class="pg-toggle__hint">
                    <i class="pi pi-check-circle"></i>
                    Pagas 10 meses, usas 12
                </p>
            }
        </div>

        <!-- Grid de planes -->
        <div class="gos-plans" hosStagger>
            @for (plan of plans; track plan.name) {
                <div class="gos-plan"
                     [class.gos-plan--popular]="plan.popular"
                     [class.gos-plan--enterprise]="plan.custom">

                    @if (plan.popular) {
                        <span class="gos-plan__badge">Más popular</span>
                    }

                    <!-- cabecera -->
                    <div class="gos-plan__header">
                        <div class="gos-plan__name">{{ plan.name }}</div>
                        <div class="gos-plan__desc">{{ plan.description }}</div>
                    </div>

                    <!-- precio -->
                    @if (!plan.custom) {
                        <div class="gos-plan__price">
                            @if (annual()) {
                                <div class="pg-price-annual">
                                    <div class="pg-price-row">
                                        <span class="pg-currency">USD</span>
                                        <span class="gos-plan__amount">\${{ annualPrice(plan.price) }}</span>
                                        <span class="gos-plan__period">/mes</span>
                                    </div>
                                    <div class="pg-price-annual-note">
                                        Facturado anualmente ·
                                        <span class="pg-was">antes \${{ plan.price }}/mes</span>
                                    </div>
                                </div>
                            } @else {
                                <span class="pg-currency">USD</span>
                                <span class="gos-plan__amount">\${{ plan.price }}</span>
                                <span class="gos-plan__period">/mes</span>
                            }
                        </div>
                    } @else {
                        <div class="gos-plan__price gos-plan__price--custom">
                            <div class="gos-plan__custom-icon"><i class="pi pi-phone"></i></div>
                            <div>
                                <div class="gos-plan__custom-label">Precio personalizado</div>
                                <div class="gos-plan__custom-sub">Según propiedades y volumen</div>
                            </div>
                        </div>
                    }

                    <!-- separador -->
                    <div class="pg-sep"></div>

                    <!-- features -->
                    <ul class="gos-plan__features">
                        @for (feature of plan.features; track feature) {
                            <li>
                                <i class="pi pi-check"></i>
                                <span>{{ feature }}</span>
                            </li>
                        }
                    </ul>

                    <!-- CTA -->
                    <a class="gos-btn pg-cta"
                       [class.gos-btn--primary]="plan.popular"
                       [class.gos-btn--ghost]="!plan.popular && !plan.custom"
                       [class.pg-cta--enterprise]="plan.custom"
                       routerLink="/account/register">
                        {{ plan.cta }}
                        <i class="pi pi-arrow-right"></i>
                    </a>

                    @if (!plan.custom) {
                        <p class="pg-trial">14 días gratis · Sin tarjeta de crédito</p>
                    }
                </div>
            }
        </div>

        <!-- nota legal -->
        <!--
        <p class="pg-legal">
            Precios en USD, sin impuestos. Cancela cuando quieras.
        </p>
        -->
    `,
    styles: [`
        /* ── Toggle ─────────────────────────────────────────── */
        .pg-toggle-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-bottom: 2.5rem;
        }
        .pg-toggle {
            display: inline-flex;
            background: var(--hos-bg-soft);
            border: 1px solid var(--hos-border);
            border-radius: 999px;
            padding: 4px;
        }
        .pg-toggle__btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 20px;
            border-radius: 999px;
            border: none;
            background: transparent;
            font-family: inherit;
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--hos-text-muted);
            cursor: pointer;
            transition: background .2s, color .2s, box-shadow .2s;
        }
        .pg-toggle__btn--active {
            background: var(--hos-surface);
            color: var(--hos-text);
            box-shadow: 0 1px 4px rgba(0,0,0,.08);
        }
        .pg-toggle__save {
            font-size: 0.68rem;
            font-weight: 800;
            padding: 2px 8px;
            border-radius: 999px;
            background: var(--hos-primary-soft);
            color: var(--hos-primary);
            border: 1px solid var(--hos-teal-300);
        }
        .app-dark .pg-toggle__save { border-color: rgba(20, 184, 166,.35); }
        .pg-toggle__hint {
            display: flex; align-items: center; gap: 6px;
            font-size: 0.82rem; color: var(--hos-primary);
            font-weight: 600; margin: 0;
        }

        /* ── Grid ────────────────────────────────────────────── */
        .gos-plans {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            align-items: stretch;
        }

        /* ── Cabecera del plan ────────────────────────────────── */
        .gos-plan__header { margin-bottom: 4px; }

        /* ── Precio ──────────────────────────────────────────── */
        .gos-plan__price {
            display: flex;
            align-items: baseline;
            gap: 4px;
            margin: 22px 0 0;
            flex-wrap: wrap;
        }
        .pg-currency {
            font-size: 0.72rem;
            font-weight: 700;
            letter-spacing: .06em;
            text-transform: uppercase;
            color: var(--hos-text-muted);
            align-self: flex-start;
            margin-top: 8px;
        }
        .pg-price-annual { display: flex; flex-direction: column; gap: 4px; }
        .pg-price-row {
            display: flex; align-items: baseline; gap: 4px;
        }
        .pg-price-annual-note {
            font-size: 0.75rem; color: var(--hos-text-muted);
        }
        .pg-was {
            text-decoration: line-through;
            color: var(--hos-text-muted);
        }

        /* ── Precio custom (Enterprise) ────────────────────── */
        .gos-plan__price--custom {
            align-items: center;
            gap: 14px;
            padding: 18px;
            background: var(--hos-primary-soft);
            border-radius: 14px;
            border: 1px solid var(--hos-teal-300);
            margin: 22px 0 0;
            flex-wrap: nowrap;
        }
        .app-dark .gos-plan__price--custom { border-color: rgba(20, 184, 166,.3); }
        .gos-plan__custom-icon {
            width: 44px; height: 44px; border-radius: 12px;
            background: var(--hos-primary); color: #fff;
            display: grid; place-items: center;
            font-size: 1.1rem; flex-shrink: 0;
        }
        .app-dark .gos-plan__custom-icon { color: #042f2e; }
        .gos-plan__custom-label {
            font-family: var(--hos-font-display);
            font-size: 1.1rem; font-weight: 800;
            color: var(--hos-primary); letter-spacing: -0.01em;
        }
        .gos-plan__custom-sub {
            font-size: 0.78rem; color: var(--hos-text-muted); margin-top: 2px;
        }

        /* ── Separador ───────────────────────────────────────── */
        .pg-sep {
            height: 1px;
            background: var(--hos-border);
            margin: 20px 0;
        }

        /* ── CTA ─────────────────────────────────────────────── */
        .pg-cta { width: 100%; justify-content: center; }
        .pg-cta--enterprise {
            background: linear-gradient(135deg, var(--hos-slate-700), var(--hos-slate-900)) !important;
            color: #fff !important;
            border-color: transparent !important;
        }
        .pg-cta--enterprise:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 8px 24px rgba(0,0,0,.25) !important;
        }
        .app-dark .pg-cta--enterprise {
            background: linear-gradient(135deg, var(--hos-slate-600), var(--hos-slate-800)) !important;
        }

        /* ── Nota trial ──────────────────────────────────────── */
        .pg-trial {
            text-align: center;
            font-size: 0.75rem;
            color: var(--hos-text-muted);
            margin: 10px 0 0;
        }

        /* ── Plan Enterprise ─────────────────────────────────── */
        .gos-plan--enterprise {
            background: linear-gradient(160deg, var(--hos-surface) 60%, var(--hos-primary-soft));
        }
        .app-dark .gos-plan--enterprise {
            background: linear-gradient(160deg, var(--hos-surface) 60%, rgba(20, 184, 166,.05));
        }

        /* ── Nota legal ──────────────────────────────────────── */
        .pg-legal {
            text-align: center;
            margin: 2rem 0 0;
            font-size: 0.78rem;
            color: var(--hos-text-muted);
            line-height: 1.6;
        }

        @media (max-width: 900px) {
            .gos-plans {
                grid-template-columns: 1fr;
                max-width: 480px;
                margin-inline: auto;
            }
        }
    `]
})
export class GosPricingGrid {
    /*
     * TODO (Backend Integration) — Planes de precios
     * ─────────────────────────────────────────────────────────────────
     * Los planes actualmente se cargan desde PLANS en mock.data.ts.
     * En producción, reemplazar con una llamada al backend:
     *
     *   this.pricingService.getPlans().subscribe(plans => this.plans = plans);
     *
     * El backend debe devolver un array de Plan[] con:
     *   - name, description, price (string, en USD), period, cta
     *   - features: string[]
     *   - popular?: boolean
     *   - custom?: boolean  (para Enterprise / precio personalizado)
     *
     * El toggle mensual/anual aplica un descuento del 20% sobre el precio mensual.
     * Si el backend devuelve precios anuales directamente, ajustar annualPrice().
     * ─────────────────────────────────────────────────────────────────
     */
    @Input() plans: Plan[] = PLANS;
    annual = signal(false);

    annualPrice(monthly: string): string {
        const n = parseFloat(monthly);
        return isNaN(n) ? monthly : Math.round(n * 0.8).toString();
    }
}
