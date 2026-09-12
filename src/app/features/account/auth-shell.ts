import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HosBrand } from '@/app/shared/components/hos-brand';

@Component({
    selector: 'account-shell',
    standalone: true,
    imports: [RouterModule, HosBrand],
    template: `
        <div class="acct-shell">
            <div class="acct-shell__orb acct-shell__orb--1"></div>
            <div class="acct-shell__orb acct-shell__orb--2"></div>
            <div class="acct-shell__top">
                <hos-brand link="/" />
                <a class="gos-nav__link" routerLink="/"><i class="pi pi-arrow-left"></i> Volver al sitio</a>
            </div>
            <main class="acct-shell__main acct-shell__main-position">
                <router-outlet />
            </main>
            <footer class="acct-shell__foot">
                <span class="gos-muted">&copy; {{ year }} Hospitality OS</span>
                <a class="gos-link" routerLink="/contact">Ayuda</a>
            </footer>
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                min-height: 100vh;
            }
            .acct-shell {
                position: relative;
                isolation: isolate;
                min-height: 100dvh;
                display: flex;
                flex-direction: column;
                overflow-x: hidden;
                background: var(--hos-bg);
            }
            .acct-shell__orb {
                position: absolute;
                width: 520px;
                height: 520px;
                border-radius: 50%;
                filter: blur(110px);
                pointer-events: none;
                z-index: 0;
            }
            .acct-shell__orb--1 {
                top: -180px;
                right: -120px;
                background: rgba(20, 184, 166, 0.22);
            }
            .acct-shell__orb--2 {
                bottom: -220px;
                left: -160px;
                background: rgba(99, 102, 241, 0.18);
            }
            .acct-shell__top {
                position: relative;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 22px 32px;
            }
            .acct-shell__main {
                position: relative;
                z-index: 1;
                display: grid;
                grid-template-columns: minmax(0, 700px);
                justify-content: center;
                align-content: start;
                flex: 1;
                padding: 48px 20px 80px;
            }
            .acct-shell__foot {
                position: relative;
                z-index: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 18px;
                padding: 18px;
                font-size: 0.85rem;
            }
            @media (max-width: 480px) {
                .acct-shell__top {
                    padding: 16px 18px;
                }
            }
        `
    ]
})
export class AccountShell {
    year = new Date().getFullYear();
}