import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GosPage } from '@/app/shared/components/page';
import { GosCtaSection } from '@/app/shared/components/cta-section';
import { GosDashboardMockup } from '@/app/shared/components/dashboard-mockup';
import { StaggerDirective, RevealDirective } from '@/app/shared/directives/reveal.directive';

@Component({
    selector: 'page-features',
    standalone: true,
    imports: [RouterModule, GosPage, GosCtaSection, GosDashboardMockup, StaggerDirective, RevealDirective],
    template: `
        <gos-page
            eyebrow="Producto"
            titleHtml="Todo tu hotel.<br /><span class='gos-grad-text'>En una pieza.</span>"
            subtitle="Módulos integrados que eliminan hojas de cálculo y sistemas aislados. Cada equipo con la misma información, en tiempo real."
            [crumbs]="['Producto']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--primary" routerLink="/account/register">Solicitar una demo <i class="pi pi-arrow-right"></i></a>
                <a class="gos-btn gos-btn--ghost" routerLink="/modules">Ver módulos</a>
            </div>
        </gos-page>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-feature-grid" hosStagger>
                    @for (f of features; track f.title) {
                        <div class="gos-feature-chip">
                            <div class="gos-feature-chip__icon"><i [class]="f.icon"></i></div>
                            <h3>{{ f.title }}</h3>
                            <p>{{ f.desc }}</p>
                        </div>
                    }
                </div>
            </div>
        </section>

        <section class="gos-section gos-section--soft">
            <div class="gos-container">
                <div class="gos-split">
                    <div hosReveal>
                        <span class="gos-eyebrow"><i class="pi pi-th-large"></i>Operación diaria</span>
                        <h2 class="gos-title" style="font-size: clamp(1.8rem, 3.4vw, 2.5rem)">De la recepción al back office.</h2>
                        <p class="gos-subtitle">
                            Un solo lugar para reservaciones, housekeeping, mantenimiento, finanzas y analytics. La información fluye entre departamentos sin pasos manuales ni datos duplicados.
                        </p>
                        <ul class="gos-check-list">
                            <li><i class="pi pi-check"></i>Estados de habitación sincronizados con recepción</li>
                            <li><i class="pi pi-check"></i>Tareas de housekeeping y mantenimiento ordenadas por prioridad</li>
                            <li><i class="pi pi-check"></i>Finanzas y reportes generados automáticamente</li>
                        </ul>
                    </div>
                    <div hosReveal="right">
                        <gos-dashboard-mockup />
                    </div>
                </div>
            </div>
        </section>

        <gos-cta-section />
    `,
    styles: [
        `
            .gos-feature-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 18px;
            }
            .gos-feature-chip {
                border: 1px solid var(--hos-border);
                border-radius: 18px;
                padding: 28px 26px;
                background: var(--hos-surface);
                transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease;
            }
            .gos-feature-chip:hover {
                transform: translateY(-5px);
                box-shadow: var(--hos-shadow-lg);
                border-color: var(--hos-teal-300);
            }
            .gos-feature-chip__icon {
                width: 46px;
                height: 46px;
                border-radius: 14px;
                display: grid;
                place-items: center;
                background: var(--hos-primary-soft);
                color: var(--hos-primary);
                font-size: 1.2rem;
                margin-bottom: 16px;
            }
            .gos-feature-chip h3 {
                font-size: 1.1rem;
                margin-bottom: 8px;
            }
            .gos-feature-chip p {
                margin: 0;
                font-size: 0.9rem;
                color: var(--hos-text-muted);
                line-height: 1.6;
            }
            .gos-check-list {
                list-style: none;
                padding: 0;
                margin: 22px 0 0;
                display: flex;
                flex-direction: column;
                gap: 12px;
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
                .gos-feature-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            @media (max-width: 560px) {
                .gos-feature-grid {
                    grid-template-columns: 1fr;
                }
            }
        `
    ]
})
export class FeaturesPage {
    features = [
        { icon: 'pi pi-calendar', title: 'Reservaciones & PMS', desc: 'Calendario, disponibilidad, tarifas y folios en un sistema único.' },
        { icon: 'pi pi-building', title: 'Habitaciones', desc: 'Inventario y estado en tiempo real para recepción y operación.' },
        { icon: 'pi pi-user', title: 'Huéspedes', desc: 'Perfil 360° con historial, preferencias y gasto acumulado.' },
        { icon: 'pi pi-box', title: 'Housekeeping', desc: 'Asignación de cámaras y estados de habitación en vivo.' },
        { icon: 'pi pi-wrench', title: 'Mantenimiento', desc: 'Incidencias, prioridades, responsables y SLA.' },
        { icon: 'pi pi-chart-line', title: 'Analytics', desc: 'Occupancy, ADR, RevPAR y tendencias accionables.' }
    ];
}