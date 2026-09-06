import { Component, ElementRef, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GosDashboardMockup } from '@/app/shared/components/dashboard-mockup';
import { CountUpDirective } from '@/app/shared/directives/count-up.directive';

@Component({
    selector: 'gos-section-hero',
    standalone: true,
    imports: [RouterModule, GosDashboardMockup, CountUpDirective],
    template: `
        <section class="gos-hero">
            <div class="gos-hero__rings" aria-hidden="true">
                <div class="gos-hero__ring gos-hero__ring--1"></div>
                <div class="gos-hero__ring gos-hero__ring--2"></div>
                <div class="gos-hero__ring gos-hero__ring--3"></div>
            </div>
            <div class="gos-hero__pattern" aria-hidden="true"></div>
            <div class="gos-hero__orb"></div>
            <div class="gos-hero__orb gos-hero__orb--alt"></div>
            <div class="gos-hero__orb gos-hero__orb--alt2"></div>

            <div class="gos-container gos-hero__content">
                <div class="gos-hero__eyebrow">
                    <span class="gos-eyebrow"><i class="pi pi-star"></i>Operación hotelera, reimaginada</span>
                </div>

                <h1 class="gos-hero__title">
                    Todo tu hotel.<br />
                    <span class="gos-grad-text">En un solo lugar.</span>
                </h1>

                <p class="gos-subtitle gos-hero__subtitle">
                    Hospitality OS conecta reservas, habitaciones, huéspedes, housekeeping, mantenimiento, finanzas y analytics en una sola plataforma.
                </p>

                <div class="gos-hero__ctas">
                    <a class="gos-btn gos-btn--primary" routerLink="/account/register">
                        Solicitar una demo <i class="pi pi-arrow-right"></i>
                    </a>
                    <a class="gos-btn gos-btn--ghost" routerLink="/features"><i class="pi pi-eye"></i>Explorar la plataforma</a>
                </div>

                <div class="gos-hero__micro">Pensado para hoteles, resorts, villas y propiedades independientes.</div>

                <!-- Banda de social proof -->
                <div class="gos-hero__social-proof">
                    <div class="gos-hero__avatars">
                        <img src="/images/people/avatar-laura.jpg"     alt="Usuario" class="gos-hero__av" />
                        <img src="/images/people/avatar-ricardo.jpg"   alt="Usuario" class="gos-hero__av" />
                        <img src="/images/people/avatar-valentina.jpg" alt="Usuario" class="gos-hero__av" />
                        <img src="/images/people/avatar-andres.jpg"    alt="Usuario" class="gos-hero__av" />
                        <img src="/images/people/avatar-extra1.jpg"    alt="Usuario" class="gos-hero__av" />
                    </div>
                    <span class="gos-hero__social-text">
                        <strong>4,200+</strong> profesionales hoteleros ya operan con nosotros
                    </span>
                </div>
                <div class="gos-hero__metrics">
                    <div class="gos-hero__metric">
                        <span class="gos-hero__metric-value" hosCountUp>4,200+</span>
                        <span class="gos-hero__metric-label">propiedades activas</span>
                    </div>
                    <div class="gos-hero__metric-sep" aria-hidden="true"></div>
                    <div class="gos-hero__metric">
                        <span class="gos-hero__metric-value" hosCountUp>1.2M</span>
                        <span class="gos-hero__metric-label">reservaciones procesadas</span>
                    </div>
                    <div class="gos-hero__metric-sep" aria-hidden="true"></div>
                    <div class="gos-hero__metric">
                        <span class="gos-hero__metric-value" hosCountUp>98.7%</span>
                        <span class="gos-hero__metric-label">satisfacción de equipo</span>
                    </div>
                    <div class="gos-hero__metric-sep" aria-hidden="true"></div>
                    <div class="gos-hero__metric">
                        <span class="gos-hero__metric-value" hosCountUp>2.5h</span>
                        <span class="gos-hero__metric-label">ahorradas por turno</span>
                    </div>
                </div>

                <div class="gos-hero__mock" id="dashboard">
                    <div class="gos-hero__mock-enter">
                        <gos-dashboard-mockup />
                    </div>
                </div>
            </div>
        </section>
    `,
    styles: [`
        /* ── Social proof ──────────────────────────────────────── */
        .gos-hero__social-proof {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            flex-wrap: wrap;
            animation: gos-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both;
        }
        .gos-hero__avatars { display: flex; }
        .gos-hero__av {
            width: 36px; height: 36px;
            border-radius: 50%;
            border: 2.5px solid rgba(255,255,255,.7);
            object-fit: cover; object-position: center top;
            margin-left: -10px;
            transition: margin .2s ease;
        }
        .gos-hero__av:first-child { margin-left: 0; }
        .gos-hero__avatars:hover .gos-hero__av { margin-left: -6px; }
        .gos-hero__social-text {
            font-size: 0.82rem;
            color: rgba(255,255,255,.75);
        }
        .gos-hero__social-text strong { color: #fff; font-weight: 700; }

        /* ── Métricas ──────────────────────────────────────────── */
        .gos-hero__metrics {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            flex-wrap: wrap;
            margin-top: 36px;
            padding: 20px 32px;
            background: rgba(255,255,255,.07);
            border: 1px solid rgba(255,255,255,.13);
            border-radius: 999px;
            backdrop-filter: blur(12px);
            animation: gos-fade-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.55s both;
        }
        .gos-hero__metric {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            padding: 0 28px;
        }
        .gos-hero__metric-value {
            font-family: var(--hos-font-display);
            font-size: 1.625rem;
            font-weight: 800;
            letter-spacing: -0.03em;
            color: #fff;
            line-height: 1;
        }
        .gos-hero__metric-label {
            font-size: 0.72rem;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: rgba(255,255,255,.6);
            white-space: nowrap;
        }
        .gos-hero__metric-sep {
            width: 1px;
            height: 32px;
            background: rgba(255,255,255,.18);
            flex-shrink: 0;
        }
        @media (max-width: 760px) {
            .gos-hero__metrics {
                border-radius: 20px;
                padding: 16px 20px;
                gap: 0;
            }
            .gos-hero__metric {
                padding: 8px 14px;
            }
            .gos-hero__metric-sep {
                height: 1px;
                width: 60px;
            }
        }
    `]
})
export class GosSectionHero implements AfterViewInit, OnDestroy {
    private el = inject(ElementRef);
    private platformId = inject(PLATFORM_ID);
    private scrollHandler: (() => void) | null = null;

    ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const root: HTMLElement = this.el.nativeElement;
        const orb = root.querySelector<HTMLElement>('.gos-hero__orb');
        const orbAlt = root.querySelector<HTMLElement>('.gos-hero__orb--alt');
        const orbAlt2 = root.querySelector<HTMLElement>('.gos-hero__orb--alt2');
        const mock = root.querySelector<HTMLElement>('.gos-hero__mock');
        const content = root.querySelector<HTMLElement>('.gos-hero__content');
        let ticking = false;

        const update = () => {
            const y = window.scrollY;
            const width = window.innerWidth;
            const factor = width >= 1080 ? 0.1 : width >= 640 ? 0.07 : 0.05;
            const maxLag = width >= 1080 ? 80 : width >= 640 ? 60 : 40;
            const lag = Math.min(y * factor, maxLag);

            if (orb) orb.style.transform = `translateY(${y * 0.22}px)`;
            if (orbAlt) orbAlt.style.transform = `translateY(${y * 0.14}px)`;
            if (orbAlt2) orbAlt2.style.transform = `translateY(${y * 0.10}px)`;
            if (mock) mock.style.transform = `translate3d(0, ${lag}px, 0)`;
            if (content) {
                const fade = Math.min(y / 520, 1);
                content.style.opacity = String(1 - fade * 0.25);
            }
            ticking = false;
        };

        this.scrollHandler = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }

    ngOnDestroy(): void {
        if (this.scrollHandler) {
            window.removeEventListener('scroll', this.scrollHandler);
        }
    }
}