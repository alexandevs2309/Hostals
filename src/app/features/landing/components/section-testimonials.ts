import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RevealDirective, StaggerDirective } from '@/app/shared/directives/reveal.directive';

interface RichTestimonial {
    quote: string;
    name: string;
    role: string;
    property: string;
    propertyType: string;
    avatarColor: 'primary' | 'alt' | 'warm' | 'cool';
    highlight?: string; // palabra o frase a resaltar del quote
}

const RICH_TESTIMONIALS: RichTestimonial[] = [
    {
        quote: 'Hospitality OS nos permitió conectar recepción, housekeeping y gerencia en una sola operación. Dejamos de usar cinco herramientas distintas.',
        highlight: 'cinco herramientas distintas',
        name: 'Laura Méndez',
        role: 'Gerente General',
        property: 'Hotel Aurora',
        propertyType: 'Hotel boutique · 48 hab.',
        avatarColor: 'primary'
    },
    {
        quote: 'La operación dejó de depender de hojas de cálculo y mensajes de WhatsApp. Todo vive en un solo lugar y el equipo lo adoptó en horas.',
        highlight: 'lo adoptó en horas',
        name: 'Ricardo Salas',
        role: 'Director de Operaciones',
        property: 'Grand Caribe Resort',
        propertyType: 'Resort todo incluido · 320 hab.',
        avatarColor: 'cool'
    },
    {
        quote: 'El check-in pasó de minutos a segundos. Las cámaras siempre saben qué habitación sigue y recepción ve el estado en vivo.',
        highlight: 'de minutos a segundos',
        name: 'Valentina Ríos',
        role: 'Jefa de Recepción',
        property: 'Casa Palma',
        propertyType: 'Villa de lujo · 12 hab.',
        avatarColor: 'alt'
    },
    {
        quote: 'Los reportes de finanzas se generan solos. Cerramos el mes en un día. Antes nos llevaba una semana completa.',
        highlight: 'en un día',
        name: 'Andrés Celi',
        role: 'CFO',
        property: 'Ocean Suites Group',
        propertyType: 'Multi-propiedad · 4 hoteles',
        avatarColor: 'warm'
    }
];

@Component({
    selector: 'gos-section-testimonials',
    standalone: true,
    imports: [CommonModule, RevealDirective, StaggerDirective],
    template: `
        <section class="tm-section">
            <div class="tm-bg" aria-hidden="true"></div>

            <div class="gos-container">

                <!-- cabecera -->
                <div class="tm-head" hosReveal>
                    <span class="tm-eyebrow"><i class="pi pi-heart"></i>Clientes</span>
                    <h2 class="tm-title">Lo que dicen quienes<br><span class="tm-grad">operan con nosotros.</span></h2>
                    <p class="tm-subtitle">
                        Recepción, operaciones y gerencia con la misma información en tiempo real.
                    </p>
                </div>

                <!-- quote destacado — el primero -->
                <div class="tm-featured" hosReveal>
                    <div class="tm-featured__marks" aria-hidden="true">"</div>
                    <blockquote class="tm-featured__quote">
                        {{ featured.quote }}
                    </blockquote>
                    <div class="tm-featured__meta">
                        <div class="tm-avatar tm-avatar--lg" [class]="'tm-avatar--' + featured.avatarColor">
                            {{ initials(featured.name) }}
                        </div>
                        <div class="tm-featured__info">
                            <span class="tm-featured__name">{{ featured.name }}</span>
                            <span class="tm-featured__role">{{ featured.role }} · {{ featured.property }}</span>
                            <span class="tm-featured__prop">{{ featured.propertyType }}</span>
                        </div>
                        <div class="tm-stars" aria-label="5 estrellas">
                            <i class="pi pi-star-fill"></i>
                            <i class="pi pi-star-fill"></i>
                            <i class="pi pi-star-fill"></i>
                            <i class="pi pi-star-fill"></i>
                            <i class="pi pi-star-fill"></i>
                        </div>
                    </div>
                </div>

                <!-- grid de las 3 restantes -->
                <div class="tm-grid" hosStagger>
                    @for (t of rest; track t.name) {
                        <div class="tm-card">
                            <!-- estrellas -->
                            <div class="tm-stars tm-stars--sm">
                                <i class="pi pi-star-fill"></i>
                                <i class="pi pi-star-fill"></i>
                                <i class="pi pi-star-fill"></i>
                                <i class="pi pi-star-fill"></i>
                                <i class="pi pi-star-fill"></i>
                            </div>

                            <!-- quote -->
                            <p class="tm-card__quote">"{{ t.quote }}"</p>

                            <!-- separador -->
                            <div class="tm-card__sep"></div>

                            <!-- autor -->
                            <div class="tm-card__author">
                                <div class="tm-avatar tm-avatar--md" [class]="'tm-avatar--' + t.avatarColor">
                                    {{ initials(t.name) }}
                                </div>
                                <div class="tm-card__info">
                                    <span class="tm-card__name">{{ t.name }}</span>
                                    <span class="tm-card__role">{{ t.role }}</span>
                                    <span class="tm-card__prop">
                                        <i class="pi pi-building"></i> {{ t.property }}
                                        <span class="tm-card__type">· {{ t.propertyType }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <!-- banda inferior: logos / tipo de clientes -->
                <div class="tm-types" hosReveal>
                    <span class="tm-types__label">Confían en Hospitality OS</span>
                    <div class="tm-types__chips">
                        @for (type of propertyTypes; track type.label) {
                            <span class="tm-type-chip">
                                <i [class]="type.icon"></i>{{ type.label }}
                            </span>
                        }
                    </div>
                </div>

            </div>
        </section>
    `,
    styles: [`
        /* ══════════════════════════════════════════════════
           SECCIÓN
        ══════════════════════════════════════════════════ */
        .tm-section {
            position: relative;
            padding-block: 96px;
            overflow: hidden;
            background: var(--hos-bg-soft);
        }
        .tm-bg {
            position: absolute; inset: 0;
            background:
                radial-gradient(ellipse 70% 50% at 20% 50%, rgba(20,184,166,.06) 0%, transparent 60%),
                radial-gradient(ellipse 60% 40% at 80% 20%, rgba(99,102,241,.05) 0%, transparent 55%);
            pointer-events: none;
        }

        /* ══════════════════════════════════════════════════
           CABECERA
        ══════════════════════════════════════════════════ */
        .tm-head {
            text-align: center;
            max-width: 680px;
            margin-inline: auto;
            margin-bottom: 3.5rem;
        }
        .tm-eyebrow {
            display: inline-flex; align-items: center; gap: 8px;
            font-size: 0.72rem; font-weight: 700;
            letter-spacing: .14em; text-transform: uppercase;
            color: var(--hos-primary);
            padding: 7px 14px; border-radius: 999px;
            border: 1px solid var(--hos-teal-300);
            background: var(--hos-primary-soft);
        }
        .app-dark .tm-eyebrow { border-color: rgba(var(--hos-accent-rgb),.35); }
        .tm-title {
            font-family: var(--hos-font-display);
            font-size: clamp(2rem, 4vw, 2.8rem);
            font-weight: 800; letter-spacing: -0.04em;
            line-height: 1.1; margin: 1.25rem 0 1rem;
        }
        .tm-grad {
            background: var(--hos-grad);
            -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent; color: transparent;
        }
        .tm-subtitle {
            color: var(--hos-text-muted); font-size: 1.05rem;
            line-height: 1.7; margin: 0;
        }

        /* ══════════════════════════════════════════════════
           QUOTE DESTACADO
        ══════════════════════════════════════════════════ */
        .tm-featured {
            position: relative;
            max-width: 860px;
            margin: 0 auto 3rem;
            padding: 3rem 3.5rem;
            background: var(--hos-surface);
            border: 1px solid var(--hos-border);
            border-radius: 28px;
            box-shadow: var(--hos-shadow-lg);
            overflow: hidden;
        }
        .tm-featured::before {
            content: '';
            position: absolute; inset: 0;
            border-radius: 28px; padding: 1.5px;
            background: var(--hos-grad);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor; mask-composite: exclude;
            pointer-events: none;
        }
        .tm-featured__marks {
            position: absolute; top: 16px; left: 32px;
            font-family: Georgia, serif;
            font-size: 8rem; line-height: 1;
            color: var(--hos-primary);
            opacity: .08; pointer-events: none;
            user-select: none;
        }
        .tm-featured__quote {
            font-family: var(--hos-font-display);
            font-size: clamp(1.25rem, 2.4vw, 1.625rem);
            font-weight: 600; letter-spacing: -0.02em;
            line-height: 1.5;
            color: var(--hos-text);
            margin: 0 0 2rem;
            position: relative; z-index: 1;
        }
        .tm-featured__meta {
            display: flex;
            align-items: center;
            gap: 16px;
            flex-wrap: wrap;
        }
        .tm-featured__info {
            display: flex; flex-direction: column; gap: 2px; flex: 1;
        }
        .tm-featured__name {
            font-weight: 800; font-size: 1rem;
        }
        .tm-featured__role {
            font-size: 0.85rem; color: var(--hos-text-muted);
        }
        .tm-featured__prop {
            font-size: 0.75rem; color: var(--hos-primary);
            font-weight: 600; margin-top: 2px;
        }

        /* ══════════════════════════════════════════════════
           GRID DE CARDS
        ══════════════════════════════════════════════════ */
        .tm-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
            margin-bottom: 3rem;
        }
        .tm-card {
            background: var(--hos-surface);
            border: 1px solid var(--hos-border);
            border-radius: 20px;
            padding: 28px 26px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease, border-color .35s ease;
        }
        .tm-card:hover {
            transform: translateY(-6px);
            box-shadow: var(--hos-shadow-lg);
            border-color: var(--hos-teal-300);
        }
        .app-dark .tm-card:hover { border-color: rgba(var(--hos-accent-rgb),.4); }
        .tm-card__quote {
            font-size: 0.9375rem;
            font-weight: 500;
            line-height: 1.7;
            color: var(--hos-text);
            margin: 0; flex: 1;
        }
        .tm-card__sep {
            height: 1px; background: var(--hos-border);
        }
        .tm-card__author {
            display: flex; align-items: center; gap: 12px;
        }
        .tm-card__info {
            display: flex; flex-direction: column; gap: 1px; flex: 1;
        }
        .tm-card__name { font-weight: 700; font-size: 0.875rem; }
        .tm-card__role { font-size: 0.78rem; color: var(--hos-text-muted); }
        .tm-card__prop {
            display: flex; align-items: center; gap: 5px;
            font-size: 0.72rem; color: var(--hos-primary);
            font-weight: 600; margin-top: 2px;
        }
        .tm-card__prop i { font-size: 0.68rem; }
        .tm-card__type { color: var(--hos-text-muted); font-weight: 400; }

        /* ══════════════════════════════════════════════════
           AVATARES
        ══════════════════════════════════════════════════ */
        .tm-avatar {
            border-radius: 50%;
            display: grid; place-items: center;
            font-weight: 800; color: #fff; flex-shrink: 0;
        }
        .tm-avatar--lg { width: 52px; height: 52px; font-size: 1rem; }
        .tm-avatar--md { width: 40px; height: 40px; font-size: 0.8rem; }
        .tm-avatar--primary {
            background: linear-gradient(135deg, var(--hos-teal-500), var(--hos-teal-700));
        }
        .tm-avatar--alt {
            background: linear-gradient(135deg, #64748b, #334155);
        }
        .tm-avatar--cool {
            background: linear-gradient(135deg, #6366f1, #4338ca);
        }
        .tm-avatar--warm {
            background: linear-gradient(135deg, #f59e0b, #b45309);
        }
        .app-dark .tm-avatar--primary { color: #042f2e; }

        /* ══════════════════════════════════════════════════
           ESTRELLAS
        ══════════════════════════════════════════════════ */
        .tm-stars {
            display: flex; align-items: center; gap: 3px;
            color: #fbbf24;
        }
        .tm-stars i { font-size: 0.9rem; }
        .tm-stars--sm i { font-size: 0.72rem; }

        /* ══════════════════════════════════════════════════
           BANDA INFERIOR
        ══════════════════════════════════════════════════ */
        .tm-types {
            display: flex; align-items: center;
            justify-content: center; gap: 20px;
            flex-wrap: wrap;
        }
        .tm-types__label {
            font-size: 0.78rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: .1em;
            color: var(--hos-text-muted);
            white-space: nowrap;
        }
        .tm-types__chips {
            display: flex; align-items: center;
            gap: 10px; flex-wrap: wrap;
        }
        .tm-type-chip {
            display: inline-flex; align-items: center; gap: 7px;
            padding: 8px 16px; border-radius: 999px;
            border: 1px solid var(--hos-border);
            background: var(--hos-surface);
            font-size: 0.82rem; font-weight: 600;
            color: var(--hos-text-muted);
            transition: border-color .2s, color .2s, background .2s;
        }
        .tm-type-chip i { font-size: 0.78rem; color: var(--hos-primary); }
        .tm-type-chip:hover {
            border-color: var(--hos-teal-300);
            color: var(--hos-text);
            background: var(--hos-primary-soft);
        }

        /* ══════════════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════════════ */
        @media (max-width: 900px) {
            .tm-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
            .tm-section { padding-block: 64px; }
            .tm-featured { padding: 2rem 1.5rem; }
            .tm-featured__marks { font-size: 5rem; }
            .tm-grid { grid-template-columns: 1fr; }
            .tm-types { flex-direction: column; gap: 14px; }
        }
    `]
})
export class GosSectionTestimonials {
    testimonials = RICH_TESTIMONIALS;
    featured = RICH_TESTIMONIALS[0];
    rest = RICH_TESTIMONIALS.slice(1);

    propertyTypes = [
        { icon: 'pi pi-building',  label: 'Hoteles urbanos'    },
        { icon: 'pi pi-sun',       label: 'Resorts'            },
        { icon: 'pi pi-home',      label: 'Villas de lujo'     },
        { icon: 'pi pi-th-large',  label: 'Grupos hoteleros'   },
        { icon: 'pi pi-heart',     label: 'Boutique & B&B'     },
    ];

    initials(name: string): string {
        return name.split(' ').slice(0, 2).map(n => n[0]).join('');
    }
}
