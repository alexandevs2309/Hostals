import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Testimonial } from '@/app/shared/models/hotel.model';

/**
 * Carousel real genérico con autoplay, touch  swipe, dots y navegación.
 */
@Component({
    selector: 'gos-carousel',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="gos-carousel" (mouseenter)="pause()" (mouseleave)="play()">
            <div class="gos-carousel__viewport" #viewport (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)">
                <div class="gos-carousel__track" [style.transform]="'translateX(-' + current * 100 + '%)'">
                    <div class="gos-carousel__slide" *ngFor="let slide of slides; let i = index" [attr.aria-label]="'Diapositiva ' + (i + 1)">
                        <ng-container *ngTemplateOutlet="slideTemplate; context: { $implicit: slide, index: i }" />
                    </div>
                </div>
            </div>

            @if (showNav) {
                <button type="button" class="gos-carousel__nav gos-carousel__nav--prev" (click)="prev()" aria-label="Anterior">
                    <i class="pi pi-angle-left"></i>
                </button>
                <button type="button" class="gos-carousel__nav gos-carousel__nav--next" (click)="next()" aria-label="Siguiente">
                    <i class="pi pi-angle-right"></i>
                </button>
            }

            <div class="gos-carousel__dots" *ngIf="showDots" role="tablist">
                <button
                    *ngFor="let slide of slides; let i = index"
                    type="button"
                    class="gos-carousel__dot"
                    [class.gos-carousel__dot--active]="i === current"
                    [attr.aria-label]="'Ir a diapositiva ' + (i + 1)"
                    (click)="goTo(i)"
                ></button>
            </div>
        </div>
    `
})
export class GosCarousel<T> implements AfterViewInit, OnDestroy {
    @Input() slides: T[] = [];
    @Input() autoPlay = true;
    @Input() interval = 5000;
    @Input() showDots = true;
    @Input() showNav = true;
    @Input() slideTemplate!: any; // TemplateRef

    @ViewChild('viewport') viewport!: ElementRef<HTMLElement>;

    current = 0;
    private timer: ReturnType<typeof setInterval> | null = null;
    private touchStartX = 0;
    private touchEndX = 0;

    ngAfterViewInit(): void {
        this.play();
    }

    play(): void {
        if (this.autoPlay && this.slides.length > 1) {
            this.stop();
            this.timer = setInterval(() => this.next(), this.interval);
        }
    }

    pause(): void {
        this.stop();
    }

    stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    goTo(index: number): void {
        this.current = (index + this.slides.length) % this.slides.length;
    }

    next(): void {
        if (this.slides.length === 0) return;
        this.goTo(this.current + 1);
    }

    prev(): void {
        if (this.slides.length === 0) return;
        this.goTo(this.current - 1);
    }

    onTouchStart(event: TouchEvent): void {
        this.touchStartX = event.touches[0].clientX;
        this.pause();
    }

    onTouchEnd(event: TouchEvent): void {
        this.touchEndX = event.changedTouches[0].clientX;
        const delta = this.touchEndX - this.touchStartX;
        if (Math.abs(delta) > 50) {
            if (delta < 0) this.next();
            else this.prev();
        }
        this.play();
    }

    ngOnDestroy(): void {
        this.stop();
    }
}