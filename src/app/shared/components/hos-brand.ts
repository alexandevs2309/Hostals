import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'hos-brand',
    standalone: true,
    imports: [RouterModule],
    template: `
        <a class="gos-brand" [routerLink]="link" [attr.aria-label]="'Hospitality OS — Inicio'">
            <span class="gos-brand__mark"><i class="pi pi-building"></i></span>
            <span>
                <span class="gos-brand__name">Hospitality</span>
                <span class="gos-brand__os">OS</span>
            </span>
        </a>
    `,
    styles: [
        `
            .gos-brand__name {
                color: var(--hos-text);
            }
        `
    ]
})
export class HosBrand {
    @Input() link = '/';
}