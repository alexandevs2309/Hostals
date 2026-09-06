import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

/**
 * Convierte el contenido de un elemento en un count-up animado al entrar en viewport.
 * Soporta: números enteros, decimales, moneda ($), porcentaje (%),
 * sufijos de escala (k, M), sufijos de unidad (h, min, x),
 * prefijos (−, +), y strings mixtos como "4,200+", "2.5h", "1.2M", "−35%".
 * Si el texto no es parseable como número, lo deja intacto.
 */
@Directive({ selector: '[hosCountUp]', standalone: true })
export class CountUpDirective implements AfterViewInit, OnDestroy {
    private observer: IntersectionObserver | null = null;
    private rafId: number | null = null;

    constructor(private el: ElementRef<HTMLElement>) {}

    ngAfterViewInit(): void {
        const el = this.el.nativeElement;
        const raw = el.textContent?.trim() ?? '';
        if (!raw) return;

        const parsed = this.parse(raw);
        if (parsed === null) return; // texto no numérico → dejar intacto

        el.classList.add('gos-count');

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        this.observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                this.animate(el, parsed, raw);
                this.observer?.unobserve(el);
            }
        }, { threshold: 0.5 });

        this.observer.observe(el);
    }

    // ── Parser ───────────────────────────────────────────────────────────────
    private parse(raw: string): number | null {
        // Extrae el número central ignorando prefijos/sufijos de texto
        // Ejemplos: "4,200+" → 4200 | "1.2M" → 1200000 | "−35%" → -35
        //           "2.5h" → 2.5  | "98.7%" → 98.7 | "$198" → 198
        //           "∞" → null    | "SSO" → null
        const clean = raw
            .replace(/\s/g, '')
            .replace(/,/g, '')      // separador de miles
            .replace(/[−–]/g, '-'); // guión largo → menos

        // Detectar multiplicador de escala al final
        let multiplier = 1;
        let normalized = clean;
        if (/[kK]$/.test(normalized)) { multiplier = 1_000;     normalized = normalized.slice(0, -1); }
        if (/M$/.test(normalized))     { multiplier = 1_000_000; normalized = normalized.slice(0, -1); }

        // Extraer el número de la cadena (puede tener prefijo +/- y sufijos como %, h, x, +)
        const match = normalized.match(/^([+\-]?\d+(\.\d+)?)/);
        if (!match) return null;

        const num = parseFloat(match[1]);
        if (Number.isNaN(num)) return null;

        return num * multiplier;
    }

    // ── Formateador de salida ────────────────────────────────────────────────
    private format(value: number, targetValue: number, raw: string): string {
        const clean = raw.replace(/\s/g, '').replace(/,/g, '').replace(/[−–]/g, '-');

        // Detectar sufijo de escala original
        const hasK = /[kK]$/.test(clean.replace(/[^a-zA-Z]$/,''));
        const hasM = /M$/.test(clean.replace(/[^a-zA-Z]$/,''));

        // Decimales del original
        const decMatch = raw.replace(/,/g,'').match(/\.(\d+)/);
        const decimals  = decMatch ? decMatch[1].length : 0;

        // Prefijos
        const isCurrency = /[$€£]/.test(raw);
        const isNeg      = /^[−\-]/.test(raw.trim());
        const hasPlus    = /^\+/.test(raw.trim());

        // Valor a mostrar (escala inversa)
        let displayVal = hasM ? value / 1_000_000 : hasK ? value / 1_000 : value;

        let numStr: string;
        if (isCurrency) {
            numStr = '$' + Math.round(displayVal).toLocaleString('en-US');
        } else if (decimals > 0) {
            numStr = displayVal.toFixed(decimals);
        } else {
            numStr = Math.round(displayVal).toLocaleString('en-US');
        }

        // Prefijo de signo
        const prefix = isNeg ? '−' : hasPlus ? '+' : '';

        // Sufijos textuales del original (%, h, k, M, x, +, etc.)
        const suffixMatch = raw.replace(/^[+\-−]/, '').match(/[^\d.,]+$/);
        const suffix = suffixMatch ? suffixMatch[0] : '';

        return `${prefix}${numStr}${suffix}`;
    }

    // ── Animación ────────────────────────────────────────────────────────────
    private animate(el: HTMLElement, target: number, raw: string): void {
        const duration = 1500;
        const start    = performance.now();

        const step = (now: number) => {
            const t       = Math.min((now - start) / duration, 1);
            const eased   = 1 - Math.pow(1 - t, 3);
            const current = target * eased;

            el.textContent = this.format(current, target, raw);

            if (t < 1) {
                this.rafId = requestAnimationFrame(step);
            } else {
                // Al finalizar, restaurar el texto original exacto
                el.textContent = raw;
            }
        };

        this.rafId = requestAnimationFrame(step);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    }
}
