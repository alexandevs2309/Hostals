import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HosBrand } from '@/app/shared/components/hos-brand';

@Component({
    selector: 'gos-footer',
    standalone: true,
    imports: [RouterModule, HosBrand],
    template: `
        <footer class="gos-footer">
            <div class="gos-container">
                <div class="gos-footer__grid">
                    <div class="gos-footer__brand">
                        <hos-brand link="/" />
                        <p class="gos-footer__tagline">El sistema operativo para hoteles modernos. Reservaciones, operación y finanzas en una sola plataforma.</p>
                        <div class="gos-footer__social">
                            <a href="#" aria-label="Twitter / X" (click)="$event.preventDefault()"><i class="pi pi-twitter"></i></a>
                            <a href="#" aria-label="LinkedIn" (click)="$event.preventDefault()"><i class="pi pi-linkedin"></i></a>
                            <a href="#" aria-label="Instagram" (click)="$event.preventDefault()"><i class="pi pi-instagram"></i></a>
                        </div>
                    </div>

                    <div class="gos-footer__col">
                        <div class="gos-footer__col-title">Producto</div>
                        <div class="gos-footer__links">
                            <a class="gos-footer__link" routerLink="/#dashboard">Dashboard</a>
                            <a class="gos-footer__link" routerLink="/modules/reservations">Reservaciones</a>
                            <a class="gos-footer__link" routerLink="/modules/rooms">Habitaciones</a>
                            <a class="gos-footer__link" routerLink="/modules/guests">Huéspedes</a>
                            <a class="gos-footer__link" routerLink="/modules/housekeeping">Housekeeping</a>
                            <a class="gos-footer__link" routerLink="/modules/analytics">Analytics</a>
                        </div>
                    </div>

                    <div class="gos-footer__col">
                        <div class="gos-footer__col-title">Soluciones</div>
                        <div class="gos-footer__links">
                            <a class="gos-footer__link" routerLink="/solutions/hotels">Hoteles</a>
                            <a class="gos-footer__link" routerLink="/solutions/resorts">Resorts</a>
                            <a class="gos-footer__link" routerLink="/solutions/villas">Villas</a>
                            <a class="gos-footer__link" routerLink="/solutions/multi-property">Multi-propiedad</a>
                        </div>
                    </div>

                    <div class="gos-footer__col">
                        <div class="gos-footer__col-title">Recursos</div>
                        <div class="gos-footer__links">
                            <a class="gos-footer__link" routerLink="/blog">Blog</a>
                            <a class="gos-footer__link" routerLink="/faq">FAQ</a>
                            <a class="gos-footer__link" routerLink="/app/documentation">Documentación</a>
                            <a class="gos-footer__link" routerLink="/contact">Contacto</a>
                        </div>
                    </div>

                    <div class="gos-footer__col">
                        <div class="gos-footer__col-title">Empresa</div>
                        <div class="gos-footer__links">
                            <a class="gos-footer__link" routerLink="/about">About</a>
                            <a class="gos-footer__link" routerLink="/contact">Contacto</a>
                            <a class="gos-footer__link" routerLink="/legal/privacidad">Privacidad</a>
                            <a class="gos-footer__link" routerLink="/legal/terminos">Términos</a>
                        </div>
                    </div>

                    <div class="gos-footer__col">
                        <div class="gos-footer__col-title">Account</div>
                        <div class="gos-footer__links">
                            <a class="gos-footer__link" routerLink="/account/login">Iniciar sesión</a>
                            <a class="gos-footer__link" routerLink="/account/register">Crear cuenta</a>
                        </div>
                    </div>
                </div>

                <div class="gos-footer__bottom">
                    <span>© {{ year }} Hospitality OS. Contenido demo.</span>
                    <span>Operación hotelera, reimaginada.</span>
                </div>
            </div>
        </footer>
    `,
    styles: [
        `
            .gos-footer__brand {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
            .gos-footer__tagline {
                margin: 0;
                font-size: 0.9rem;
                color: var(--hos-text-muted);
                line-height: 1.6;
                max-width: 260px;
            }
            .gos-footer__social {
                display: flex;
                gap: 10px;
            }
            .gos-footer__social a {
                width: 38px;
                height: 38px;
                border-radius: 50%;
                border: 1px solid var(--hos-border);
                display: grid;
                place-items: center;
                color: var(--hos-text-muted);
                transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
                font-size: 0.85rem;
            }
            .gos-footer__social a:hover {
                border-color: var(--hos-teal-400);
                color: var(--hos-primary);
                transform: translateY(-3px);
            }
        `
    ]
})
export class GosFooter {
    year = new Date().getFullYear();
}