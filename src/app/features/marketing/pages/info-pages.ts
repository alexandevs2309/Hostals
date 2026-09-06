import { Component } from '@angular/core';
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
                    @for (row of compareRows; track row.label) {
                        <div class="gos-compare__row">
                            <div class="gos-compare__label">{{ row.label }}</div>
                            @for (cell of row.cells; track $index) {
                                <div class="gos-compare__cell">
                                    @if (cell === '—') {
                                        <span class="gos-muted">—</span>
                                    } @else if (cell) {
                                        <i class="pi pi-check" style="color: var(--hos-teal-500)"></i>
                                    } @else {
                                        <span class="gos-muted">—</span>
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
        { label: 'Habitaciones', cells: ['5', '80', '∞'] },
        { label: 'Módulos', cells: ['1', 'Todos', 'Todos'] },
        { label: 'Huéspedes', cells: ['—', '✓', '✓'] },
        { label: 'Analytics', cells: ['—', '✓', '✓'] },
        { label: 'Multi-propiedad', cells: ['—', '—', '✓'] },
        { label: 'API', cells: ['—', '✓', '✓'] },
        { label: 'Soporte prioritario', cells: ['—', '—', '✓'] }
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
    imports: [RouterModule, GosPage, GosCtaSection, RevealDirective],
    template: `
        <gos-page
            eyebrow="Contacto"
            titleHtml="Hablemos de tu <span class='gos-grad-text'>propiedad.</span>"
            subtitle="Cuéntanos cómo opera tu hotel y te mostraremos cómo se vería en Hospitality OS."
            [crumbs]="['Contacto']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--primary" href="mailto:hola@hospitalityos.com">hola@hospitalityos.com <i class="pi pi-arrow-up-right"></i></a>
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
                    <form class="gos-contact-form" hosReveal="right" (ngSubmit)="submit()">
                        <div class="gos-form-row">
                            <div class="gos-field">
                                <label for="c-name">Nombre</label>
                                <input id="c-name" class="gos-input" placeholder="Tu nombre" />
                            </div>
                            <div class="gos-field">
                                <label for="c-email">Email</label>
                                <input id="c-email" type="email" class="gos-input" placeholder="nombre@hotel.com" />
                            </div>
                        </div>
                        <div class="gos-field">
                            <label for="c-prop">Tipo de propiedad</label>
                            <select id="c-prop" class="gos-input">
                                <option>Hotel urbano</option>
                                <option>Resort</option>
                                <option>Villas</option>
                                <option>Grupo / cadena</option>
                            </select>
                        </div>
                        <div class="gos-field">
                            <label for="c-msg">Mensaje</label>
                            <textarea id="c-msg" class="gos-input gos-input--area" rows="5" placeholder="Cuéntanos cómo opera tu hotel…"></textarea>
                        </div>
                        <button type="submit" class="gos-btn gos-btn--primary gos-btn--block">Enviar mensaje <i class="pi pi-send"></i></button>
                        <p class="gos-muted" style="text-align: center; font-size: 0.85rem; margin: 14px 0 0">Te respondemos en menos de 24 horas.</p>
                    </form>
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
        { icon: 'pi pi-envelope', label: 'Email', value: 'hola@hospitalityos.com' },
        { icon: 'pi pi-phone', label: 'Teléfono', value: '+34 900 123 456' },
        { icon: 'pi pi-map-marker', label: 'Oficina', value: 'Paseo de la Castellana 100, Madrid' },
        { icon: 'pi pi-clock', label: 'Horario', value: 'Lunes a viernes · 9:00–18:00' }
    ];

    submit(): void {
        alert('Gracias por escribirnos. Te contactamos pronto.');
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