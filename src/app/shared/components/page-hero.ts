import { Component, Input } from '@angular/core';

@Component({
    selector: 'gos-page-hero',
    standalone: true,
    template: `
        <section class="gos-page-hero">
            <div class="gos-hero__orb gos-hero__orb--alt"></div>
            <div class="gos-hero__orb gos-hero__orb--alt2"></div>
            <div class="gos-container">
                @if (eyebrow) {
                    <span class="gos-eyebrow gos-hero__eyebrow"><i class="pi pi-star"></i>{{ eyebrow }}</span>
                }
                @if (title || titleHtml) {
                    <h1 class="gos-page-hero__title gos-hero__title" [innerHTML]="titleHtml || ''">
                        @if (!titleHtml) {
                            {{ title }}
                        }
                    </h1>
                }
                @if (subtitle) {
                    <p class="gos-page-hero__subtitle gos-hero__subtitle">{{ subtitle }}</p>
                }
                <ng-content select="[cta]" />
            </div>
        </section>
    `
})
export class GosPageHero {
    @Input() eyebrow = '';
    @Input() title = '';
    @Input() titleHtml = '';
    @Input() subtitle = '';
}