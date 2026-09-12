import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'gos-page',
    standalone: true,
    imports: [RouterModule],
    template: `
        <div class="gos-page">
            <section class="gos-page-hero">
                <div class="gos-hero__orb gos-hero__orb--alt"></div>
                <div class="gos-hero__orb gos-hero__orb--alt2"></div>
                <div class="gos-container">
                    @if (crumbs && crumbs.length) {
                        <nav class="gos-breadcrumb" aria-label="Migas de pan">
                            <a routerLink="/">Inicio</a>
                            @for (crumb of crumbs; track crumb) {
                                <i class="pi pi-angle-right"></i>
                                <span [class]="$last ? 'gos-muted' : ''">{{ crumb }}</span>
                            }
                        </nav>
                    }
                    <div class="gos-hero__eyebrow" style="display:flex; justify-content:center; margin-top:18px">
                        <span class="gos-eyebrow"><i class="pi pi-star"></i>{{ eyebrow }}</span>
                    </div>
                    <h1 class="gos-page-hero__title gos-hero__title gos-title--center" [innerHTML]="titleHtml || title"></h1>
                    @if (subtitle) {
                        <p class="gos-page-hero__subtitle gos-hero__subtitle">{{ subtitle }}</p>
                    }
                    <ng-content select="[cta]" />
                </div>
            </section>
            <ng-content />
        </div>
    `
})
export class GosPage {
    @Input() eyebrow = '';
    @Input() title = '';
    @Input() titleHtml?: string;
    @Input() subtitle = '';
    @Input() crumbs: string[] = [];
}