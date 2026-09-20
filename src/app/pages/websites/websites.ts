import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { HotelService, NoHotelConfiguredError } from '@/app/core/services/hotel.service';
import { WebsiteService, WebsiteDto, CreateWebsiteRequest, UpdateWebsitePageRequest, UpdateWebsiteSectionRequest, WebsitePageDto, WebsiteSection } from '@/app/core/services/website.service';

const THEME_LABEL: Record<string, string> = {
    Modern: 'Moderno',
    Classic: 'Clásico',
    Minimal: 'Minimal',
    Luxury: 'Lujo'
};

const SECTION_TYPE_LABEL: Record<string, string> = {
    Hero: 'Hero',
    Rooms: 'Habitaciones',
    Contact: 'Contacto',
    Gallery: 'Galería',
    Testimonials: 'Testimonios',
    Amenities: 'Servicios'
};

const SECTION_DEFAULTS: Record<string, string> = {
    Hero: JSON.stringify({ heading: 'Bienvenido', subheading: 'Descubre nuestra propiedad', imageUrl: '', buttonText: 'Reservar', ctaUrl: '#rooms' }),
    Rooms: JSON.stringify({ heading: 'Nuestras habitaciones' }),
    Contact: JSON.stringify({ heading: 'Contacto', phone: '', email: '' }),
    Gallery: JSON.stringify({ heading: 'Galería', images: [] }),
    Testimonials: JSON.stringify({ heading: 'Opiniones', items: [] }),
    Amenities: JSON.stringify({ heading: 'Servicios', items: [] })
};

@Component({
    selector: 'app-websites',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './websites.html',
    styleUrl: './websites.scss'
})
export class WebsitesPage implements OnInit {
    private hotelsApi = inject(HotelService);
    private websitesApi = inject(WebsiteService);
    private confirmation = inject(ConfirmationService);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    websites = signal<WebsiteDto[]>([]);
    loading = signal(true);
    error = signal<string | null>(null);
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);

    showCreate = signal(false);
    form = {
        name: '',
        slug: '',
        theme: 'Modern',
        customDomain: ''
    };

    showEditor = signal(false);
    editingSite = signal<WebsiteDto | null>(null);
    expandedPage = signal<string | null>(null);

    stats = computed(() => {
        const all = this.websites();
        const published = all.filter((w) => w.isPublished).length;
        const custom = all.filter((w) => w.customDomain && w.isCustomDomainVerified).length;
        const totalPages = all.reduce((acc, w) => acc + (w.pages?.length ?? 0), 0);
        return { total: all.length, published, draft: all.length - published, custom, totalPages };
    });

    themeLabel(t: string): string {
        return THEME_LABEL[t] ?? t;
    }

    sectionTypeLabel(t: string): string {
        return SECTION_TYPE_LABEL[t] ?? t;
    }

    sectionTypeOptions(): string[] {
        return Object.keys(SECTION_DEFAULTS);
    }

    ngOnInit(): void {
        this.resolveHotel();
    }

    private resolveHotel(): void {
        this.hotelsApi.resolveActiveHotel().subscribe({
            next: (hotel) => {
                this.hotelId.set(hotel.id);
                this.hotelName.set(hotel.name);
                this.load();
            },
            error: (err) => this.fail(err instanceof NoHotelConfiguredError
                ? 'No hay ninguna propiedad configurada todavía.'
                : 'No se pudo cargar la propiedad.')
        });
    }

    private load(): void {
        const id = this.hotelId();
        if (!id) return;
        this.loading.set(true);
        this.error.set(null);
        this.websitesApi.getWebsites(id).subscribe({
            next: (list) => {
                this.websites.set(list);
                this.loading.set(false);
            },
            error: () => this.fail('No se pudieron cargar los sitios web.')
        });
    }

    private fail(message: string): void {
        this.error.set(message);
        this.loading.set(false);
    }

    retry(): void {
        const id = this.hotelId();
        if (id) this.load();
        else this.resolveHotel();
    }

    openCreate(): void {
        this.form = { name: '', slug: '', theme: 'Modern', customDomain: '' };
        this.showCreate.set(true);
    }

    slugify(name: string): string {
        return name.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    onNameChange(): void {
        if (!this.form.slug.trim()) {
            this.form.slug = this.slugify(this.form.name);
        }
    }

    submitCreate(): void {
        const hotelId = this.hotelId();
        if (!hotelId || !this.form.name.trim()) return;
        this.showCreate.set(false);
        const request: CreateWebsiteRequest = {
            hotelId,
            name: this.form.name.trim(),
            slug: this.form.slug.trim() || this.slugify(this.form.name),
            theme: this.form.theme,
            customDomain: this.form.customDomain.trim() || undefined
        };
        this.act(() => firstValueFrom(this.websitesApi.createWebsite(request)));
    }

    setPublished(w: WebsiteDto, publish: boolean): void {
        this.act(() => firstValueFrom(this.websitesApi.publishWebsite(w.id, publish)));
    }

    remove(w: WebsiteDto): void {
        this.confirmation.confirm({
            message: `¿Eliminar el sitio web "${w.name}"? Esta acción no se puede deshacer.`,
            header: 'Eliminar sitio web',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            accept: () => this.act(() => firstValueFrom(this.websitesApi.deleteWebsite(w.id)))
        });
    }

    // ── Editor de páginas y secciones (T4.1) ──────────────
    sitePages = computed(() => {
        const site = this.editingSite();
        return [...(site?.pages ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    pageSections = computed(() => {
        const page = this.editingSite()?.pages.find((p) => p.id === this.expandedPage());
        return page ? [...page.sections].sort((a, b) => a.sortOrder - b.sortOrder) : [];
    });

    openEditor(w: WebsiteDto): void {
        this.msg.set('');
        this.websitesApi.getWebsite(w.id).subscribe({
            next: (site) => {
                const full: WebsiteDto = {
                    ...site,
                    pages: site.pages?.map((p) => ({
                        ...p,
                        sections: [...(p.sections ?? [])]
                    })) ?? []
                };
                this.editingSite.set(full);
                this.expandedPage.set(full.pages.find((p) => p.isHome)?.id ?? full.pages[0]?.id ?? null);
                this.showEditor.set(true);
            },
            error: () => this.fail('No se pudo cargar el sitio web.')
        });
    }

    closeEditor(): void {
        this.showEditor.set(false);
        this.editingSite.set(null);
    }

    addPage(): void {
        const site = this.editingSite();
        if (!site) return;
        const sortOrder = (site.pages?.length ?? 0) + 1;
        const page: WebsitePageDto = {
            id: `new-page-${Date.now()}`,
            path: '/nueva-pagina',
            title: 'Nueva página',
            sortOrder,
            isHome: false,
            showInMenu: true,
            sections: [{
                id: `new-section-${Date.now()}`,
                name: 'Hero',
                sectionType: 'Hero',
                bodyJson: SECTION_DEFAULTS['Hero'],
                sortOrder: 1
            }]
        };
        site.pages = [...(site.pages ?? []), page];
        this.editingSite.set(site);
        this.expandedPage.set(page.id);
    }

    removePage(page: WebsitePageDto): void {
        const site = this.editingSite();
        if (!site || page.isHome) return;
        site.pages = (site.pages ?? []).filter((p) => p.id !== page.id);
        if (this.expandedPage() === page.id) {
            this.expandedPage.set(site.pages.find((p) => p.isHome)?.id ?? site.pages[0]?.id ?? null);
        }
        this.editingSite.set(site);
    }

    movePage(page: WebsitePageDto, dir: -1 | 1): void {
        const site = this.editingSite();
        if (!site) return;
        const list = [...this.sitePages()];
        const idx = list.findIndex((p) => p.id === page.id);
        const swap = list[idx + dir];
        if (!swap) return;
        const tmp = list[idx].sortOrder;
        list[idx].sortOrder = swap.sortOrder;
        swap.sortOrder = tmp;
        site.pages = list;
        this.editingSite.set(site);
    }

    toggleMenu(page: WebsitePageDto): void {
        const site = this.editingSite();
        if (!site) return;
        const target = site.pages?.find((p) => p.id === page.id);
        if (target) target.showInMenu = !target.showInMenu;
        this.editingSite.set(site);
    }

    addSection(page: WebsitePageDto, type: string): void {
        const site = this.editingSite();
        const target = site?.pages?.find((p) => p.id === page.id);
        if (!site || !target) return;
        const sortOrder = target.sections.reduce((m, s) => Math.max(m, s.sortOrder), 0) + 1;
        target.sections = [...target.sections, {
            id: `new-section-${Date.now()}`,
            name: this.sectionTypeLabel(type),
            sectionType: type,
            bodyJson: SECTION_DEFAULTS[type] ?? '{}',
            sortOrder
        }];
        this.editingSite.set(site);
    }

    removeSection(page: WebsitePageDto, section: WebsiteSection): void {
        const site = this.editingSite();
        const target = site?.pages?.find((p) => p.id === page.id);
        if (!site || !target) return;
        target.sections = target.sections.filter((s) => s.id !== section.id);
        this.editingSite.set(site);
    }

    moveSection(page: WebsitePageDto, section: WebsiteSection, dir: -1 | 1): void {
        const site = this.editingSite();
        const target = site?.pages?.find((p) => p.id === page.id);
        if (!site || !target) return;
        const sorted = [...target.sections].sort((a, b) => a.sortOrder - b.sortOrder);
        const idx = sorted.findIndex((s) => s.id === section.id);
        const swap = sorted[idx + dir];
        if (!swap) return;
        const tmp = sorted[idx].sortOrder;
        sorted[idx].sortOrder = swap.sortOrder;
        swap.sortOrder = tmp;
        target.sections = sorted;
        this.editingSite.set(site);
    }

    saveEditor(): void {
        const site = this.editingSite();
        if (!site) return;
        const pages = this.sitePages().map((p, i) => {
            const req: UpdateWebsitePageRequest = {
                pageId: p.id,
                path: p.path.trim(),
                title: p.title.trim(),
                metaDescription: p.metaDescription || undefined,
                sortOrder: i + 1,
                isHome: p.isHome,
                showInMenu: p.showInMenu,
                sections: [...p.sections].sort((a, b) => a.sortOrder - b.sortOrder).map((s, j) => {
                    const r: UpdateWebsiteSectionRequest = {
                        sectionId: s.id,
                        name: s.name.trim(),
                        sectionType: s.sectionType,
                        bodyJson: s.bodyJson || '{}',
                        sortOrder: j + 1
                    };
                    return r;
                })
            };
            return req;
        });
        this.showEditor.set(false);
        this.act(() => firstValueFrom(this.websitesApi.updateWebsite({
            id: site.id,
            name: site.name,
            slug: site.slug,
            customDomain: site.customDomain,
            theme: site.theme,
            pages
        })));
        this.editingSite.set(null);
    }

    private act(fn: () => Promise<unknown>): void {
        this.busy.set(true);
        this.msg.set('');
        fn().then(() => {
            this.msg.set('Cambios guardados correctamente.');
            this.msgError.set(false);
            this.load();
        }).catch((e) => {
            this.msg.set(e?.error ?? 'La operación falló. Intenta de nuevo.');
            this.msgError.set(true);
            this.load();
        }).finally(() => this.busy.set(false));
    }
}
