import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '@/app/shared/services/i18n.service';

@Pipe({
    name: 't',
    standalone: true,
    pure: true
})
export class I18nPipe implements PipeTransform {
    private readonly i18n = inject(I18nService);

    transform(key: string, params?: Record<string, string | number>): string {
        return params ? this.i18n.tp(key, params) : this.i18n.t(key);
    }
}