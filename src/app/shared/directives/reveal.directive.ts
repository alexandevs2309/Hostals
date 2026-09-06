import { AfterViewInit, Directive, ElementRef, Input, OnDestroy } from '@angular/core';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale' | 'blur';

/**
 * Directiva de aparición al hacer scroll usando IntersectionObserver.
 * Uso: <div [reveal]="'left'"> o <div reveal stagger>
 */
@Directive({
    selector: '[hosReveal]',
    standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
    @Input() hosReveal: RevealDirection | '' = 'up';

    private observer: IntersectionObserver | null = null;

    constructor(private el: ElementRef<HTMLElement>) {}

    ngAfterViewInit(): void {
        const el = this.el.nativeElement;
        el.classList.add('gos-reveal');

        switch (this.hosReveal) {
            case 'down':
                el.classList.add('gos-reveal-down');
                break;
            case 'left':
                el.classList.add('gos-reveal-left');
                break;
            case 'right':
                el.classList.add('gos-reveal-right');
                break;
            case 'scale':
                el.classList.add('gos-reveal-scale');
                break;
            case 'blur':
                el.classList.add('gos-reveal-blur');
                break;
            default:
                el.classList.add('gos-reveal-up');
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            el.classList.add('gos-is-visible');
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        el.classList.add('gos-is-visible');
                        this.observer?.unobserve(el);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
        );

        this.observer.observe(el);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }
}

/**
 * Directiva para animar los hijos directos (stagger).
 * Uso: <div hosStagger>...hijos...</div>
 */
@Directive({
    selector: '[hosStagger]',
    standalone: true
})
export class StaggerDirective implements AfterViewInit, OnDestroy {
    private observer: IntersectionObserver | null = null;

    constructor(private el: ElementRef<HTMLElement>) {}

    ngAfterViewInit(): void {
        const el = this.el.nativeElement;
        el.classList.add('gos-stagger');

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
            el.classList.add('gos-is-visible');
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        el.classList.add('gos-is-visible');
                        this.observer?.unobserve(el);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -6% 0px' }
        );

        this.observer.observe(el);
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }
}