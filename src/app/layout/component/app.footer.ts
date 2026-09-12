import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [RouterModule],
    template: `
    <div class="layout-footer hos-footer">
        <span class="hos-footer__copy">© {{ year }} Hospitality OS</span>
        <span class="hos-footer__sep" aria-hidden="true">·</span>
        <a class="hos-footer__link" routerLink="/legal/privacidad">Privacidad</a>
        <span class="hos-footer__sep" aria-hidden="true">·</span>
        <a class="hos-footer__link" routerLink="/legal/terminos">Términos</a>
        <span class="hos-footer__sep" aria-hidden="true">·</span>
        <span class="hos-footer__env">Demo</span>
    </div>
    `,
    styles: [`
        .hos-footer {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.78rem;
            color: var(--text-color-secondary);
            flex-wrap: wrap;
        }
        .hos-footer__copy { font-weight: 600; color: var(--text-color); }
        .hos-footer__sep  { opacity: .4; }
        .hos-footer__link {
            color: var(--text-color-secondary);
            text-decoration: none;
            transition: color .15s;
        }
        .hos-footer__link:hover { color: var(--primary-color); }
        .hos-footer__env {
            font-size: 0.65rem; font-weight: 700;
            letter-spacing: .08em; text-transform: uppercase;
            padding: 2px 8px; border-radius: 999px;
            background: color-mix(in srgb, var(--primary-color) 12%, transparent);
            color: var(--primary-color);
            border: 1px solid color-mix(in srgb, var(--primary-color) 25%, transparent);
        }
    `]
})
export class AppFooter {
    year = new Date().getFullYear();
}
