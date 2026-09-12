import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GosPricingGrid } from '@/app/shared/components/pricing-grid';
import { GosFaqList } from '@/app/shared/components/faq-list';
import { RevealDirective } from '@/app/shared/directives/reveal.directive';
import { FAQS } from '@/app/shared/data/mock.data';

@Component({
    selector: 'gos-section-pricing',
    standalone: true,
    imports: [RouterModule, GosPricingGrid, RevealDirective],
    template: `
        <section class="gos-section gos-section--soft">
            <div class="gos-container">
                <div class="gos-section-head" hosReveal>
                    <span class="gos-eyebrow"><i class="pi pi-tags"></i>Precios</span>
                    <h2 class="gos-title gos-title--center">Planes que crecen con tu hotel.</h2>
                    <p class="gos-subtitle">Cada plan incluye onboarding guiado. Sin permanencia, cancela cuando quieras.</p>
                </div>
                <gos-pricing-grid />
            </div>
        </section>
    `
})
export class GosSectionPricing {}

@Component({
    selector: 'gos-section-faq',
    standalone: true,
    imports: [GosFaqList, RevealDirective],
    template: `
        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-section-head" hosReveal>
                    <span class="gos-eyebrow"><i class="pi pi-question-circle"></i>FAQ</span>
                    <h2 class="gos-title gos-title--center">Preguntas frecuentes.</h2>
                </div>
                <gos-faq-list [items]="faqs" />
            </div>
        </section>
    `
})
export class GosSectionFaq {
    faqs = FAQS;
}