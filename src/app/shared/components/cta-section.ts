import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RevealDirective } from '@/app/shared/directives/reveal.directive';

@Component({
    selector: 'gos-cta-section',
    standalone: true,
    imports: [RouterModule, RevealDirective],
    template: `
        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-cta" hosReveal>
                    <span class="gos-pill" style="background: rgba(255,255,255,0.14); color: #fff; border-color: rgba(255,255,255,0.35)">{{ eyebrow }}</span>
                    <h2 class="gos-cta__title cta-h">{{ title }}</h2>
                    <p class="gos-cta__text">{{ text }}</p>
                    <a class="gos-btn gos-btn--light" routerLink="{{ link }}">
                        {{ ctaLabel }} <i class="pi pi-arrow-right"></i>
                    </a>
                </div>
            </div>
        </section>
    `,
    styles: [
        `
            .cta-h::first-letter {
                text-transform: uppercase;
            }
        `
    ]
})
export class GosCtaSection {
    @Input() eyebrow = 'HOSPITALITY OS';
    @Input() title = 'Haz que tu hotel funcione como uno.';
    @Input() text = 'Una plataforma. Un equipo. Una operación conectada.';
    @Input() ctaLabel = 'Solicitar una demo';
    @Input() link = '/account/register';
}