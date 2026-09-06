import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MODULES } from '@/app/shared/data/mock.data';
import { StaggerDirective, RevealDirective } from '@/app/shared/directives/reveal.directive';

@Component({
    selector: 'gos-section-modules',
    standalone: true,
    imports: [CommonModule, RouterModule, StaggerDirective, RevealDirective],
    template: `
        <section class="gos-section gos-section--soft">
            <div class="gos-container">
                <div class="gos-section-head" hosReveal>
                    <span class="gos-eyebrow"><i class="pi pi-th-large"></i>Módulos</span>
                    <h2 class="gos-title gos-title--center">Cada área del hotel, en su lugar.</h2>
                    <p class="gos-subtitle">Ocho módulos integrados que cubren toda la operación, de la recepción al back office.</p>
                </div>

                <div class="gos-modules" hosStagger>
                    @for (mod of modules; track mod.id) {
                        <a class="gos-module-card" [routerLink]="mod.route">
                            <div class="gos-module-card__icon"><i [ngClass]="mod.icon"></i></div>
                            <h3 class="gos-module-card__title">{{ mod.title }}</h3>
                            <p class="gos-module-card__desc">{{ mod.description }}</p>
                            <span class="gos-module-card__link">Explorar <i class="pi pi-arrow-right"></i></span>
                        </a>
                    }
                </div>
            </div>
        </section>
    `,
    styles: [
        `
            .gos-modules {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 18px;
            }
            .gos-module-card {
                border: 1px solid var(--hos-border);
                border-radius: 18px;
                padding: 26px 24px;
                background: var(--hos-surface);
                display: flex;
                flex-direction: column;
                transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease, background 0.35s ease;
            }
            .gos-module-card:hover {
                transform: translateY(-6px);
                box-shadow: var(--hos-shadow-lg);
                border-color: var(--hos-teal-300);
                background: linear-gradient(160deg, var(--hos-surface) 60%, var(--hos-primary-soft));
            }
            .gos-module-card__icon {
                width: 46px;
                height: 46px;
                border-radius: 14px;
                display: grid;
                place-items: center;
                background: var(--hos-primary-soft);
                color: var(--hos-primary);
                font-size: 1.2rem;
                margin-bottom: 18px;
                transition: transform 0.35s ease;
            }
            .gos-module-card:hover .gos-module-card__icon {
                transform: scale(1.1) rotate(-6deg);
            }
            .gos-module-card__title {
                font-size: 1.05rem;
                font-weight: 700;
                margin-bottom: 8px;
            }
            .gos-module-card__desc {
                font-size: 0.85rem;
                color: var(--hos-text-muted);
                line-height: 1.6;
                margin: 0;
                flex: 1;
            }
            .gos-module-card__link {
                margin-top: 18px;
                font-size: 0.8rem;
                font-weight: 700;
                color: var(--hos-teal-600);
                display: inline-flex;
                align-items: center;
                gap: 6px;
                opacity: 0;
                transform: translateX(-8px);
                transition: opacity 0.3s ease, transform 0.3s ease, gap 0.2s ease;
            }
            .app-dark .gos-module-card__link {
                color: var(--hos-teal-400);
            }
            .gos-module-card:hover .gos-module-card__link {
                opacity: 1;
                transform: translateX(0);
            }
            .gos-module-card__link:hover {
                gap: 10px;
            }
            @media (max-width: 1024px) {
                .gos-modules {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            @media (max-width: 560px) {
                .gos-modules {
                    grid-template-columns: 1fr;
                }
            }
        `
    ]
})
export class GosSectionModules {
    modules = MODULES;
}