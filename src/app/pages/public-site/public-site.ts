import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WebsiteService, PublicSiteDto, PublicSitePageDto, PublicSiteSectionDto, PublicRoomDto } from '@/app/core/services/website.service';

@Component({
    selector: 'app-public-site',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './public-site.html',
    styleUrl: './public-site.scss'
})
export class PublicSite implements OnInit {
    private api = inject(WebsiteService);
    private route = inject(ActivatedRoute);

    site = signal<PublicSiteDto | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);
    requestedSlug = signal<string>('');

    activePath = signal<string>('/');

    activePage = computed<PublicSitePageDto | null>(() => {
        const s = this.site();
        if (!s) return null;
        return s.pages.find((p) => p.path === this.activePath()) ?? s.pages[0] ?? null;
    });

    themeClass = computed(() => {
        const theme = this.site()?.theme ?? '';
        return 'theme-' + theme.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    });

    ngOnInit(): void {
        const slug = this.route.snapshot.paramMap.get('slug');
        if (!slug) {
            this.error.set('No se indicó el sitio.');
            this.loading.set(false);
            return;
        }
        this.requestedSlug.set(slug);
        this.api.getPublicSite(slug).subscribe({
            next: (site) => {
                this.site.set(site);
                const home = site.pages.find((p) => p.isHome) ?? site.pages[0];
                if (home) this.activePath.set(home.path);
                this.loading.set(false);
            },
            error: (e) => {
                this.error.set(e?.status === 404
                    ? `No hay ningún sitio publicado con el slug "${slug}".`
                    : `No se pudo cargar el sitio "${slug}" (${e?.status ?? 'sin conexión'}).`);
                this.loading.set(false);
            }
        });
    }

    go(page: PublicSitePageDto): void {
        this.activePath.set(page.path);
    }

    body(page: PublicSiteSectionDto): any {
        try {
            return JSON.parse(page.bodyJson || '{}');
        } catch {
            return {};
        }
    }

    field(page: PublicSiteSectionDto, ...keys: string[]): string {
        const b = this.body(page);
        for (const k of keys) {
            const v = b[k];
            if (typeof v === 'string' && v.trim()) return v;
        }
        return '';
    }

    list(section: PublicSiteSectionDto, key: string): any[] {
        const b = this.body(section);
        const v = b[key];
        return Array.isArray(v) ? v : [];
    }

    roomList = computed<PublicRoomDto[]>(() => this.site()?.rooms ?? []);

    imgUrl(v: any): string {
        if (typeof v === 'string') return v;
        if (v && typeof v === 'object') {
            const u = v['url'] ?? v['src'] ?? v['image'];
            if (typeof u === 'string' && u.trim()) return u;
        }
        return '';
    }

    text(v: any, ...keys: string[]): string {
        if (typeof v === 'string') return v.trim();
        if (!v || typeof v !== 'object') return '';
        for (const k of keys) {
            const val = v[k];
            if (typeof val === 'string' && val.trim()) return val.trim();
        }
        return '';
    }

    num(v: any, key: string): number {
        const val = v && typeof v === 'object' ? v[key] : undefined;
        const n = Number(val);
        return Number.isFinite(n) ? Math.round(n) : 0;
    }

    ratingOf(v: any): number {
        const n = this.num(v, 'rating');
        return n > 0 && n <= 5 ? n : 0;
    }

    stars(rating: number): number[] {
        return Array.from({ length: Math.max(0, Math.min(5, rating)) });
    }

    itemUrlText(v: any): string {
        return this.text(v, 'name', 'label');
    }

    money(amount: number): string {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(amount ?? 0);
    }
}