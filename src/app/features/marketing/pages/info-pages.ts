import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GosPage } from '@/app/shared/components/page';
import { GosPricingGrid } from '@/app/shared/components/pricing-grid';
import { GosFaqList } from '@/app/shared/components/faq-list';
import { GosCtaSection } from '@/app/shared/components/cta-section';
import { RevealDirective, StaggerDirective } from '@/app/shared/directives/reveal.directive';

@Component({
    selector: 'page-pricing',
    standalone: true,
    imports: [RouterModule, GosPage, GosPricingGrid, GosFaqList, GosCtaSection, RevealDirective],
    template: `
        <gos-page
            eyebrow="Precios"
            titleHtml="Precios simples,<br /><span class='gos-grad-text'>sin sorpresas.</span>"
            subtitle="Elige el plan que se ajusta a tu operación. Todos incluyen soporte, actualizaciones y onboarding."
            [crumbs]="['Precios']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--primary" routerLink="/account/register">Probar gratis 14 días <i class="pi pi-arrow-right"></i></a>
            </div>
        </gos-page>

        <section class="gos-section">
            <div class="gos-container">
                <gos-pricing-grid />
            </div>
        </section>

        <section class="gos-section gos-section--soft">
            <div class="gos-container gos-container--narrow">
                <div class="gos-section-head" hosReveal>
                    <span class="gos-eyebrow"><i class="pi pi-question-circle"></i>Compara planes</span>
                    <h2 class="gos-title gos-title--center" style="font-size: clamp(1.8rem, 3.4vw, 2.5rem)">Qué incluye cada plan</h2>
                </div>
                <div class="gos-compare" hosReveal>
                    <!-- cabecera de columnas -->
                    <div class="gos-compare__row gos-compare__row--head">
                        <div class="gos-compare__label"></div>
                        <div class="gos-compare__cell gos-compare__cell--head">Essential</div>
                        <div class="gos-compare__cell gos-compare__cell--head">
                            Professional
                            <span class="gos-compare__popular">Popular</span>
                        </div>
                        <div class="gos-compare__cell gos-compare__cell--head">Enterprise</div>
                    </div>
                    @for (row of compareRows; track row.label) {
                        <div class="gos-compare__row">
                            <div class="gos-compare__label">{{ row.label }}</div>
                            @for (cell of row.cells; track $index) {
                                <div class="gos-compare__cell">
                                    @if (cell === '—' || cell === '' || cell == null) {
                                        <span class="gos-muted">—</span>
                                    } @else if (cell === '✓') {
                                        <i class="pi pi-check" style="color: var(--hos-teal-500)"></i>
                                    } @else {
                                        <span class="gos-compare__val">{{ cell }}</span>
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </section>

        <section class="gos-section">
            <div class="gos-container gos-container--narrow">
                <div class="gos-section-head" hosReveal>
                    <span class="gos-eyebrow"><i class="pi pi-question-circle"></i>Preguntas frecuentes</span>
                    <h2 class="gos-title gos-title--center" style="font-size: clamp(1.8rem, 3.4vw, 2.5rem)">Antes de decidir</h2>
                </div>
                <gos-faq-list [items]="faqs" />
                <div class="gos-contact-nudge" style="text-align: center; margin-top: 36px">
                    <p class="gos-muted" style="margin: 0">¿Necesitas algo distinto? Escríbenos.</p>
                    <a class="gos-link" routerLink="/contact">Contactar al equipo <i class="pi pi-arrow-right"></i></a>
                </div>
            </div>
        </section>

        <gos-cta-section />
    `,
    styles: [
        `
            .gos-compare {
                border: 1px solid var(--hos-border);
                border-radius: var(--hos-radius-lg);
                overflow: hidden;
                background: var(--hos-surface);
                max-width: 760px;
                margin-inline: auto;
                margin-top: 30px;
            }
            .gos-compare__row {
                display: grid;
                grid-template-columns: 2fr 1fr 1fr 1fr;
            }
            .gos-compare__row + .gos-compare__row {
                border-top: 1px solid var(--hos-border);
            }
            .gos-compare__row--head {
                background: var(--hos-bg-soft);
                position: sticky;
                top: 0;
            }
            .gos-compare__label,
            .gos-compare__cell {
                padding: 16px 20px;
                font-size: 0.9rem;
            }
            .gos-compare__label {
                font-weight: 600;
            }
            .gos-compare__cell {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .gos-compare__cell--head {
                font-size: 0.8rem;
                font-weight: 800;
                color: var(--hos-text);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
            }
            .gos-compare__popular {
                font-size: 0.62rem;
                font-weight: 800;
                padding: 2px 8px;
                border-radius: 999px;
                background: var(--hos-primary-soft);
                color: var(--hos-primary);
                border: 1px solid var(--hos-teal-300);
                letter-spacing: .04em;
            }
            .app-dark .gos-compare__popular {
                border-color: rgba(var(--hos-accent-rgb),.35);
            }
            .gos-compare__val {
                font-size: 0.82rem;
                font-weight: 600;
                color: var(--hos-text);
            }
        `
    ]
})
export class PricingPage {
    faqs = [
        { question: '¿Puedo probar Hospitality OS antes de pagar?', answer: 'Sí. Cualquier plan incluye 14 días de prueba sin tarjeta de crédito y con onboarding guiado.' },
        { question: '¿Hace falta un contrato anual?', answer: 'No. Puedes pagar mensualmente o anual y cancelar cuando quieras.' },
        { question: '¿Qué pasa con mis datos si salgo de la plataforma?', answer: 'Tus datos siempre son tuyos. Exportes completos disponibles en cualquier momento.' },
        { question: '¿El plan Free es gratuitos para siempre?', answer: 'Sí, es gratuito para siempre para un máximo de 5 habitaciones.' }
    ];

    compareRows = [
        { label: 'Habitaciones',           cells: ['Hasta 30', 'Hasta 150', 'Ilimitadas'] },
        { label: 'Reservaciones & PMS',    cells: ['✓', '✓', '✓'] },
        { label: 'Gestión de habitaciones',cells: ['✓', '✓', '✓'] },
        { label: 'Perfiles de huéspedes',  cells: ['✓', '✓', '✓'] },
        { label: 'Housekeeping',           cells: ['—', '✓', '✓'] },
        { label: 'Mantenimiento con SLA',  cells: ['—', '✓', '✓'] },
        { label: 'Finanzas y cierres',     cells: ['—', '✓', '✓'] },
        { label: 'Analytics',              cells: ['—', '✓', '✓'] },
        { label: 'Automatizaciones',       cells: ['—', '✓', '✓'] },
        { label: 'Multi-propiedad',        cells: ['—', '—', '✓'] },
        { label: 'Roles y permisos',       cells: ['—', '—', '✓'] },
        { label: 'SSO / SAML',             cells: ['—', '—', '✓'] },
        { label: 'API e integraciones',    cells: ['—', 'Esenciales', 'Ilimitadas'] },
        { label: 'Soporte',                cells: ['Email', 'Prioritario', 'Dedicado'] },
    ];
}

@Component({
    selector: 'page-about',
    standalone: true,
    imports: [RouterModule, GosPage, GosCtaSection, RevealDirective, StaggerDirective],
    template: `
        <gos-page
            eyebrow="Nosotros"
            titleHtml="Nacimos en la <span class='gos-grad-text'>operación hotelera.</span>"
            subtitle="Hospitality OS empieza con una convicción: los hoteles merecen herramientas tan buenas como las que usa su última industria favorita."
            [crumbs]="['Nosotros']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--primary" routerLink="/account/register">Unirme al equipo <i class="pi pi-arrow-right"></i></a>
            </div>
        </gos-page>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-story" hosReveal>
                    <span class="gos-eyebrow gos-eyebrow--center"><i class="pi pi-book"></i>Nuestra historia</span>
                    <h2 class="gos-title gos-title--center" style="font-size: clamp(1.8rem, 3.4vw, 2.4rem); margin-top: 1rem">Del front desk al producto.</h2>
                    <p style="font-size: 1.05rem; line-height: 1.8; color: var(--hos-text-muted); max-width: 720px; margin: 0">
                        Nuestro equipo trabajó en recepción, housekeeping y gerencia antes de escribir la primera línea de código.
                        Sabemos qué significa un overbooking en temporada alta, un estado de habitación que no se actualiza a tiempo
                        y el cierre de mes con 14 hojas de Excel. Construimos la plataforma que siempre quisimos tener: simple,
                        integrada y que respeta el tiempo del equipo.
                    </p>
                </div>

                <!-- Foto del equipo -->
                <div class="about-photo" hosReveal>
                    <img src="/images/properties/team.jpg"
                         alt="Equipo Hospitality OS trabajando"
                         class="about-photo__img"
                         loading="lazy" />
                    <div class="about-photo__caption">
                        <i class="pi pi-building"></i>
                        El equipo de Hospitality OS · Santo Domingo, República Dominicana
                    </div>
                </div>
            </div>
        </section>

        <section class="gos-section gos-section--soft">
            <div class="gos-container">
                <div class="gos-values" hosStagger>
                    @for (v of values; track v.title) {
                        <div class="gos-value-card">
                            <div class="gos-module-card__icon"><i [class]="v.icon"></i></div>
                            <h3>{{ v.title }}</h3>
                            <p>{{ v.desc }}</p>
                        </div>
                    }
                </div>
            </div>
        </section>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-quote" hosReveal>
                    <p class="gos-quote__text">"Nadie debería perder una tarde entera haciendo un reporte de ocupación."</p>
                    <div class="gos-quote__author">Equipo Hospitality OS</div>
                </div>
            </div>
        </section>

        <gos-cta-section />
    `,
    styles: [
        `
            .gos-values {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
            }
            .gos-value-card {
                border: 1px solid var(--hos-border);
                border-radius: var(--hos-radius-lg);
                padding: 30px 26px;
                background: var(--hos-surface);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            .gos-value-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--hos-shadow);
            }
            .gos-value-card h3 {
                margin-top: 16px;
                margin-bottom: 8px;
            }
            .gos-value-card p {
                margin: 0;
                color: var(--hos-text-muted);
                font-size: 0.92rem;
                line-height: 1.6;
            }
            .gos-quote {
                text-align: center;
                max-width: 640px;
                margin-inline: auto;
                padding-block: 20px;
            }
            .gos-quote__text {
                font-family: var(--hos-font-display);
                font-size: clamp(1.4rem, 2.6vw, 1.9rem);
                font-weight: 700;
                letter-spacing: -0.02em;
                line-height: 1.4;
            }
            .gos-quote__author {
                margin-top: 18px;
                color: var(--hos-text-muted);
                font-size: 0.95rem;
            }
            /* foto equipo */
            .about-photo {
                margin-top: 3rem;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: var(--hos-shadow-lg);
                position: relative;
            }
            .about-photo__img {
                width: 100%;
                height: 420px;
                object-fit: cover;
                object-position: center;
                display: block;
            }
            .about-photo__caption {
                position: absolute;
                bottom: 0; left: 0; right: 0;
                padding: 16px 24px;
                background: linear-gradient(to top, rgba(2,6,23,.7), transparent);
                color: rgba(255,255,255,.85);
                font-size: 0.8rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            @media (max-width: 820px) {
                .gos-values {
                    grid-template-columns: 1fr;
                }
            }
        `
    ]
})
export class AboutPage {
    values = [
        { icon: 'pi pi-bolt', title: 'Velocidad real', desc: 'Menos clics por tarea, menos minutos perdidos por turno. El producto se mide en tiempo ahorrado.' },
        { icon: 'pi pi-heart', title: 'Respeto al equipo', desc: 'Las herramientas no deben castigar a quien las usa. Diseñamos para recepción, housekeeping y gerencia.' },
        { icon: 'pi pi-lock', title: 'Tus datos, tuyos', desc: 'Sin vendor lock-in: exportas lo que quieras, cuando quieras. Privacidad y portabilidad primero.' }
    ];
}

@Component({
    selector: 'page-contact',
    standalone: true,
    imports: [RouterModule, GosPage, GosCtaSection, RevealDirective, ReactiveFormsModule],
    template: `
        <gos-page
            eyebrow="Contacto"
            titleHtml="Hablemos de tu <span class='gos-grad-text'>propiedad.</span>"
            subtitle="Cuéntanos cómo opera tu hotel y te mostraremos cómo se vería en Hospitality OS."
            [crumbs]="['Contacto']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--primary" href="mailto:contacto@auronsuite.com">contacto@auronsuite.com <i class="pi pi-arrow-up-right"></i></a>
            </div>
        </gos-page>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-contact-grid">
                    <div class="gos-contact-info" hosReveal>
                        @for (item of info; track item.label) {
                            <div class="gos-contact-item">
                                <div class="gos-module-card__icon"><i [class]="item.icon"></i></div>
                                <div>
                                    <div class="gos-contact-item__label">{{ item.label }}</div>
                                    <div class="gos-contact-item__value">{{ item.value }}</div>
                                </div>
                            </div>
                        }
                    </div>
                    @if (!sent()) {
                        <form class="gos-contact-form" hosReveal="right" [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
                            <div class="gos-form-row">
                                <div class="gos-field">
                                    <label for="c-name">Nombre</label>
                                    <input id="c-name" class="gos-input" formControlName="name" placeholder="Tu nombre" />
                                    @if (inv('name')) { <span class="gos-error-text">Ingresa tu nombre</span> }
                                </div>
                                <div class="gos-field">
                                    <label for="c-email">Email</label>
                                    <input id="c-email" type="email" class="gos-input" formControlName="email" placeholder="nombre@hotel.com" />
                                    @if (inv('email')) { <span class="gos-error-text">Ingresa un email válido</span> }
                                </div>
                            </div>
                            <div class="gos-field">
                                <label for="c-prop">Tipo de propiedad</label>
                                <select id="c-prop" class="gos-input" formControlName="propertyType">
                                    <option value="">Selecciona…</option>
                                    <option value="Hotel urbano">Hotel urbano</option>
                                    <option value="Resort">Resort</option>
                                    <option value="Villas">Villas</option>
                                    <option value="Grupo / cadena">Grupo / cadena</option>
                                </select>
                                @if (inv('propertyType')) { <span class="gos-error-text">Selecciona el tipo de propiedad</span> }
                            </div>
                            <div class="gos-field">
                                <label for="c-msg">Mensaje</label>
                                <textarea id="c-msg" class="gos-input gos-input--area" rows="5" formControlName="message" placeholder="Cuéntanos cómo opera tu hotel…"></textarea>
                                @if (inv('message')) { <span class="gos-error-text">Cuéntanos en al menos 10 caracteres</span> }
                            </div>
                            <button type="submit" [disabled]="submitting()" class="gos-btn gos-btn--primary gos-btn--block">
                                @if (submitting()) {
                                    Enviando…
                                } @else {
                                    Enviar mensaje <i class="pi pi-send"></i>
                                }
                            </button>
                            <p class="gos-muted" style="text-align: center; font-size: 0.85rem; margin: 14px 0 0">Te respondemos en menos de 24 horas.</p>
                        </form>
                    } @else {
                        <div class="gos-contact-success" hosReveal>
                            <div class="gos-contact-success__icon"><i class="pi pi-check-circle"></i></div>
                            <h3>Mensaje enviado</h3>
                            <p>Gracias por escribirnos. Te contactamos en menos de 24 horas.</p>
                            <button type="button" class="gos-btn gos-btn--ghost" (click)="resetForm()">Enviar otro mensaje</button>
                        </div>
                    }
                </div>
            </div>
        </section>

        <gos-cta-section />
    `,
    styles: [
        `
            .gos-contact-grid {
                display: grid;
                grid-template-columns: 1fr 1.2fr;
                gap: 48px;
                align-items: start;
            }
            .gos-contact-info {
                display: flex;
                flex-direction: column;
                gap: 22px;
            }
            .gos-contact-item {
                display: flex;
                gap: 16px;
                align-items: flex-start;
            }
            .gos-contact-item__label {
                font-size: 0.8rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: var(--hos-text-muted);
            }
            .gos-contact-item__value {
                font-weight: 600;
                margin-top: 2px;
            }
            .gos-contact-form {
                border: 1px solid var(--hos-border);
                border-radius: var(--hos-radius-lg);
                padding: 34px;
                background: var(--hos-surface);
                box-shadow: var(--hos-shadow);
                display: flex;
                flex-direction: column;
                gap: 18px;
            }
            .gos-contact-form .gos-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            .gos-form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            .gos-field {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .gos-field label {
                font-size: 0.85rem;
                font-weight: 600;
            }
            .gos-contact-success {
                border: 1px solid var(--hos-teal-300);
                border-radius: var(--hos-radius-lg);
                padding: 3rem 2rem;
                background: var(--hos-surface);
                box-shadow: var(--hos-shadow);
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.75rem;
            }
            .gos-contact-success__icon {
                width: 64px;
                height: 64px;
                border-radius: 50%;
                display: grid;
                place-items: center;
                font-size: 1.7rem;
                color: var(--hos-teal-600);
                background: var(--hos-primary-soft);
            }
            .gos-contact-success h3 {
                margin: 0;
                font-family: var(--hos-font-display);
                font-size: 1.4rem;
            }
            .gos-contact-success p {
                margin: 0;
                color: var(--hos-text-muted);
            }
            @media (max-width: 820px) {
                .gos-contact-grid {
                    grid-template-columns: 1fr;
                }
                .gos-form-row {
                    grid-template-columns: 1fr;
                }
            }
        `
    ]
})
export class ContactPage {
    info = [
        { icon: 'pi pi-envelope', label: 'Email', value: 'contacto@auronsuite.com' },
        { icon: 'pi pi-phone', label: 'Teléfono', value: '+1 809 676 9729' },
        { icon: 'pi pi-map-marker', label: 'Oficina', value: 'Santa Bárbara de Samaná, Rep. Dom.' },
        { icon: 'pi pi-clock', label: 'Horario', value: 'Lunes a viernes · 9:00 AM – 8:00 PM' }
    ];

    form: FormGroup;
    readonly sent = signal(false);
    readonly submitting = signal(false);
    private tried = false;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            propertyType: ['', Validators.required],
            message: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    /** Campo inválido: tocado o intento de envío */
    inv(field: string): boolean {
        const c = this.form.get(field);
        return !!c && c.invalid && (c.touched || this.tried);
    }

    onSubmit(): void {
        this.tried = true;
        this.form.markAllAsTouched();
        if (this.form.invalid) return;

        /*
         * TODO — Integración backend (pendiente)
         * Cuando exista el endpoint, reemplazar con:
         *   POST /api/v1/contact
         *   this.submitting.set(true);
         *   this.http.post(...).subscribe(() => this.sent.set(true));
         */
        this.submitting.set(true);
        // Síncrono por ahora: el interceptor mock puede servir el endpoint luego.
        window.setTimeout(() => {
            this.submitting.set(false);
            this.sent.set(true);
        }, 600);
    }

    resetForm(): void {
        this.form.reset({ propertyType: '' });
        this.tried = false;
        this.sent.set(false);
    }
}

@Component({
    selector: 'page-faq',
    standalone: true,
    imports: [RouterModule, GosPage, GosFaqList, GosCtaSection],
    template: `
        <gos-page
            eyebrow="FAQ"
            titleHtml="Respuestas <span class='gos-grad-text'>claras.</span>"
            subtitle="Lo que más nos preguntan hoteles, resorts y cadenas antes de dar el salto."
            [crumbs]="['FAQ']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--ghost" routerLink="/contact">¿Algo más? Escríbenos</a>
            </div>
        </gos-page>

        <section class="gos-section">
            <div class="gos-container gos-container--narrow">
                <gos-faq-list [items]="faqs" />
            </div>
        </section>

        <gos-cta-section />
    `
})
export class FaqPage {
    faqs = [
        { question: '¿Cuánto tiempo toma implementar Hospitality OS?', answer: 'La mayoría de los hoteles quedan configurados en un día. El onboarding guiado te acompañamos de principio a fin.' },
        { question: '¿Trabaja con mi channel manager actual?', answer: 'Sí. Tenemos integraciones directas con los principales channel managers y una API abierta para cualquier plataforma.' },
        { question: '¿Es difícil que el equipo lo adopte?', answer: 'Diseñamos la interfaz para que una persona lo use sin formación. Recepción y housekeeping lo toman en horas, no semanas.' },
        { question: '¿Puedo probarlo sin subir mis datos?', answer: 'Claro. Dispones de un entorno de demo con datos de ejemplo para explorar sin compromiso.' },
        { question: '¿Qué pasa si un módulo no lo necesito?', answer: 'Activa solo lo que usas. Pagas por lo que necesitas y puedes escalar cuando tu operación crezca.' },
        { question: '¿Ofrecen soporte en varios idiomas?', answer: 'Sí. Soporte y plataforma en español e inglés, con onboarding en tu idioma.' }
    ];
}