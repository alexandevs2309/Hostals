import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HosBrand } from '@/app/shared/components/hos-brand';
import { ThemeService } from '@/app/shared/services/theme.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'gos-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, HosBrand],
    host: {
        class: 'gos-nav'
    },
    template: `
        <div class="gos-nav__inner gos-container">
            <hos-brand link="/" />

            <nav class="gos-nav__links" aria-label="Navegación principal">
                <a class="gos-nav__link" routerLink="/features" routerLinkActive="gos-nav__link--active">Producto</a>
                <div class="gos-dropdown" [class.gos-dropdown--open]="openDropdown === 'solutions'" (mouseenter)="openDropdown = 'solutions'" (mouseleave)="openDropdown = null">
                    <button type="button" class="gos-nav__link gos-nav__link--trigger" aria-haspopup="true" [attr.aria-expanded]="openDropdown === 'solutions'" (click)="toggleDropdown('solutions')">
                        Soluciones <i class="pi pi-angle-down"></i>
                    </button>
                    <div class="gos-dropdown__menu" role="menu">
                        <a routerLink="/solutions/hotels" role="menuitem"><i class="pi pi-building"></i>Hoteles</a>
                        <a routerLink="/solutions/resorts" role="menuitem"><i class="pi pi-sun"></i>Resorts</a>
                        <a routerLink="/solutions/villas" role="menuitem"><i class="pi pi-home"></i>Villas</a>
                        <a routerLink="/solutions/multi-property" role="menuitem"><i class="pi pi-th-large"></i>Multi-propiedad</a>
                    </div>
                </div>
                <div class="gos-dropdown" [class.gos-dropdown--open]="openDropdown === 'modules'" (mouseenter)="openDropdown = 'modules'" (mouseleave)="openDropdown = null">
                    <button type="button" class="gos-nav__link gos-nav__link--trigger" aria-haspopup="true" [attr.aria-expanded]="openDropdown === 'modules'" (click)="toggleDropdown('modules')">
                        Módulos <i class="pi pi-angle-down"></i>
                    </button>
                    <div class="gos-dropdown__menu" role="menu">
                        <a routerLink="/modules/reservations" role="menuitem"><i class="pi pi-calendar"></i>Reservaciones</a>
                        <a routerLink="/modules/rooms" role="menuitem"><i class="pi pi-building"></i>Habitaciones</a>
                        <a routerLink="/modules/guests" role="menuitem"><i class="pi pi-user"></i>Huéspedes</a>
                        <a routerLink="/modules/housekeeping" role="menuitem"><i class="pi pi-box"></i>Housekeeping</a>
                        <a routerLink="/modules/maintenance" role="menuitem"><i class="pi pi-wrench"></i>Mantenimiento</a>
                        <a routerLink="/modules/finance" role="menuitem"><i class="pi pi-dollar"></i>Finanzas</a>
                        <a routerLink="/modules/analytics" role="menuitem"><i class="pi pi-chart-line"></i>Analytics</a>
                    </div>
                </div>
                <a class="gos-nav__link" routerLink="/" fragment="operacion">Operación</a>
                <a class="gos-nav__link" routerLink="/pricing">Precios</a>
                <a class="gos-nav__link" routerLink="/blog">Recursos</a>
            </nav>

            <div class="gos-nav__actions">
                <div class="gos-swatch-wrap">
                    <button type="button" class="gos-nav__toggle gos-nav__swatch" (click)="paletteOpen = !paletteOpen" [attr.aria-expanded]="paletteOpen" aria-label="Seleccionar tema de color">
                        <i class="pi pi-palette"></i>
                    </button>

                    @if (paletteOpen) {
                        <div class="gos-nav__pop gos-nav-pop-position">
                            <div class="gos-nav__pop-title">Color primario</div>
                            <div class="gos-nav__swatches">
                                @for (p of themeService.palettes; track p.name) {
                                    <button
                                        type="button"
                                        [title]="p.name"
                                        [style]="{ 'background-color': p.hex }"
                                        [class.gos-nav__swatch--active]="themeService.palette() === p.name"
                                        (click)="themeService.setPalette(p.name); paletteOpen = false"
                                    ></button>
                                }
                            </div>
                        </div>
                    }
                </div>

                <button type="button" class="gos-nav__toggle" (click)="themeService.toggleDarkMode()" [attr.aria-label]="themeService.isDark() ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'">
                    <i [ngClass]="themeService.isDark() ? 'pi pi-sun' : 'pi pi-moon'"></i>
                </button>
                <a class="gos-btn gos-btn--ghost" routerLink="/account/login">Iniciar sesión</a>
                <a class="gos-btn gos-btn--primary" routerLink="/account/register">Solicitar demo</a>
                <button type="button" class="gos-nav__burger" aria-label="Abrir menú" [attr.aria-expanded]="mobileOpen" (click)="mobileOpen = !mobileOpen">
                    <i [ngClass]="mobileOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
                </button>
            </div>
        </div>

        @if (mobileOpen) {
            <div class="gos-nav__mobile gos-nav__mobile-position">
                <a class="gos-nav__link" routerLink="/features" (click)="mobileOpen = false">Producto</a>
                <div class="gos-nav__mobile-group">
                    <div class="gos-nav__mobile-label">Soluciones</div>
                    <a class="gos-nav__link" routerLink="/solutions/hotels" (click)="mobileOpen = false">Hoteles</a>
                    <a class="gos-nav__link" routerLink="/solutions/resorts" (click)="mobileOpen = false">Resorts</a>
                    <a class="gos-nav__link" routerLink="/solutions/villas" (click)="mobileOpen = false">Villas</a>
                    <a class="gos-nav__link" routerLink="/solutions/multi-property" (click)="mobileOpen = false">Multi-propiedad</a>
                </div>
                <div class="gos-nav__mobile-group">
                    <div class="gos-nav__mobile-label">Módulos</div>
                    <a class="gos-nav__link" routerLink="/modules/reservations" (click)="mobileOpen = false">Reservaciones</a>
                    <a class="gos-nav__link" routerLink="/modules/rooms" (click)="mobileOpen = false">Habitaciones</a>
                    <a class="gos-nav__link" routerLink="/modules/guests" (click)="mobileOpen = false">Huéspedes</a>
                    <a class="gos-nav__link" routerLink="/modules/housekeeping" (click)="mobileOpen = false">Housekeeping</a>
                    <a class="gos-nav__link" routerLink="/modules/maintenance" (click)="mobileOpen = false">Mantenimiento</a>
                    <a class="gos-nav__link" routerLink="/modules/finance" (click)="mobileOpen = false">Finanzas</a>
                    <a class="gos-nav__link" routerLink="/modules/analytics" (click)="mobileOpen = false">Analytics</a>
                </div>
                <a class="gos-nav__link" routerLink="/" fragment="operacion" (click)="mobileOpen = false">Operación</a>
                <a class="gos-nav__link" routerLink="/pricing" (click)="mobileOpen = false">Precios</a>
                <a class="gos-nav__link" routerLink="/blog" (click)="mobileOpen = false">Recursos</a>
                <div class="gos-nav__mobile-actions">
                    <div class="gos-nav__swatches gos-nav__swatches--mobile" style="margin-bottom: 16px">
                        @for (p of themeService.palettes; track p.name) {
                            <button
                                type="button"
                                [title]="p.name"
                                [style]="{ 'background-color': p.hex }"
                                [class.gos-nav__swatch--active]="themeService.palette() === p.name"
                                (click)="themeService.setPalette(p.name)"
                            ></button>
                        }
                    </div>
                    <a class="gos-btn gos-btn--ghost" routerLink="/account/login" (click)="mobileOpen = false">Iniciar sesión</a>
                    <a class="gos-btn gos-btn--primary" routerLink="/account/register" (click)="mobileOpen = false">Solicitar demo</a>
                </div>
            </div>
        }
    `,
    styles: [
        `
            :host {
                display: block;
            }
            .gos-dropdown {
                position: relative;
            }
            .gos-nav__link--trigger {
                background: none;
                border: 0;
                cursor: pointer;
            }
            .gos-nav__link--active {
                color: var(--hos-primary);
            }
            .gos-dropdown__menu {
                position: absolute;
                top: calc(100% + 12px);
                left: 50%;
                translate: -50% 6px;
                min-width: 230px;
                border: 1px solid var(--hos-border);
                border-radius: 18px;
                background: var(--hos-surface);
                box-shadow: var(--hos-shadow-lg);
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 2px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(6px);
                transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s;
                z-index: 60;
            }
            .gos-dropdown--open .gos-dropdown__menu,
            .gos-dropdown:hover .gos-dropdown__menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            .gos-dropdown__menu a {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                border-radius: 12px;
                font-size: 0.88rem;
                font-weight: 600;
                color: var(--hos-text);
                transition: background 0.18s ease, color 0.18s ease;
            }
            .gos-dropdown__menu a i {
                font-size: 0.9rem;
                color: var(--hos-primary);
                width: 18px;
                text-align: center;
            }
            .gos-dropdown__menu a:hover {
                background: var(--hos-primary-soft);
                color: var(--hos-primary);
            }
            .gos-nav__mobile-label {
                font-size: 0.7rem;
                font-weight: 700;
                letter-spacing: 0.12em;
                text-transform: uppercase;
                color: var(--hos-text-muted);
                padding: 14px 14px 6px;
            }
            .gos-nav__mobile-group {
                display: flex;
                flex-direction: column;
            }
            .gos-swatch-wrap {
                position: relative;
            }
            .gos-nav__pop {
                position: absolute;
                top: calc(100% + 12px);
                right: 0;
                width: 210px;
                border: 1px solid var(--hos-border);
                border-radius: 18px;
                background: var(--hos-surface);
                box-shadow: var(--hos-shadow-lg);
                padding: 14px 16px 18px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(6px) scale(0.98);
                transform-origin: top right;
                transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
                z-index: 65;
            }
            .gos-swatch-wrap:has(button[aria-expanded="true"]) .gos-nav__pop {
                opacity: 1;
                visibility: visible;
                transform: translateY(0) scale(1);
            }
            .gos-nav__pop-title {
                font-size: 0.8rem;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
                color: var(--hos-text-muted);
                margin-bottom: 12px;
            }
            .gos-nav__swatches {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }
            .gos-nav__swatches button,
            .gos-nav__swatches--mobile button {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 2px solid transparent;
                cursor: pointer;
                transition: border-color 0.15s ease, transform 0.2s ease, box-shadow 0.2s ease;
                box-shadow: inset 0 0 0 0 transparent;
            }
            .gos-nav__swatches button:hover,
            .gos-nav__swatches--mobile button:hover {
                transform: scale(1.18);
            }
            .gos-nav__swatch--active {
                border-color: var(--hos-text) !important;
                box-shadow: 0 0 0 3px var(--hos-bg), 0 0 0 5px var(--hos-text-muted);
            }
            .gos-nav__swatch {
                position: relative;
            }
            .gos-nav__swatch i {
                color: var(--hos-text-muted);
                transition: color 0.15s ease;
            }
            .gos-nav__swatch:hover i {
                color: var(--hos-text);
            }
            .gos-nav__swatches--mobile {
                padding: 0 14px;
            }
        `
    ]
})
export class GosNavbar {
    openDropdown: 'solutions' | 'modules' | null = null;
    mobileOpen = false;
    paletteOpen = false;

    themeService = inject(ThemeService);

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.gos-dropdown') && !target.closest('.gos-swatch-wrap')) {
            this.openDropdown = null;
            this.paletteOpen = false;
        }
    }

    constructor(private router: Router) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.mobileOpen = false;
                this.openDropdown = null;
            }
        });
    }

    toggleDropdown(name: 'solutions' | 'modules'): void {
        this.openDropdown = this.openDropdown === name ? null : name;
    }
}