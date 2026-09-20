# Design tokens — AURON Hospitality OS

Guía para migrar pantallas al sistema de diseño. **Regla de oro: no escribir colores hex en componentes; usar tokens.**

## 1. Fuente de verdad

El tema vive en **PrimeNG** (`providePrimeNG`, preset Aura, `primary: 'teal'`, dark mode `.app-dark`). Sobre él existe una **capa semántica `--hos-*`** definida en `src/assets/hospitality.scss`. Los tokens `--hos-*` apuntan a los `--p-*` de PrimeNG, de modo que:

- Al cambiar el preset/paleta primaria, todo el producto se actualiza.
- Al activar `.app-dark` en `<html>`, superficies y texto se invierten solos.

No se deben usar colores de la vieja capa Sakai (`--primary-color`, `--surface-card`, `--text-color`) en código nuevo; se mantienen por compatibilidad del layout.

## 2. Tokens disponibles (`--hos-*`)

| Token | Uso | Origen |
|---|---|---|
| `--hos-primary` | Color de marca, énfasis, focus | `--p-primary-color` |
| `--hos-primary-strong` | Marca en hover/activo | `--p-primary-700` |
| `--hos-primary-soft` | Fondos suaves de marca (chips, hovers) | color-mix 12% |
| `--hos-brand` | Acento de marketing (navbar) | override opcional |
| `--hos-grad` | Gradiente de marca | escala primaria |
| `--hos-bg` | Fondo de app | `--p-surface-50` / dark `-950` |
| `--hos-bg-soft` | Fondo alterno de sección | `--p-surface-100` / dark `-900` |
| `--hos-surface` | Tarjetas, paneles, inputs | `--p-content-background` |
| `--hos-surface-soft` | Fondos interior de controles | `--p-surface-50` / dark `-900` |
| `--hos-border` | Bordes y divisores | `--p-content-border-color` |
| `--hos-text` | Texto principal | `--p-text-color` |
| `--hos-text-muted` | Texto secundario | `--p-text-muted-color` |
| `--hos-success` / `--hos-success-soft` | Éxito | fijo / color-mix |
| `--hos-danger` / `--hos-danger-soft` | Error / destructivo | fijo / color-mix |
| `--hos-warning` / `--hos-warning-soft` | Aviso | fijo / color-mix |
| `--hos-info` / `--hos-info-soft` | Información | `--p-primary-color` |
| `--hos-radius*`, `--hos-shadow*` | Radios y sombras | fijos |
| `--hos-font-sans`, `--hos-font-display` | Tipografía | Inter / Plus Jakarta Sans |

## 3. Dark mode

- Se activa con la clase `.app-dark` en `<html>` (lo gestiona `LayoutService`).
- No hace falta duplicar reglas por modo si usas los tokens de la tabla: ya cambian.
- Solo superficies basadas en primitivos (`--hos-bg`, `--hos-bg-soft`, `--hos-surface-soft`) tienen override explícito en el bloque `.app-dark` de `hospitality.scss`.
- **Prohibido:** `background:#fff`, `color:#0f172a`, `border:#e2e8f0`, etc. Rompen el modo oscuro.

## 4. Checklist para migrar una pantalla

1. Buscar en el `.scss` de la pantalla: `#`, `rgb(`, `rgba(` (excepto sombras con transparencia justificada).
2. Reemplazar por el token semántico correspondiente de la tabla.
3. Sustituir fondos de tarjeta → `var(--hos-surface)`; bordes → `var(--hos-border)`; texto → `var(--hos-text)` / `var(--hos-text-muted)`.
4. Estados (éxito/error/aviso) → `--hos-success`/`--hos-danger`/`--hos-warning` (+ variantes `-soft`).
5. Marca y focus → `--hos-primary` (+ `--hos-primary-soft`).
6. Quitar estilos inline de color en el `.html` (`style="color:#..."`); usar una clase.
7. Verificar en claro **y** oscuro (toggle del topbar).
8. Ejecutar `npx ng build --configuration development`.

## 5. Ejemplo

Antes:
```scss
.card {
    background: #fff;
    border: 1px solid #e2e8f0;
    color: #0f172a;
}
.card__icon { color: #0369a1; }
```

Después:
```scss
.card {
    background: var(--hos-surface);
    border: 1px solid var(--hos-border);
    color: var(--hos-text);
}
.card__icon { color: var(--hos-primary); }
```

## 6. FASE 2 (Foundation) — escalas adicionales

Añadidas en `hospitality.scss` (2026-09-20). Todo bajo `:root` + `.app-dark`; consumir a través de estos tokens.

**Espaciado** (14px base):
`--hos-space-1`..`--hos-space-9` = 4, 8, 12, 16, 20, 24, 32, 40, 48px. Regla: 4–12 / 12–16 / 16–24 / 24–32 / 32–48.

**Tipografía**:
- Sizes: `--hos-fs-2xl` 1.75 / `xl` 1.375 / `lg` 1.125 / `md` 1 / `base` 0.875 / `sm` 0.8125 / `xs` 0.75 rem.
- Pesos: `--hos-fw-medium/semibold/bold/extrabold` (500/600/700/800); line-height `--hos-lh-tight 1.25` / `--hos-lh-base 1.5`.
- Numéricos/KPIs: `--hos-text-numeric` (Plus Jakarta Sans + `font-variant-numeric: tabular-nums`); utilidad `.hos-num`.

**Radio** (escala coherente, corregida):
`--hos-radius-sm` 0.5 / `md` 0.75 / `lg` **1rem** / `xl` 1.25. `--hos-radius` es alias de `lg` (1rem). El marketing que usaba `lg` (1.25rem previo) ahora usa `xl` (valor idéntico conservado).

**Elevación**:
`--hos-shadow-none` (paneles operativos: borde+fondo, sin sombra) / `sm` / `md` (`--hos-shadow`) / `lg` (floating: modales, menús). En `.app-dark` se re-definen automáticamente.

**Densidad**:
`--hos-density` (1 default). Utilidades `.hos-density--compact` (0.85) y `.hos-density--comfortable` (1.15) para el contenedor raíz. Las primitivas aplican `calc(N * var(--hos-density))` en paddings.

**Estados de dominio PMS** (cada uno con variante `-soft` vía `color-mix` que respeta dark):
`--hos-occupied` (azul) · `--hos-available` / `--hos-clean` (verde) · `--hos-dirty` (ámbar) · `--hos-inspection` (índigo) · `--hos-out-of-service` (rojo) · `--hos-maintenance` / `--hos-neutral` (pizarra) · `--hos-pending` (ámbar) · `--hos-active` (marca) · `--hos-inactive` (pizarra claro). Los genéricos `success/danger/warning/info` siguen existiendo.

**Primitivas `hos-*`** (sección 7 de `hospitality.scss`): `hos-page(-head)`, `hos-section`, `hos-metric(--primary/--secondary/__label/__value/__sub)`, `hos-panel`, `hos-btn(--primary/--ghost/--danger/--sm)`, `hos-field`, `hos-input/select/textarea`, `hos-filterbar`, `hos-chip(--on)`, `hos-tabs/hos-tab(--on)`, `hos-table(__head/__row, sticky header, scroll-x)`, `hos-badge--{estado}`, `hos-status-dot--{estado}`, `hos-overlay/hos-modal(--wide/__head/__body/__foot)`, `hos-toast(--ok/--err/--warn)`, `hos-empty`, `hos-error`, `hos-skel` (+`hos-shimmer`), `hos-chart`, `--hos-focus-ring`. Focus visible unificado en primitivas interactivas.
