import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GosPage } from '@/app/shared/components/page';
import { GosCtaSection } from '@/app/shared/components/cta-section';
import { StaggerDirective, RevealDirective } from '@/app/shared/directives/reveal.directive';

export interface BlogPost {
    slug: string;
    title: string;
    category: string;
    date: string;
    read: string;
    thumb: string;
    excerpt: string;
    html: string;
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: 'revpar-vs-adr-guia-completa',
        title: 'RevPAR vs. ADR: la guía que tu gerencia necesita',
        category: 'Finanzas',
        date: '29 Ago 2026',
        read: '6 min',
        thumb: 'gos-thumb-teal',
        excerpt: 'Dos métricas, una sola historia. Aprende a leer el rendimiento real de tu hotel sin confundir tarifa promedio con rentabilidad.',
        html: `
            <p>Durante años, muchos gerentes miden su hotel solo por la tarifa promedio por habitación. Pero el ADR cuenta la mitad de la historia: dice cuánto cobras, no cuánto vendes.</p>
            <p>El RevPAR combina precio y ocupación en una métrica única, y es la que tu propiedad debería revisar todas las mañanas.</p>
            <h2>La fórmula que importa</h2>
            <p>RevPAR = Habitaciones vendidas en ingresos ÷ Habitaciones disponibles. Es simple, pero revela si estás subiendo la tarifa a costa de la ocupación.</p>
            <blockquote>Subir 10% el ADR no es una victoria si pierdes 12 puntos de ocupación.</blockquote>
            <h2>Cómo usarlo cada día</h2>
            <p>Separa tu análisis por canal, por tipo de habitación y por día de la semana. Así sabrás si tu tarifa hacer descuentos de fin de semana o si tu revenue manager está dejando habitaciones vacías en temporada alta.</p>
            <h2>La integración importa</h2>
            <p>En Hospitality OS, occupancy, ADR y RevPAR se calculan solos desde reservas, tarifas y disponibilidad. Tu equipo ve los KPIs al abrir la plataforma.</p>
        `
    },
    {
        slug: 'housekeeping-productividad',
        title: 'Housekeeping: duplica la productividad de tu equipo sin más personal',
        category: 'Operación',
        date: '20 Ago 2026',
        read: '5 min',
        thumb: 'gos-thumb-slate',
        excerpt: 'Tiempos de limpieza, prioridades por checkout y estados sincronizados. Cómo el housekeeping deja de ser el cuello de botella de tu hotel.',
        html: `
            <p>El housekeeping no es el fin del proceso: es la mitad. La habitación que no está lista a las 14:00 es una venta que se pierde.</p>
            <h2>¿Dónde se va el tiempo?</h2>
            <p>En la mayoría de los hoteles, no en el trabajo físico sino en la coordinación: radios, papeles, idas y vueltas para saber qué está disponible.</p>
            <h2>Prioridad por checkout</h2>
            <p>El equipo debe saber qué camas son urngencias: checkouts de la mañana, llegadas de la tarde, stayovers. Un panel que ordena por prioridad elimina decisiones improvisadas.</p>
            <blockquote>Las cámaras empiezan el turno sabiendo exactamente qué hacer y en qué orden.</blockquote>
            <h2>Mide, no adivines</h2>
            <p>Los tiempos reales de limpieza por tipo de habitación permiten dimensionar la plantilla correctamente. Ya no es proyección: es dato.</p>
        `
    },
    {
        slug: 'sobreventa-hoteles-evitar',
        title: 'Adiós al overbooking: control de disponibilidad en tiempo real',
        category: 'Operación',
        date: '12 Ago 2026',
        read: '4 min',
        thumb: 'gos-thumb-rose',
        excerpt: 'El overbooking es el error más caro y más evitable de la hostelería. Cómo un estado de habitación sincronizado lo elimina de raíz.',
        html: `
            <p>Un overbooking no es solo una noche perdida: es una reseña negativa, un huésped molesto y un equipo en crisis jugando a reasignar habitaciones a las 19:00.</p>
            <h2>De dónde nace el problema</h2>
            <p>De sistemas desconectados. El canal online vende una habitación que recepción ya tiene bloqueada por mantenimiento.</p>
            <h2>Un solo estado de verdad</h2>
            <p>Cuando la disponibilidad se computa de un inventario único, el conflictos desaparece. Reservas, bloqueos, salidas de servicio y canales miran los mismos datos.</p>
            <blockquote>La verdad sobre tu habitación está en un solo lugar, en tiempo real.</blockquote>
            <h2>Señales de alerta temprana</h2>
            <p>Alertas de sold out por tipología y de presión por tramo de fechas permiten actuar antes de comprometer una cancelación costosa.</p>
        `
    },
    {
        slug: 'upselling-huespedes-datos',
        title: 'Upselling con datos: el huésped que ya está en tu casa',
        category: 'Ventas',
        date: '5 Ago 2026',
        read: '5 min',
        thumb: 'gos-thumb-indigo',
        excerpt: 'El huésped que ya está en tu hotel es tu mayor oportunidad. Preferencias, historial y gasto acumulado para ofrecer lo correcto en el momento correcto.',
        html: `
            <p>Conseguir un huésped nuevo cuesta dinero. Aumentar el gasto de un huésped que ya duerme en tu casa solo cuesta contexto.</p>
            <h2>La regla del momento</h2>
            <p>No se trata de vender más, se trata de ofrecer lo correcto en el momento correcto: un upgrade antes de la llegada, una cortesía en el aniversario, una sesión de spa en un día de lluvia.</p>
            <blockquote>El mejor vendedor de tu hotel es el historial de tus huéspedes.</blockquote>
            <h2>Preferencias que se respetan</h2>
            <p>Cada huésped con deseos guardados, alérgicos y tipo de habitación favorita. El staff llega preparado antes de que llegue el huésped.</p>
            <h2>Mide el LTV</h2>
            <p>Con el gasto acumulado por huésped en un perfil 360°, tus decisiones de segmentación y fidelización dejan de ser intuición.</p>
        `
    },
    {
        slug: 'cierre-de-mes-finanzas-hotel',
        title: 'Cierre de mes para hoteles: de 4 días a 1',
        category: 'Finanzas',
        date: '28 Jul 2026',
        read: '6 min',
        thumb: 'gos-thumb-emerald',
        excerpt: 'El cierre contable consume días valiosos de gerencia. Cómo la conciliación automática y los folios centralizados lo reducen a horas.',
        html: `
            <p>El cierre de mes es el ritual que pocos disfrutan: cuadrar hojas, buscar discrepancias y pedir reportes a cada departamento.</p>
            <h2>Folios centralizados</h2>
            <p>Cuando cada gasto del huésped viaja en un folio único, la conciliación se vuelve un reporte, no una investigación.</p>
            <h2>Ingresos por área</h2>
            <p>Habitaciones, restaurante, spa y extras cada uno con sus reportes. La gerencia ve la contribución de cada área sin armar tablas manuales.</p>
            <blockquote>El mes debería cerrarse con una reunión, no con una noche en vela.</blockquote>
            <h2>Reportes para tu propiedad</h2>
            <p>Exporta estados financieros claros y comparables, listos para enviar a gerencia o al dueño del grupo.</p>
        `
    },
    {
        slug: 'mantenimiento-hoteles-proactivo',
        title: 'Mantenimiento proactivo: evita la habitación fuera de servicio',
        category: 'Operación',
        date: '15 Jul 2026',
        read: '4 min',
        thumb: 'gos-thumb-amber',
        excerpt: 'Cada habitación fuera de servicio por mantenimiento es una venta perdida. Tickets inteligentes y SLA para resolver antes, no después.',
        html: `
            <p>Cuando un clima se rompe en temporada alta, la cuenta no es la reparación: es la habitación que dejas de vender mientras esperas.</p>
            <h2>Reportes desde donde ocurren</h2>
            <p>El housekeeping ve el problema y lo reporta en segundos desde su panel. El ticket llega al responsable indicado con prioridad clara.</p>
            <h2>SLA que se cumplen</h2>
            <p>Cada incidencia tiene un plazo de respuesta y resolución. Las alertas evitan que un tema menor se convierta en habitación fuera de servicio.</p>
            <blockquote>El mantenimiento proactivo protege la habitación que te da de comer.</blockquote>
            <h2>Historial por activo</h2>
            <p>Cada clima, cada tubería, cada equipo con su historial. Decides reparar o reemplazar con datos, no con memoria.</p>
        `
    }
];

@Component({
    selector: 'page-blog',
    standalone: true,
    imports: [RouterModule, GosPage, GosCtaSection, StaggerDirective, RevealDirective],
    template: `
        <gos-page
            eyebrow="Blog"
            titleHtml="Aprende sobre la <span class='gos-grad-text'>operación hotelera.</span>"
            subtitle="Guías, métricas y mejores prácticas para equipos que quieren un hotel más productivo."
            [crumbs]="['Blog']"
        >
            <div cta class="gos-hero__ctas" style="margin-top: 28px">
                <a class="gos-btn gos-btn--ghost" routerLink="/account/register">Recibir cada post</a>
            </div>
        </gos-page>

        <section class="gos-section">
            <div class="gos-container">
                <div class="gos-blog-grid" hosStagger>
                    @for (post of posts; track post.slug) {
                        <a class="gos-blog-card" [routerLink]="['/blog', post.slug]" hosReveal>
                            <div class="gos-blog-card__thumb" [class]="post.thumb">
                                <div class="thumb-beams"></div>
                            </div>
                            <div class="gos-blog-card__body">
                                <div class="gos-blog-card__meta">
                                    <span>{{ post.category }}</span>
                                    <span>·</span>
                                    <span>{{ post.read }}</span>
                                </div>
                                <div class="gos-blog-card__title">{{ post.title }}</div>
                                <p class="gos-blog-card__card-excerpt">{{ post.excerpt }}</p>
                                <span class="gos-link" style="margin-top: 4px">Leer artículo <i class="pi pi-arrow-right"></i></span>
                            </div>
                        </a>
                    }
                </div>
            </div>
        </section>

        <gos-cta-section />
    `
})
export class BlogPage {
    posts = BLOG_POSTS;
}

@Component({
    selector: 'page-blog-detail',
    standalone: true,
    imports: [RouterModule, GosPage, GosCtaSection, RevealDirective],
    template: `
        @if (post) {
            <gos-page
                [eyebrow]="post.category"
                [title]="post.title"
                subtitle=""
                [crumbs]="['Blog', post.category]"
            >
                <div cta class="gos-blog-meta" style="margin-top: 24px">
                    <span class="gos-muted">{{ post.date }}</span>
                    <span class="gos-dot" aria-hidden="true"></span>
                    <span class="gos-muted">{{ post.read }} de lectura</span>
                </div>
            </gos-page>

            <article class="gos-section">
                <div class="gos-container">
                    <div class="gos-blog-article" hosReveal [innerHTML]="post.html"></div>
                    <div style="margin-top: 48px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap">
                        <a class="gos-btn gos-btn--ghost" routerLink="/blog"><i class="pi pi-arrow-left"></i> Volver al blog</a>
                        <a class="gos-btn gos-btn--primary" routerLink="/account/register">Probar la plataforma <i class="pi pi-arrow-right"></i></a>
                    </div>
                </div>
            </article>

            <gos-cta-section />
        }
    `,
    styles: [
        `
            .gos-blog-meta {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 0.9rem;
            }
            .gos-dot {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: var(--hos-text-muted);
            }
        `
    ]
})
export class BlogDetailPage {
    @Input() slug = '';

    get post(): BlogPost | undefined {
        return BLOG_POSTS.find((p) => p.slug === this.slug);
    }
}