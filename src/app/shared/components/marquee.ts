import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface MarqueeItem {
    name: string;
    icon: string;
}

const ICONS = ['pi pi-building', 'pi pi-home', 'pi pi-sun', 'pi pi-th-large', 'pi pi-building', 'pi pi-sparkles'];

@Component({
    selector: 'gos-marquee',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="gos-marquee" [attr.aria-label]="'Propiedades que usan Hospitality OS'">
            <div class="gos-marquee__track">
                @for (item of doubled; track $index) {
                    <span class="gos-marquee__item">
                        <i [class]="item.icon"></i>{{ item.name }}
                    </span>
                    <span class="gos-marquee__sep" aria-hidden="true">·</span>
                }
            </div>
        </div>
    `,
    styles: [`
        .gos-marquee__sep {
            color: var(--hos-border);
            font-size: 1.2rem;
            flex-shrink: 0;
            user-select: none;
        }
    `]
})
export class GosMarquee {
    @Input() items: string[] = [];

    get doubled(): MarqueeItem[] {
        const mapped = this.items.map((name, i) => ({
            name,
            icon: ICONS[i % ICONS.length]
        }));
        return [...mapped, ...mapped];
    }
}
