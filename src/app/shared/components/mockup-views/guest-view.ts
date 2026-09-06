import { Component } from '@angular/core';

@Component({
    selector: 'guest-view',
    standalone: true,
    template: `
        <div class="gv">
            <div class="gv-head">
                <div class="gv-user">
                    <div class="gv-avatar">MS</div>
                    <div>
                        <b>María Soler</b>
                        <small>Huésped · Cliente frecuente</small>
                    </div>
                </div>
                <div class="gv-pill">Total gastado<br /><b>$4,850</b></div>
            </div>
            <div class="gv-cards">
                <div class="gv-card">
                    <span>Estancias</span>
                    <b>12</b>
                </div>
                <div class="gv-card">
                    <span>Última visita</span>
                    <b>Abr 2026</b>
                </div>
                <div class="gv-card">
                    <span>Preferencias</span>
                    <b>
                        <i class="pi pi-minus"></i>
                    </b>
                </div>
            </div>
            <div class="gv-list">
                <div class="gv-row"><i class="pi pi-calendar"></i><span>Reserva 3 noches · Suite 301</span><small>12–15 may</small></div>
                <div class="gv-row"><i class="pi pi-star"></i><span>Habitación con vista al mar</span><small>Preferencia</small></div>
                <div class="gv-row"><i class="pi pi-inbox"></i><span>Almohadas hipoalergénicas</span><small>Solicitud</small></div>
                <div class="gv-row"><i class="pi pi-heart"></i><span>Check-out late (14h)</span><small>Nota</small></div>
            </div>
        </div>
    `,
    styles: [
        `
            .gv {
                padding: 20px;
            }
            .gv-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 18px;
                flex-wrap: wrap;
            }
            .gv-user {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .gv-user b {
                display: block;
                font-size: 1rem;
            }
            .gv-user small {
                font-size: 0.72rem;
                color: var(--hos-text-muted);
            }
            .gv-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: var(--hos-grad);
                color: #fff;
                display: grid;
                place-items: center;
                font-weight: 800;
                font-size: 0.8rem;
            }
            .app-dark .gv-avatar {
                color: #042f2e;
            }
            .gv-pill {
                text-align: right;
                font-size: 0.68rem;
                color: var(--hos-text-muted);
                border: 1px solid var(--hos-border);
                border-radius: 12px;
                padding: 8px 14px;
                line-height: 1.4;
            }
            .gv-pill b {
                color: var(--hos-teal-600);
                font-size: 1rem;
            }
            .app-dark .gv-pill b {
                color: var(--hos-teal-400);
            }
            .gv-cards {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-bottom: 16px;
            }
            .gv-card {
                border: 1px solid var(--hos-border);
                border-radius: 12px;
                padding: 12px;
                text-align: center;
            }
            .gv-card span {
                display: block;
                font-size: 0.65rem;
                color: var(--hos-text-muted);
                margin-bottom: 4px;
            }
            .gv-card b {
                font-size: 0.9rem;
            }
            .gv-list {
                border: 1px solid var(--hos-border);
                border-radius: 14px;
                overflow: hidden;
            }
            .gv-row {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 14px;
                font-size: 0.76rem;
                border-bottom: 1px solid var(--hos-border);
            }
            .gv-row:last-child {
                border-bottom: 0;
            }
            .gv-row i {
                color: var(--hos-teal-500);
                font-size: 0.8rem;
                width: 16px;
            }
            .gv-row span {
                flex: 1;
            }
            .gv-row small {
                color: var(--hos-text-muted);
                font-size: 0.68rem;
                white-space: nowrap;
            }
        `
    ]
})
export class GuestView {}