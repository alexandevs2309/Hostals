import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GosCarousel } from '@/app/shared/components/carousel';
import { GosScreenMockup, ScreenVariant } from '@/app/shared/components/screen-mockup';
import { RevealDirective } from '@/app/shared/directives/reveal.directive';

interface ScreenSlide {
    variant: ScreenVariant;
    label: string;
    icon: string;
    description: string;
}

@Component({
    selector: 'gos-section-screens',
    standalone: true,
    imports: [CommonModule, GosCarousel, GosScreenMockup, RevealDirective],
    template: `
        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-section-head" hosReveal>
                    <span class="gos-eyebrow"><i class="pi pi-desktop"></i>La plataforma</span>
                    <h2 class="gos-title gos-title--center">Un vistazo a tu operación.</h2>
                    <p class="gos-subtitle">Toda tu operación hotelera, en una sola pantalla.</p>
                </div>

                <div hosReveal>
                    <gos-carousel [slides]="slides" [autoPlay]="true" [interval]="5500" [showDots]="true" [showNav]="true" [slideTemplate]="screenTpl" />
                </div>
            </div>
        </section>

        <ng-template #screenTpl let-slide let-idx="index">
            <div class="gos-slide-inner">
                <gos-screen-mockup [variant]="slide.variant" />
                <div class="gos-slide-caption">
                    <span class="gos-eyebrow"><i [ngClass]="slide.icon"></i>{{ slide.label }}</span>
                    <p class="gos-slide-desc">{{ slide.description }}</p>
                </div>
            </div>
        </ng-template>
    `,
    styles: [
        `
            .gos-slide-inner {
                padding: 0 12px;
                display: flex;
                flex-direction: column;
                gap: 22px;
            }
            .gos-slide-caption {
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            .gos-slide-desc {
                color: var(--hos-text-muted);
                max-width: 480px;
                margin: 0;
                font-size: 0.95rem;
            }
        `
    ]
})
export class GosSectionScreens {
    slides: ScreenSlide[] = [
        { variant: 'dashboard', label: 'Dashboard', icon: 'pi pi-th-large', description: 'Todos los KPIs del hotel en tiempo real: ocupación, ingresos, check-ins y estado de habitaciones.' },
        { variant: 'reservations', label: 'Reservaciones', icon: 'pi pi-calendar', description: 'Calendario de disponibilidad, tarifas y flujo completo de check-in y check-out.' },
        { variant: 'rooms', label: 'Habitaciones', icon: 'pi pi-building', description: 'Plano de piso en vivo con la disponibilidad de cada habitación de la propiedad.' },
        { variant: 'housekeeping', label: 'Housekeeping', icon: 'pi pi-box', description: 'Cámaras con prioridades claras y estados sincronizados con recepción.' },
        { variant: 'guests', label: 'Huéspedes', icon: 'pi pi-user', description: 'Vista 360° de cada huésped con historial, preferencias y gasto acumulado.' },
        { variant: 'maintenance', label: 'Mantenimiento', icon: 'pi pi-wrench', description: 'Tickets abiertos, prioridades críticas, responsables y SLA.' },
        { variant: 'finance', label: 'Finanzas', icon: 'pi pi-dollar', description: 'Ingresos, gastos y cierres de caja con todo el control financiero.' },
        { variant: 'analytics', label: 'Analytics', icon: 'pi pi-chart-line', description: 'Occupancy, ADR, RevPAR y tendencias para decidir con datos.' }
    ];
}