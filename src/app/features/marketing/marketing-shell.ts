import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GosNavbar } from './navbar';
import { GosFooter } from './footer';

@Component({
    selector: 'gos-shell',
    standalone: true,
    imports: [RouterModule, GosNavbar, GosFooter],
    template: `
        <div class="gos">
            <gos-navbar />
            <main>
                <router-outlet />
            </main>
            <gos-footer />
        </div>
    `
})
export class GosShell {
    @HostListener('window:scroll', [])
    onScroll(): void {
        const nav = document.querySelector('.gos-nav');
        if (nav) {
            nav.classList.toggle('gos-nav--scrolled', window.scrollY > 12);
        }
    }
}