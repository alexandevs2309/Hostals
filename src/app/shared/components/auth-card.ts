import { Component, Input } from '@angular/core';

@Component({
    selector: 'gos-auth-card',
    standalone: true,
    template: `
        <div class="gos-auth-card">
            <div class="auth-head">
                @if (icon) {
                    <div class="auth-head__icon"><i [class]="icon"></i></div>
                }
                @if (eyebrow) {
                    <div class="auth-head__eyebrow">{{ eyebrow }}</div>
                }
                <h1 class="auth-head__title">{{ title }}</h1>
                @if (subtitle) {
                    <p class="auth-head__subtitle">{{ subtitle }}</p>
                }
            </div>
            <ng-content />
        </div>
    `,
    styles: [
        `
            .auth-head {
                text-align: center;
                margin-bottom: 42px;
            }
            .auth-head__icon {
                width: 60px;
                height: 60px;
                margin: 0 auto 26px;
                border-radius: 20px;
                display: grid;
                place-items: center;
                background: var(--hos-primary-soft);
                color: var(--hos-primary);
                font-size: 1.5rem;
            }
            .auth-head__eyebrow {
                font-size: 0.78rem;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--hos-teal-600);
            }
            .auth-head__title {
                font-family: var(--hos-font-display);
                font-size: 1.8rem;
                font-weight: 800;
                letter-spacing: -0.02em;
                margin: 16px 0 12px;
                line-height: 1.2;
            }
            .auth-head__subtitle {
                margin: 0;
                color: var(--hos-text-muted);
                font-size: 0.94rem;
                line-height: 1.65;
                max-width: 360px;
                margin-inline: auto;
            }

            :host ::ng-deep .gos-field {
                margin-bottom: 14px;
            }

            .auth-sep {
                display: flex;
                align-items: center;
                gap: 12px;
                margin: 28px 0;
                color: var(--hos-text-muted);
                font-size: 0.78rem;
                text-transform: uppercase;
                letter-spacing: 0.08em;
            }
            .auth-sep::before,
            .auth-sep::after {
                content: '';
                flex: 1;
                height: 1px;
                background: var(--hos-border);
            }
        `
    ]
})
export class GosAuthCard {
    @Input() eyebrow = '';
    @Input() title = '';
    @Input() subtitle = '';
    @Input() icon = '';
}