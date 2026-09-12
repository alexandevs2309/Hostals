import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'no-hotel-page',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="no-hotel">
            <div class="no-hotel__inner">
                <div class="no-hotel__icon"><i class="pi pi-building"></i></div>
                <span class="no-hotel__eyebrow"><i class="pi pi-info-circle"></i> Configuración inicial</span>
                <h1 class="no-hotel__title">Aún no hay una propiedad<br>asociada a tu cuenta.</h1>
                <p class="no-hotel__desc">
                    Para operar con Hospitality OS necesitas al menos un hotel o propiedad.<br>
                    Pide acceso a un administrador o crea la primera propiedad.
                </p>
                <div class="no-hotel__actions">
                    <a class="no-hotel__btn no-hotel__btn--primary" routerLink="/">
                        <i class="pi pi-home"></i> Ir al inicio
                    </a>
                    <a class="no-hotel__btn no-hotel__btn--ghost" routerLink="/contact">
                        Contactar soporte
                    </a>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host { display: block; }
        .no-hotel {
            min-height: 100%;
            padding: 2rem 1rem;
            display: flex; align-items: center; justify-content: center;
        }
        .no-hotel__inner {
            text-align: center; max-width: 520px;
            display: flex; flex-direction: column; align-items: center; gap: 1.1rem;
        }
        .no-hotel__icon {
            width: 74px; height: 74px; border-radius: 24px;
            background: linear-gradient(180deg, var(--hos-teal-500), var(--hos-teal-700));
            color: #fff; display: grid; place-items: center;
            font-size: 1.8rem; box-shadow: 0 16px 40px rgba(13,148,136,.35);
        }
        .no-hotel__eyebrow {
            display: inline-flex; align-items: center; gap: 8px;
            font-size: 0.72rem; font-weight: 700; letter-spacing: .14em;
            text-transform: uppercase; color: var(--hos-primary);
            padding: 7px 14px; border-radius: 999px;
            border: 1px solid var(--hos-teal-300); background: var(--hos-primary-soft);
        }
        .no-hotel__title {
            font-family: var(--hos-font-display);
            font-size: clamp(1.6rem, 4vw, 2.25rem);
            font-weight: 800; letter-spacing: -0.04em; line-height: 1.15;
            margin: 0; color: var(--hos-text);
        }
        .no-hotel__desc {
            color: var(--hos-text-muted); font-size: 1rem; line-height: 1.65; margin: 0;
        }
        .no-hotel__actions {
            display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: .4rem;
        }
        .no-hotel__btn {
            display: inline-flex; align-items: center; gap: 8px;
            padding: .875rem 1.5rem; border-radius: 999px;
            font-size: .9375rem; font-weight: 600;
            border: 1.5px solid transparent; text-decoration: none;
            transition: transform .2s, box-shadow .2s, border-color .15s, color .15s;
            font-family: var(--hos-font-sans);
        }
        .no-hotel__btn--primary {
            background: linear-gradient(180deg, var(--hos-teal-500), var(--hos-teal-700));
            color: #fff; box-shadow: 0 10px 28px rgba(13,148,136,.3);
        }
        .no-hotel__btn--primary:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(13,148,136,.4); }
        .app-dark .no-hotel__btn--primary { color: #042f2e; }
        .no-hotel__btn--ghost {
            background: transparent; color: var(--hos-text-muted); border-color: var(--hos-border);
        }
        .no-hotel__btn--ghost:hover { border-color: var(--hos-primary); color: var(--hos-primary); }
        @media (max-width: 480px) {
            .no-hotel__actions { flex-direction: column; }
            .no-hotel__btn { justify-content: center; }
        }
    `]
})
export class NoHotelPage {}