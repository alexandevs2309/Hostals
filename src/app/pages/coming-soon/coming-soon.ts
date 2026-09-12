import { Component, effect, inject, input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MODULE_CONTENT } from '@/app/shared/data/mock.data';
import { ModuleContent } from '@/app/shared/models/hotel.model';

@Component({
    selector: 'app-coming-soon',
    standalone: true,
    imports: [RouterModule],
    template: `
<div class="cs-page">

    <!-- Fondo decorativo -->
    <div class="cs-bg" aria-hidden="true">
        <div class="cs-bg__orb cs-bg__orb--1" [style.background]="'radial-gradient(circle, ' + (content()?.color ?? '#14b8a6') + '22, transparent 65%)'"></div>
        <div class="cs-bg__orb cs-bg__orb--2"></div>
        <div class="cs-bg__grid"></div>
    </div>

    <div class="cs-content">

        @let m = content();

        @if (loading()) {
            <!-- Skeleton -->
            <div class="cs-skel cs-skel--icon" aria-hidden="true"></div>
            <div class="cs-skel cs-skel--badge" aria-hidden="true"></div>
            <div class="cs-skel cs-skel--title" aria-hidden="true"></div>
            <div class="cs-skel cs-skel--line" aria-hidden="true"></div>
            <div class="cs-skel cs-skel--kpis" aria-hidden="true"></div>
            <div class="cs-skel cs-skel--panel" aria-hidden="true"></div>
            <p class="cs-loading">Cargando contenido desde la API…</p>
        } @else if (error()) {
            <!-- Error -->
            <div class="cs-icon cs-icon--error">
                <i class="pi pi-exclamation-triangle"></i>
            </div>
            <span class="cs-badge">
                <span class="cs-badge__dot cs-badge__dot--red"></span>
                Sin conexión
            </span>
            <h1 class="cs-title">No pudimos cargar el módulo.</h1>
            <p class="cs-desc">El servicio no respondió. Intenta de nuevo en unos segundos.</p>
            <div class="cs-actions">
                <a class="cs-btn cs-btn--primary" routerLink="/app"
                   style="background: var(--hos-teal-600, #0d9488); color: #fff">
                    <i class="pi pi-arrow-left"></i> Volver al dashboard
                </a>
                <button type="button" class="cs-btn cs-btn--ghost" (click)="retry()">
                    <i class="pi pi-refresh"></i> Reintentar
                </button>
            </div>
        } @else if (m) {

            <!-- Icono del módulo -->
            <div class="cs-icon" [style.background]="m.color + '18'" [style.color]="m.color">
                <i [class]="m.icon"></i>
            </div>

            <!-- Badge "Próximamente" -->
            <span class="cs-badge">
                <span class="cs-badge__dot"></span>
                En desarrollo · API v1
            </span>

            <!-- Título -->
            <h1 class="cs-title">{{ m.label }}</h1>
            <p class="cs-desc">{{ m.description }}</p>

            <!-- KPIs del módulo -->
            <div class="cs-kpis">
                @for (kpi of m.kpis; track kpi.label) {
                    <div class="cs-kpi">
                        <span class="cs-kpi__label">{{ kpi.label }}</span>
                        <span class="cs-kpi__value">{{ kpi.value }}</span>
                        <span class="cs-kpi__delta" [class]="'cs-kpi__delta--' + kpi.tone">{{ kpi.delta }}</span>
                    </div>
                }
            </div>

            <!-- Preview de datos -->
            <div class="cs-preview">
                <p class="cs-preview__label">Vista previa de datos</p>
                @for (item of m.previewItems; track item.title) {
                    <div class="cs-preview__row">
                        <div class="cs-preview__main">
                            <span class="cs-preview__title">{{ item.title }}</span>
                            <span class="cs-preview__subtitle">{{ item.subtitle }}</span>
                        </div>
                        <span class="cs-preview__meta">{{ item.meta }}</span>
                        <span class="cs-pill" [class]="'cs-pill--' + item.tone">{{ item.status }}</span>
                    </div>
                }
            </div>

            <!-- Lo que incluirá -->
            <div class="cs-features">
                <p class="cs-features__label">Lo que incluirá este módulo</p>
                <ul class="cs-features__list">
                    @for (f of m.features; track f) {
                        <li class="cs-features__item">
                            <i class="pi pi-check-circle cs-features__icon" [style.color]="m.color"></i>
                            <span>{{ f }}</span>
                        </li>
                    }
                </ul>
            </div>

            <!-- Barra de progreso -->
            <div class="cs-progress">
                <div class="cs-progress__header">
                    <span>Progreso del backend</span>
                    <span class="cs-progress__pct">{{ m.progress }}%</span>
                </div>
                <div class="cs-progress__track">
                    <div class="cs-progress__fill"
                         [style.width]="m.progress + '%'"
                         [style.background]="m.color">
                    </div>
                </div>
            </div>

            <!-- Acciones -->
            <div class="cs-actions">
                <a class="cs-btn cs-btn--primary" routerLink="/app"
                   [style.background]="m.color">
                    <i class="pi pi-arrow-left"></i> Volver al dashboard
                </a>
                <a class="cs-btn cs-btn--ghost" routerLink="/account/register">
                    <i class="pi pi-bell"></i> Notificarme cuando esté listo
                </a>
            </div>

        }

    </div>
</div>
    `,
    styles: [`
        .cs-page {
            position: relative;
            min-height: calc(100vh - 120px);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem 1rem;
            overflow: hidden;
        }

        /* ── Fondo ──────────────────────────────────────────── */
        .cs-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .cs-bg__orb { position: absolute; border-radius: 50%; filter: blur(80px); }
        .cs-bg__orb--1 { width: 500px; height: 500px; top: -100px; right: -100px; }
        .cs-bg__orb--2 {
            width: 300px; height: 300px; bottom: -80px; left: -60px;
            background: radial-gradient(circle, rgba(99,102,241,.08), transparent 65%);
        }
        .cs-bg__grid {
            position: absolute; inset: 0;
            background-image:
                linear-gradient(var(--surface-border) 1px, transparent 1px),
                linear-gradient(90deg, var(--surface-border) 1px, transparent 1px);
            background-size: 40px 40px;
            opacity: .3;
            mask-image: radial-gradient(ellipse 60% 70% at 50% 50%, black, transparent);
            -webkit-mask-image: radial-gradient(ellipse 60% 70% at 50% 50%, black, transparent);
        }

        /* ── Contenido ──────────────────────────────────────── */
        .cs-content {
            position: relative; z-index: 1;
            max-width: 760px; width: 100%;
            display: flex; flex-direction: column;
            align-items: center; gap: 1.25rem;
            text-align: center;
        }

        /* ── Icono ──────────────────────────────────────────── */
        .cs-icon {
            width: 80px; height: 80px;
            border-radius: 24px;
            display: grid; place-items: center;
            font-size: 2rem;
            box-shadow: 0 8px 32px rgba(0,0,0,.1);
        }
        .cs-icon--error { background: rgba(239,68,68,.12); color: #ef4444; }

        /* ── Badge ──────────────────────────────────────────── */
        .cs-badge {
            display: inline-flex; align-items: center; gap: 8px;
            font-size: 0.75rem; font-weight: 700;
            letter-spacing: .08em; text-transform: uppercase;
            padding: 6px 14px; border-radius: 999px;
            background: var(--surface-hover);
            border: 1px solid var(--surface-border);
            color: var(--text-color-secondary);
        }
        .cs-badge__dot { width: 7px; height: 7px; border-radius: 50%; background: #f59e0b; animation: csPulse 2s ease-in-out infinite; }
        .cs-badge__dot--red { background: #ef4444; animation: none; }
        @keyframes csPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(.8); } }

        /* ── Título ─────────────────────────────────────────── */
        .cs-title { font-family: var(--font-family); font-size: clamp(1.75rem, 4vw, 2.25rem); font-weight: 800; letter-spacing: -0.03em; color: var(--text-color); margin: 0; line-height: 1.1; }
        .cs-desc { font-size: 1rem; color: var(--text-color-secondary); line-height: 1.7; margin: 0; max-width: 560px; }

        /* ── KPIs ───────────────────────────────────────────── */
        .cs-kpis {
            display: grid; grid-template-columns: repeat(4, 1fr);
            gap: 12px; width: 100%;
        }
        .cs-kpi {
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 14px;
            padding: 16px;
            display: flex; flex-direction: column; gap: 4px;
            text-align: left;
        }
        .cs-kpi__label { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: var(--text-color-secondary); }
        .cs-kpi__value { font-size: 1.35rem; font-weight: 800; letter-spacing: -0.02em; color: var(--text-color); }
        .cs-kpi__delta { font-size: 0.75rem; font-weight: 600; }
        .cs-kpi__delta--teal { color: #0d9488; }
        .cs-kpi__delta--green { color: #16a34a; }
        .cs-kpi__delta--amber { color: #d97706; }
        .cs-kpi__delta--red { color: #dc2626; }
        .cs-kpi__delta--indigo { color: #6366f1; }
        .cs-kpi__delta--slate { color: #64748b; }

        /* ── Preview de datos ───────────────────────────────── */
        .cs-preview {
            width: 100%;
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 16px;
            padding: 20px 24px;
            text-align: left;
        }
        .cs-preview__label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--text-color-secondary); margin: 0 0 12px; }
        .cs-preview__row {
            display: grid; grid-template-columns: 1fr auto auto;
            gap: 14px; align-items: center;
            padding: 10px 0;
            border-top: 1px solid var(--surface-border);
        }
        .cs-preview__row:first-of-type { border-top: 0; }
        .cs-preview__main { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .cs-preview__title { font-size: 0.9rem; font-weight: 700; color: var(--text-color); }
        .cs-preview__subtitle { font-size: 0.78rem; color: var(--text-color-secondary); }
        .cs-preview__meta { font-size: 0.8rem; font-weight: 700; color: var(--text-color); }
        .cs-pill {
            display: inline-flex; align-items: center;
            font-size: 0.72rem; font-weight: 700;
            padding: 4px 10px; border-radius: 999px;
            white-space: nowrap;
        }
        .cs-pill--teal { background: rgba(20,184,166,.12); color: #0d9488; }
        .cs-pill--green { background: rgba(34,197,94,.12); color: #16a34a; }
        .cs-pill--amber { background: rgba(245,158,11,.14); color: #d97706; }
        .cs-pill--red { background: rgba(239,68,68,.12); color: #dc2626; }
        .cs-pill--indigo { background: rgba(99,102,241,.12); color: #6366f1; }
        .cs-pill--slate { background: rgba(100,116,139,.14); color: #64748b; }

        /* ── Features ───────────────────────────────────────── */
        .cs-features {
            width: 100%;
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 16px;
            padding: 20px 24px;
            text-align: left;
        }
        .cs-features__label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--text-color-secondary); margin: 0 0 12px; }
        .cs-features__list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; }
        .cs-features__item { display: flex; align-items: center; gap: 10px; font-size: 0.875rem; color: var(--text-color); }
        .cs-features__icon { font-size: 0.85rem; flex-shrink: 0; }

        /* ── Progreso ───────────────────────────────────────── */
        .cs-progress {
            width: 100%;
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 12px;
            padding: 16px 20px;
        }
        .cs-progress__header { display: flex; justify-content: space-between; font-size: 0.8rem; font-weight: 600; color: var(--text-color-secondary); margin-bottom: 10px; }
        .cs-progress__pct { color: var(--text-color); }
        .cs-progress__track { height: 8px; border-radius: 999px; background: var(--surface-hover); overflow: hidden; }
        .cs-progress__fill { height: 100%; border-radius: 999px; transition: width 1s cubic-bezier(.22,1,.36,1); }

        /* ── Acciones ───────────────────────────────────────── */
        .cs-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; width: 100%; }
        .cs-btn {
            display: inline-flex; align-items: center; gap: 8px;
            padding: 10px 20px; border-radius: 99px;
            font-size: 0.875rem; font-weight: 600;
            border: 1px solid transparent;
            cursor: pointer; text-decoration: none;
            font-family: var(--font-family);
            transition: transform .2s ease, box-shadow .2s ease;
        }
        .cs-btn--primary { color: #fff; }
        .cs-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.2); }
        .cs-btn--ghost { background: var(--surface-card); color: var(--text-color-secondary); border-color: var(--surface-border); }
        .cs-btn--ghost:hover { border-color: var(--primary-color); color: var(--primary-color); }

        /* ── Loading ────────────────────────────────────────── */
        .cs-loading { font-size: 0.8rem; color: var(--text-color-secondary); letter-spacing: .04em; }
        .cs-skel {
            background: linear-gradient(90deg, var(--surface-hover) 25%, var(--surface-border) 37%, var(--surface-hover) 63%);
            background-size: 400% 100%;
            animation: csShimmer 1.4s ease infinite;
            border-radius: 12px;
        }
        @keyframes csShimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }
        .cs-skel--icon { width: 80px; height: 80px; border-radius: 24px; }
        .cs-skel--badge { width: 150px; height: 26px; border-radius: 999px; }
        .cs-skel--title { width: 320px; height: 36px; }
        .cs-skel--line { width: 480px; max-width: 90%; height: 16px; }
        .cs-skel--kpis { width: 100%; height: 96px; }
        .cs-skel--panel { width: 100%; height: 220px; }

        /* ── Dark ───────────────────────────────────────────── */
        .app-dark .cs-pill--teal { background: rgba(20,184,166,.18); color: #5eead4; }
        .app-dark .cs-pill--green { background: rgba(34,197,94,.18); color: #86efac; }
        .app-dark .cs-pill--amber { background: rgba(245,158,11,.18); color: #fcd34d; }
        .app-dark .cs-pill--red { background: rgba(239,68,68,.18); color: #fca5a5; }
        .app-dark .cs-pill--indigo { background: rgba(99,102,241,.2); color: #c7d2fe; }
        .app-dark .cs-pill--slate { background: rgba(148,163,184,.18); color: #cbd5e1; }
        .app-dark .cs-kpi__delta--teal { color: #5eead4; }
        .app-dark .cs-kpi__delta--green { color: #86efac; }
        .app-dark .cs-kpi__delta--amber { color: #fcd34d; }
        .app-dark .cs-kpi__delta--red { color: #fca5a5; }
        .app-dark .cs-kpi__delta--indigo { color: #c7d2fe; }
        .app-dark .cs-kpi__delta--slate { color: #cbd5e1; }

        @media (max-width: 760px) {
            .cs-kpis { grid-template-columns: repeat(2, 1fr); }
            .cs-features__list { grid-template-columns: 1fr; }
        }
        @media (max-width: 580px) {
            .cs-actions { flex-direction: column; }
            .cs-btn { justify-content: center; }
            .cs-preview__row { grid-template-columns: 1fr auto; }
            .cs-preview__meta { display: none; }
        }
    `]
})
export class ComingSoonPage {
    /** Bind de ruta: withComponentInputBinding() inyecta data.module. */
    readonly module = input('reservations');

    readonly loading = signal(true);
    readonly error = signal(false);
    readonly content = signal<ModuleContent | null>(null);

    /** Incrementado por retry() para re-disparar el effect. */
    private readonly reloadToken = signal(0);

    constructor() {
        effect((onCleanup) => {
            const id = this.module();
            this.reloadToken();

            this.loading.set(true);
            this.error.set(false);

            // Usar mock local (MODULE_CONTENT) en lugar de API
            setTimeout(() => {
                const data = MODULE_CONTENT[id] ?? null;
                this.content.set(data);
                this.loading.set(false);
                this.error.set(!data);
            }, 300); // Simular latencia mínima

            onCleanup(() => {});
        });
    }

    retry(): void {
        this.reloadToken.update((n) => n + 1);
    }
}