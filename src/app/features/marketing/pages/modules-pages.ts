import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GosPage } from '@/app/shared/components/page';
import { GosCtaSection } from '@/app/shared/components/cta-section';
import { GosScreenMockup, ScreenVariant } from '@/app/shared/components/screen-mockup';
import { StaggerDirective, RevealDirective } from '@/app/shared/directives/reveal.directive';
import { CountUpDirective } from '@/app/shared/directives/count-up.directive';
import { MODULES } from '@/app/shared/data/mock.data';

interface ModuleSpec {
    id: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    htmlTitle?: string;
    mockup: ScreenVariant;
    features: { icon: string; title: string; desc: string }[];
    bullets: string[];
    stats: { value: string; label: string }[];
}

const MODULE_SPECS: Record<string, ModuleSpec> = {
    reservations: {
        id: 'reservations',
        eyebrow: 'Módulo · Reservaciones & PMS',
        title: 'Controla cada reserva',
        subtitle: 'Calendario, disponibilidad, tarifas, check-in, check-out y folios centralizados.',
        mockup: 'reservations',
        features: [
            { icon: 'pi pi-calendar', title: 'Calendario de disponibilidad', desc: 'Vista clara de habitaciones y noches.' },
            { icon: 'pi pi-tags', title: 'Tarifas dinámicas', desc: 'Precios por tipo, temporada y canal.' },
            { icon: 'pi pi-user', title: 'Folios por huésped', desc: 'Todo el gasto en un solo registro.' },
            { icon: 'pi pi-clock', title: 'Check-in / check-out', desc: 'Procesos rápidos y sin fricción.' }
        ],
        bullets: ['Evita overbooking con control en tiempo real', 'Mueve reservas entre habitaciones sin perder datos', 'Sincroniza disponibles entre todos los canales'],
        stats: [
            { value: '−35%', label: 'tiempo de booking' },
            { value: '0', label: 'overbookings' },
            { value: '100%', label: 'tarifas al día' }
        ]
    },
    rooms: {
        id: 'rooms',
        eyebrow: 'Módulo · Habitaciones',
        title: 'Tu inventario, siempre claro',
        subtitle: 'Tipos de habitación, tarifas y estado en tiempo real para toda la operación.',
        mockup: 'rooms',
        features: [
            { icon: 'pi pi-building', title: 'Plano de piso', desc: 'Disponibilidad visual de cada habitación.' },
            { icon: 'pi pi-star', title: 'Tipos y niveles', desc: 'Estándar, deluxe, suites y categorías.' },
            { icon: 'pi pi-euro', title: 'Tarifas configuradas', desc: 'Precios por temporada, persona y canal.' },
            { icon: 'pi pi-arrows-alt', title: 'Bloqueos', desc: 'Control de habitaciones fuera de servicio.' }
        ],
        bullets: ['Estado de habitación visible para recepción y housekeeping', 'Bloqueos por mantenimiento y reparaciones', 'Tarifas centralizadas para todo el hotel'],
        stats: [
            { value: '142', label: 'habitaciones monitoreadas' },
            { value: '10', label: 'tipos de habitación' },
            { value: '0', label: 'telefonazos entre pisos' }
        ]
    },
    guests: {
        id: 'guests',
        eyebrow: 'Módulo · Huéspedes',
        title: 'Una vista 360° de cada huésped',
        subtitle: 'Perfil, historial, preferencias, solicitudes, notas, gasto total y última estancia.',
        mockup: 'guests',
        features: [
            { icon: 'pi pi-user', title: 'Perfil completo', desc: 'Datos, contacto y documentos.' },
            { icon: 'pi pi-history', title: 'Historial de estancias', desc: 'Cada visita en el mismo lugar.' },
            { icon: 'pi pi-heart', title: 'Preferencias', desc: 'Habitación, cortesías y servicios.' },
            { icon: 'pi pi-dollar', title: 'Gasto acumulado', desc: 'LTV y valor de cada huésped.' }
        ],
        bullets: ['Anticipa necesidades con preferencias guardadas', 'Recepción y concierge con la misma información', 'Segmenta y crea programas de fidelización'],
        stats: [
            { value: '12', label: 'estancias promedio' },
            { value: '$4,850', label: 'gasto acumulado' },
            { value: '+18%', label: 'upselling detectado' }
        ]
    },
    housekeeping: {
        id: 'housekeeping',
        eyebrow: 'Módulo · Housekeeping',
        title: 'Habitaciones listas a tiempo',
        subtitle: 'Asignación de habitaciones y tareas, prioridades e inspecciones en un solo panel.',
        mockup: 'housekeeping',
        features: [
            { icon: 'pi pi-box', title: 'Panel por turno', desc: 'Las cámaras ven sus tareas asignadas.' },
            { icon: 'pi pi-flag', title: 'Prioridades claras', desc: 'Check-outs urgentes antes que stayovers.' },
            { icon: 'pi pi-check-square', title: 'Inspecciones', desc: 'Control de calidad y liberación de habitación.' },
            { icon: 'pi pi-sync', title: 'Sincronización', desc: 'Recepción ve los estados al instante.' }
        ],
        bullets: ['Prioriza por checkout y llegadas del día', 'Mide tiempos de limpieza por habitación', 'Inspección digital en vez de radios y papeles'],
        stats: [
            { value: '−42%', label: 'tiempo de respuesta' },
            { value: '2.5x', label: 'más habitaciones/día' },
            { value: '100%', label: 'estados en vivo' }
        ]
    },
    maintenance: {
        id: 'maintenance',
        eyebrow: 'Módulo · Mantenimiento',
        title: 'Incidencias que no esperan',
        subtitle: 'Tickets, prioridades, responsables y SLA para mantener tu propiedad impecable.',
        mockup: 'maintenance',
        features: [
            { icon: 'pi pi-wrench', title: 'Tickets', desc: 'Reporta desde cualquier módulo.' },
            { icon: 'pi pi-exclamation-triangle', title: 'Prioridades', desc: 'Crítico, alta, media y baja.' },
            { icon: 'pi pi-user', title: 'Responsables', desc: 'Asignación clara por especialidad.' },
            { icon: 'pi pi-clock', title: 'SLA', desc: 'Plazos de respuesta y resolución.' }
        ],
        bullets: ['Cumple plazos con alertas de SLA', 'El equipo sabe qué hacer en cada momento', 'Historial de mantenimiento por activo y habitación'],
        stats: [
            { value: '−55%', label: 'tiempo de resolución' },
            { value: '1h', label: 'respuesta a críticos' },
            { value: '24/7', label: 'seguimiento' }
        ]
    },
    finance: {
        id: 'finance',
        eyebrow: 'Módulo · Finanzas',
        title: 'Finanzas sin tablas de Excel',
        subtitle: 'Ingresos, gastos, cierres de caja y métricas de rentabilidad en un solo lugar.',
        mockup: 'finance',
        features: [
            { icon: 'pi pi-dollar', title: 'Ingresos', desc: 'Por área: habitaciones, restaurante, extras.' },
            { icon: 'pi pi-minus-circle', title: 'Gastos', desc: 'Categorizados y comparables.' },
            { icon: 'pi pi-money-bill', title: 'Cierres de caja', desc: 'Auditables y sin discrepancias.' },
            { icon: 'pi pi-chart-bar', title: 'Rentabilidad', desc: 'Margen neto y KPIs por período.' }
        ],
        bullets: ['Cierre de mes en un día', 'Contabilidad conectada a tus herramientas', 'Reportes listos para gerencia y propiedad'],
        stats: [
            { value: '1 día', label: 'para cerrar el mes' },
            { value: '100%', label: 'conciliado' },
            { value: '0', label: 'discrepancias' }
        ]
    },
    analytics: {
        id: 'analytics',
        eyebrow: 'Módulo · Analytics',
        title: 'Decide con datos',
        subtitle: 'Occupancy, ADR, RevPAR, revenue y tendencias con los números en tiempo real.',
        mockup: 'analytics',
        features: [
            { icon: 'pi pi-percentage', title: 'Occupancy', desc: 'Ocupación y estacionalidad.' },
            { icon: 'pi pi-money-bill', title: 'ADR', desc: 'Tarifa promedio por habitación.' },
            { icon: 'pi pi-chart-line', title: 'RevPAR', desc: 'Rentabilidad por habitación disponible.' },
            { icon: 'pi pi-chart-bar', title: 'Revenue', desc: 'Ingresos por canal y por área.' }
        ],
        bullets: ['Tendencias comparables mes a mes', 'Comparativas entre propiedades', 'Reportes exportables para la propiedad'],
        stats: [
            { value: '8', label: 'KPIs en tiempo real' },
            { value: '360°', label: 'del rendimiento' },
            { value: '+1h', label: 'ahorrada por día' }
        ]
    }
};

@Component({
    selector: 'page-modules',
    standalone: true,
    imports: [RouterModule, GosPage, GosCtaSection, StaggerDirective],
    template: `
        <gos-page
            eyebrow="Módulos"
            titleHtml="Cada área del hotel,<br /><span class='gos-grad-text'>en su lugar.</span>"
            subtitle="Ocho módulos integrados que cubren toda tu operación. Actívalos cuando los necesites."
            [crumbs]="['Módulos']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--primary" routerLink="/account/register">Solicitar una demo <i class="pi pi-arrow-right"></i></a>
            </div>
        </gos-page>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-modules" style="grid-template-columns: repeat(3, 1fr); gap: 18px" hosStagger>
                    @for (mod of modules; track mod.id) {
                        <a class="gos-module-card" [routerLink]="'/modules/' + mod.id">
                            <div class="gos-module-card__icon"><i [class]="mod.icon"></i></div>
                            <h3 class="gos-module-card__title">{{ mod.title }}</h3>
                            <p class="gos-module-card__desc">{{ mod.description }}</p>
                            <span class="gos-module-card__link">Explorar <i class="pi pi-arrow-right"></i></span>
                        </a>
                    }
                </div>
            </div>
        </section>

        <gos-cta-section />
    `,
    styles: [
        `
            @media (max-width: 900px) {
                :host ::ng-deep .gos-modules {
                    grid-template-columns: repeat(2, 1fr) !important;
                }
            }
            @media (max-width: 560px) {
                :host ::ng-deep .gos-modules {
                    grid-template-columns: 1fr !important;
                }
            }
        `
    ]
})
export class ModulesPage {
    modules = MODULES;
}

@Component({
    selector: 'page-module-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, GosPage, GosCtaSection, GosScreenMockup, StaggerDirective, RevealDirective, CountUpDirective],
    template: `
        @if (spec) {
            <gos-page [eyebrow]="spec.eyebrow" [title]="spec.title" [subtitle]="spec.subtitle" [crumbs]="['Módulos', label]">
                <div cta class="gos-hero__ctas" style="margin-top: 28px">
                    <a class="gos-btn gos-btn--primary" routerLink="/account/register">Solicitar una demo <i class="pi pi-arrow-right"></i></a>
                </div>
            </gos-page>

            <section class="gos-section">
                <div class="gos-container">
                    <div class="mos-grid" hosStagger>
                        @for (f of spec.features; track f.title) {
                            <div class="mos-card">
                                <div class="gos-module-card__icon"><i [class]="f.icon"></i></div>
                                <h3>{{ f.title }}</h3>
                                <p>{{ f.desc }}</p>
                            </div>
                        }
                    </div>
                </div>
            </section>

            <section class="gos-section gos-section--soft">
                <div class="gos-container">
                    <div class="gos-stat-band" hosStagger>
                        @for (stat of spec.stats; track stat.label) {
                            <div class="gos-stat-block">
                                <div class="gos-stat-block__value" hosCountUp>{{ stat.value }}</div>
                                <div class="gos-stat-block__label">{{ stat.label }}</div>
                            </div>
                        }
                    </div>
                </div>
            </section>

            <section class="gos-section">
                <div class="gos-container">
                    <div class="gos-split">
                        <div hosReveal>
                            <span class="gos-eyebrow"><i [class]="icon"></i>{{ label }}</span>
                            <h2 class="gos-title" style="font-size: clamp(1.8rem, 3.4vw, 2.4rem)">Por qué este módulo importa</h2>
                            <ul class="gos-check-list">
                                @for (b of spec.bullets; track b) {
                                    <li><i class="pi pi-check"></i>{{ b }}</li>
                                }
                            </ul>
                        </div>
                        <div hosReveal="right">
                            <gos-screen-mockup [variant]="spec.mockup" />
                        </div>
                    </div>
                </div>
            </section>

            <gos-cta-section />
        }
    `,
    styles: [
        `
            .mos-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 18px;
            }
            .mos-card {
                border: 1px solid var(--hos-border);
                border-radius: 18px;
                padding: 26px 24px;
                background: var(--hos-surface);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .mos-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--hos-shadow);
            }
            .mos-card h3 {
                font-size: 1.05rem;
                margin-bottom: 8px;
            }
            .mos-card p {
                margin: 0;
                font-size: 0.88rem;
                color: var(--hos-text-muted);
                line-height: 1.6;
            }
            .gos-check-list {
                list-style: none;
                padding: 0;
                margin: 24px 0 0;
                display: flex;
                flex-direction: column;
                gap: 14px;
            }
            .gos-check-list li {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                font-size: 0.95rem;
            }
            .gos-check-list li i {
                color: var(--hos-teal-500);
                margin-top: 4px;
                font-size: 0.85rem;
            }
            @media (max-width: 900px) {
                .mos-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            @media (max-width: 560px) {
                .mos-grid {
                    grid-template-columns: 1fr;
                }
            }
        `
    ]
})
export class ModuleDetailPage {
    @Input() id = 'reservations';

    get spec(): ModuleSpec {
        return MODULE_SPECS[this.id] ?? MODULE_SPECS['reservations'];
    }

    get label(): string {
        return this.spec.subtitle.split('.')[0];
    }

    get icon(): string {
        return MODULES.find((m) => m.id === this.id)?.icon ?? 'pi pi-box';
    }
}