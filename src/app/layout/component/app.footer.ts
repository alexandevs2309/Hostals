import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nService } from '@/app/shared/services/i18n.service';

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [RouterModule],
    template: `
    <div class="layout-footer hos-footer">
        <span class="hos-footer__copy">© {{ year }} {{ i18n.t('brand.hospitality') }} {{ i18n.t('brand.os') }}</span>
        <span class="hos-footer__sep" aria-hidden="true">·</span>
        <a class="hos-footer__link" routerLink="/legal/privacidad">{{ i18n.t('footer.privacy') }}</a>
        <span class="hos-footer__sep" aria-hidden="true">·</span>
        <a class="hos-footer__link" routerLink="/legal/terminos">{{ i18n.t('footer.terms') }}</a>
        <span class="hos-footer__sep" aria-hidden="true">·</span>
        <span class="hos-footer__env">{{ i18n.t('footer.demo') }}</span>
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
    readonly i18n = inject(I18nService);
}
