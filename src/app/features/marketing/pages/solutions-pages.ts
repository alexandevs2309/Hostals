import { Component, Input } from '@angular/core';
import { GosPage } from '@/app/shared/components/page';
import { GosCtaSection } from '@/app/shared/components/cta-section';
import { GosScreenMockup, ScreenVariant } from '@/app/shared/components/screen-mockup';
import { StaggerDirective, RevealDirective } from '@/app/shared/directives/reveal.directive';
import { CountUpDirective } from '@/app/shared/directives/count-up.directive';
import { RouterModule } from '@angular/router';

export interface SolutionKind {
    id: string;
    label: string;
    title: string;
    subtitle: string;
    eyebrow: string;
    desc: string;
    mockup: ScreenVariant;
    image: string;
    bullets: string[];
    stats: { value: string; label: string }[];
    chips: string[];
}

export const SOLUTION_KINDS: Record<string, SolutionKind> = {
    hotels: {
        id: 'hotels',
        label: 'Hoteles',
        eyebrow: 'Solución · Hoteles',
        title: 'Para hoteles urbanos y boutique',
        subtitle: 'Recepción, operación y gerencia en una sola plataforma, sin fricción entre turnos ni sistemas.',
        desc: 'Hospitality OS está diseñado para el ritmo de un hotel urbano: llegadas simultáneas, housekeeping ajustado y una gerencia que necesita ver los KPIs cada mañana.',
        mockup: 'dashboard',
        image: '/images/properties/hotel-urban.jpg',
        bullets: [
            'Check-in y check-out fluidos en front desk',
            'Housekeeping sincronizado con la disponibilidad del día',
            'Reportes de ventas y ocupación listos a primera hora',
            'Comunicación en vivo entre recepción y operación'
        ],
        stats: [
            { value: '14%', label: 'menos tiempo por check-in' },
            { value: '2.5h', label: 'ahorradas por turno' },
            { value: '100%', label: 'de la operación conectada' },
            { value: '1 día', label: 'para cerrar el mes' }
        ],
        chips: ['Boutique', 'Urbano', 'Business', 'Histórico']
    },
    resorts: {
        id: 'resorts',
        label: 'Resorts',
        eyebrow: 'Solución · Resorts',
        title: 'Para resorts con múltiples operaciones',
        subtitle: 'Habitaciones, actividades, alimentos y servicios extra en una visión única de cada huésped.',
        desc: 'Un resort es un ecosistema: solo habitaciones no alcanzan. Hospitality OS conecta la estancia completa y el gasto de cada huésped en todos los puntos de contacto.',
        mockup: 'guests',
        image: '/images/properties/resort.jpg',
        bullets: [
            'Gasto consolidado: alojamiento, spa, restaurante y actividades',
            'Preferencias y solicitudes en cada área del resort',
            'Housekeeping y mantenimiento por zona y villa',
            'Integración con la operación de alimentos y bebidas'
        ],
        stats: [
            { value: '360°', label: 'del gasto por huésped' },
            { value: '+18%', label: 'upselling detectado' },
            { value: '1 vista', label: 'de toda la operación' },
            { value: '24/7', label: 'operación conectada' }
        ],
        chips: ['Todo incluido', 'Spa', 'Actividades', 'Villas']
    },
    villas: {
        id: 'villas',
        label: 'Villas',
        eyebrow: 'Solución · Villas',
        title: 'Para villas y propiedades de lujo',
        subtitle: 'Personalización de cada estancia sin perder el control operativo de la propiedad.',
        desc: 'En una villa, el detalle lo es todo: preferencias del huésped, servicio personal y una operación compacta. Hospitality OS mantiene el lujo y la eficiencia en balance.',
        mockup: 'housekeeping',
        image: '/images/properties/villa.jpg',
        bullets: [
            'Perfil del huésped detallado para staff y concierge',
            'Tareas de housekeeping y mantenimiento por villa',
            'Automatización de llegadas y cortesías',
            'Reporte financiero agrupado por propiedad'
        ],
        stats: [
            { value: '1 clic', label: 'para ver preferencias' },
            { value: '100%', label: 'del servicio personalizado' },
            { value: '5★', label: 'experiencia del huésped' },
            { value: '0', label: 'procesos en papel' }
        ],
        chips: ['Lujo', 'Familiar', 'Privada', 'Conserjería']
    },
    'multi-property': {
        id: 'multi-property',
        label: 'Multi-propiedad',
        eyebrow: 'Solución · Grupos & Cadenas',
        title: 'Para grupos y cadenas multi-propiedad',
        subtitle: 'Opera y consolida cada hotel desde una sola plataforma, con aislamiento por propiedad y visión de grupo.',
        desc: 'Cuando gestionas varias propiedades, la complejidad crece. Hospitality OS te da datos aislados por hotel y consolidados a nivel de grupo, con roles y permisos por propiedad.',
        mockup: 'analytics',
        image: '/images/properties/multi-property.jpg',
        bullets: [
            'Operación independiente por propiedad',
            'Comparativas de rendimiento entre hoteles',
            'Roles y permisos granulares',
            'Consolidación financiera a nivel de grupo'
        ],
        stats: [
            { value: '∞', label: 'propiedades' },
            { value: '1', label: 'plataforma' },
            { value: '+32%', label: 'visibilidad operativa' },
            { value: 'SSO', label: 'acceso seguro' }
        ],
        chips: ['Cadenas', 'Grupos', 'Franchise', 'Comparativas']
    }
};

// ═══════════════════════════════════════════════════
// SOLUTIONS LIST PAGE
// ═══════════════════════════════════════════════════
@Component({
    selector: 'page-solutions',
    standalone: true,
    imports: [RouterModule, GosPage, GosCtaSection, StaggerDirective],
    template: `
        <gos-page
            eyebrow="Soluciones"
            titleHtml="Adaptado al tipo de <span class='gos-grad-text'>propiedad.</span>"
            subtitle="Cada hotel es diferente. Una plataforma que se adapta a tu operación."
            [crumbs]="['Soluciones']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--primary" routerLink="/account/register">Solicitar una demo <i class="pi pi-arrow-right"></i></a>
            </div>
        </gos-page>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-solution-grid" hosStagger>
                    @for (kind of kinds; track kind.id) {
                        <a class="gos-solution-card" [routerLink]="'/solutions/' + kind.id">
                            <div class="sol-card-img">
                                <img [src]="kind.image" [alt]="kind.label" loading="lazy" />
                                <div class="sol-card-img__overlay"></div>
                                <div class="gos-solution-card__icon"><i [class]="icon(kind.id)"></i></div>
                            </div>
                            <h3>{{ kind.label }}</h3>
                            <p>{{ kind.subtitle }}</p>
                            <span class="gos-module-card__link" style="color: var(--hos-teal-600)">
                                Explorar <i class="pi pi-arrow-right"></i>
                            </span>
                        </a>
                    }
                </div>
            </div>
        </section>

        <gos-cta-section />
    `,
    styles: [`
        .gos-solution-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
        }
        .gos-solution-card {
            border: 1px solid var(--hos-border);
            border-radius: 22px;
            background: var(--hos-surface);
            display: flex;
            flex-direction: column;
            gap: 10px;
            overflow: hidden;
            transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .gos-solution-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--hos-shadow-lg);
            border-color: var(--hos-teal-300);
        }
        /* imagen card */
        .sol-card-img {
            position: relative;
            height: 200px;
            overflow: hidden;
        }
        .sol-card-img img {
            width: 100%; height: 100%;
            object-fit: cover; object-position: center;
            display: block;
            transition: transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .gos-solution-card:hover .sol-card-img img { transform: scale(1.05); }
        .sol-card-img__overlay {
            position: absolute; inset: 0;
            background: linear-gradient(to bottom, transparent 40%, rgba(2,6,23,.5) 100%);
        }
        .gos-solution-card__icon {
            position: absolute;
            bottom: 14px; left: 18px;
            width: 44px; height: 44px;
            border-radius: 12px;
            display: grid; place-items: center;
            background: rgba(255,255,255,.15);
            backdrop-filter: blur(8px);
            color: #fff;
            font-size: 1.2rem;
            border: 1px solid rgba(255,255,255,.25);
        }
        .gos-solution-card h3 {
            font-size: 1.25rem;
            margin: 8px 24px 0;
        }
        .gos-solution-card p {
            color: var(--hos-text-muted);
            font-size: 0.95rem; line-height: 1.6;
            margin: 0 24px; flex: 1;
        }
        .gos-solution-card .gos-module-card__link {
            display: inline-flex; align-items: center; gap: 6px;
            font-size: 0.82rem; font-weight: 700;
            margin: 0 24px 20px;
            transition: gap .2s;
        }
        .gos-solution-card:hover .gos-module-card__link { gap: 10px; }
        @media (max-width: 640px) {
            .gos-solution-grid { grid-template-columns: 1fr; }
        }
    `]
})
export class SolutionsPage {
    kinds = Object.values(SOLUTION_KINDS);

    icon(id: string): string {
        const map: Record<string, string> = {
            hotels: 'pi pi-building',
            resorts: 'pi pi-sun',
            villas: 'pi pi-home',
            'multi-property': 'pi pi-th-large'
        };
        return map[id] ?? 'pi pi-building';
    }
}

// ═══════════════════════════════════════════════════
// SOLUTION DETAIL PAGE
// ═══════════════════════════════════════════════════
@Component({
    selector: 'page-solution-detail',
    standalone: true,
    imports: [GosPage, GosCtaSection, GosScreenMockup, StaggerDirective, RevealDirective, CountUpDirective],
    template: `
        <gos-page [eyebrow]="data.eyebrow" [title]="data.title" [subtitle]="data.subtitle" [crumbs]="['Soluciones', data.label]">
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--primary" routerLink="/account/register">Solicitar una demo <i class="pi pi-arrow-right"></i></a>
            </div>
        </gos-page>

        <!-- Foto hero de la solución -->
        <div class="sol-photo-wrap">
            <div class="gos-container">
                <div class="sol-photo" hosReveal>
                    <img [src]="data.image" [alt]="data.label + ' — Hospitality OS'"
                         class="sol-photo__img" loading="lazy" />
                    <div class="sol-photo__overlay" aria-hidden="true"></div>
                </div>
            </div>
        </div>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-stat-band" hosStagger>
                    @for (stat of data.stats; track stat.label) {
                        <div class="gos-stat-block">
                            <div class="gos-stat-block__value" hosCountUp>{{ stat.value }}</div>
                            <div class="gos-stat-block__label">{{ stat.label }}</div>
                        </div>
                    }
                </div>
            </div>
        </section>

        <section class="gos-section gos-section--soft">
            <div class="gos-container">
                <div class="gos-split">
                    <div hosReveal>
                        <span class="gos-eyebrow"><i class="pi pi-sun"></i>{{ data.label }}</span>
                        <h2 class="gos-title" style="font-size: clamp(1.8rem, 3.4vw, 2.4rem)">{{ data.desc }}</h2>
                        <ul class="gos-check-list">
                            @for (b of data.bullets; track b) {
                                <li><i class="pi pi-check"></i>{{ b }}</li>
                            }
                        </ul>
                    </div>
                    <div hosReveal="right">
                        <gos-screen-mockup [variant]="data.mockup" />
                    </div>
                </div>
            </div>
        </section>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-chips" hosReveal>
                    @for (chip of data.chips; track chip) {
                        <span class="gos-pill"><i class="pi pi-tag"></i>{{ chip }}</span>
                    }
                </div>
            </div>
        </section>

        <gos-cta-section />
    `,
    styles: [`
        .gos-check-list {
            list-style: none; padding: 0; margin: 24px 0 0;
            display: flex; flex-direction: column; gap: 14px;
        }
        .gos-check-list li {
            display: flex; align-items: flex-start;
            gap: 10px; font-size: 0.95rem;
        }
        .gos-check-list li i {
            color: var(--hos-teal-500); margin-top: 4px; font-size: 0.85rem;
        }
        .gos-chips {
            display: flex; gap: 12px; flex-wrap: wrap;
            justify-content: center; padding-block: 40px;
        }
        /* foto hero solución */
        .sol-photo-wrap { margin-top: -40px; }
        .sol-photo {
            position: relative; border-radius: 24px;
            overflow: hidden; max-height: 460px;
            box-shadow: var(--hos-shadow-lg);
        }
        .sol-photo__img {
            width: 100%; height: 460px;
            object-fit: cover; object-position: center; display: block;
        }
        .sol-photo__overlay {
            position: absolute; inset: 0;
            background: linear-gradient(to bottom, transparent 50%, rgba(2,6,23,.45) 100%);
        }
    `]
})
export class SolutionDetailPage {
    @Input() kind = 'hotels';

    get data(): SolutionKind {
        return SOLUTION_KINDS[this.kind] ?? SOLUTION_KINDS['hotels'];
    }
}

// ═══════════════════════════════════════════════════
// INTEGRATIONS PAGE
// ═══════════════════════════════════════════════════
@Component({
    selector: 'page-integrations',
    standalone: true,
    imports: [GosPage, GosCtaSection, StaggerDirective, RevealDirective],
    template: `
        <gos-page
            eyebrow="Integraciones"
            titleHtml="Conecta tu <span class='gos-grad-text'>ecosistema.</span>"
            subtitle="Hospitality OS habla con el stack tecnológico que tu hotel ya usa."
            [crumbs]="['Integraciones']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--primary" routerLink="/account/register">Solicitar una demo <i class="pi pi-arrow-right"></i></a>
            </div>
        </gos-page>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-integrations" hosStagger>
                    @for (i of integrations; track i.name) {
                        <div class="gos-integration">
                            <i [class]="i.icon"></i>
                            <span>{{ i.name }}</span>
                        </div>
                    }
                </div>
            </div>
        </section>

        <section class="gos-section gos-section--soft">
            <div class="gos-container">
                <div class="gos-split">
                    <div hosReveal>
                        <span class="gos-eyebrow"><i class="pi pi-sitemap"></i>API abierta</span>
                        <h2 class="gos-title" style="font-size: clamp(1.8rem, 3.4vw, 2.4rem)">Construye sobre Hospitality OS.</h2>
                        <p class="gos-subtitle">
                            Una API moderna y webhooks para sincronizar datos en tiempo real con tu propio software, canal de distribución o herramienta interna.
                        </p>
                        <a class="gos-btn gos-btn--primary" routerLink="/account/register">Hablar con el equipo <i class="pi pi-arrow-right"></i></a>
                    </div>
                    <div class="gos-code-card" hosReveal="right">
                        <div class="gos-code-card__bar">
                            <span class="gos-mockup__dot" style="background: #f87171"></span>
                            <span class="gos-mockup__dot" style="background: #fbbf24"></span>
                            <span class="gos-mockup__dot" style="background: #34d399"></span>
                            <span class="gos-code-card__title">POST /api/v1/reservations</span>
                        </div>
                        <pre class="gos-code"><code>{{ code }}</code></pre>
                    </div>
                </div>
            </div>
        </section>

        <gos-cta-section />
    `,
    styles: [`
        .gos-code-card {
            border: 1px solid var(--hos-border);
            border-radius: 18px; overflow: hidden;
            background: var(--hos-surface); box-shadow: var(--hos-shadow-lg);
        }
        .gos-code-card__bar {
            display: flex; align-items: center; gap: 6px;
            padding: 12px 16px; border-bottom: 1px solid var(--hos-border);
        }
        .gos-code-card__title {
            margin-left: 10px; font-size: 0.75rem;
            font-family: var(--hos-font-sans); color: var(--hos-text-muted);
        }
        .gos-code {
            margin: 0; padding: 22px; font-size: 0.78rem; line-height: 1.7;
            color: var(--hos-teal-200); background: #0b1526;
            overflow-x: auto; white-space: pre;
        }
    `]
})
export class IntegrationsPage {
    integrations = [
        { icon: 'pi pi-bolt',         name: 'Channel Manager'        },
        { icon: 'pi pi-credit-card',  name: 'Pasarelas de pago'      },
        { icon: 'pi pi-lock',         name: 'Cerraduras electrónicas' },
        { icon: 'pi pi-map',          name: 'Mapeo de canales'        },
        { icon: 'pi pi-wifi',         name: 'Telemetría hab.'        },
        { icon: 'pi pi-android',      name: 'Apps de concierge'      },
        { icon: 'pi pi-wallet',       name: 'Facturación electrónica' },
        { icon: 'pi pi-chart-scatter',name: 'BI & reporting'          },
        { icon: 'pi pi-sliders-h',    name: 'Sistemas de tarifas'    },
        { icon: 'pi pi-mobile',       name: 'Keyless entry'          },
        { icon: 'pi pi-database',     name: 'Business intelligence'  },
        { icon: 'pi pi-globe',        name: 'OTAs y GDS'             }
    ];

    code = `{
  "property": "hotel-aurora",
  "guest": {
    "name": "María Soler",
    "email": "maria@example.com"
  },
  "room": "301",
  "checkIn": "2026-05-12",
  "checkOut": "2026-05-15",
  "status": "confirmed"
}`;
}
