import { Component, Input } from '@angular/core';
import { FaqItem } from '@/app/shared/models/hotel.model';
import { StaggerDirective } from '@/app/shared/directives/reveal.directive';

@Component({
    selector: 'gos-faq-list',
    standalone: true,
    imports: [StaggerDirective],
    template: `
        <div class="gos-faq-wrap" hosStagger>
            @for (item of items; track item.question) {
                <div class="gos-faq" [attr.data-open]="isOpen($index)">
                    <button type="button" class="gos-faq__trigger" (click)="toggle($index)" [attr.aria-expanded]="isOpen($index)" [attr.aria-controls]="'faq-panel-' + $index">
                        <span>{{ item.question }}</span>
                        <span class="gos-faq__icon"><i class="pi pi-plus" style="font-size: 0.7rem"></i></span>
                    </button>
                    <div class="gos-faq__panel" [id]="'faq-panel-' + $index" role="region">
                        <div class="gos-faq__panel-inner">
                            <p class="gos-faq__content">{{ item.answer }}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    `,
    styles: [
        `
            .gos-faq-wrap {
                max-width: 860px;
                margin-inline: auto;
            }
        `
    ]
})
export class GosFaqList {
    @Input() items: FaqItem[] = [];

    openIndex: number | null = 0;

    isOpen(index: number): boolean {
        return this.openIndex === index;
    }

    toggle(index: number): void {
        this.openIndex = this.openIndex === index ? null : index;
    }
}