import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HotelService } from '@/app/core/services/hotel.service';
import { DashboardService, DashboardWidgetsDto } from '@/app/core/services/dashboard.service';
import {
    HotelMetrics,
    BookingRow,
    HousekeepingRoom,
    MaintenanceTicket,
    ChartPoint
} from '@/app/shared/models/hotel.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
<div class="hos-dash">

    <!-- ── Cabecera ───────────────────────────────────────── -->
    <div class="hos-dash__header">
        <div>
            <h1 class="hos-dash__title">Buenos días, equipo <span class="hos-wave">👋</span></h1>
            <p class="hos-dash__sub">{{ today }} · {{ hotelName() }}@if (lastUpdated()) { · Actualizado {{ updatedLabel() }} }</p>
        </div>
        <div class="hos-dash__header-actions">
            <span class="hos-live-badge">
                <span class="hos-live-dot"></span> En vivo · 60s
            </span>
            <button class="hos-btn hos-btn--ghost" (click)="refresh()" [disabled]="refreshing()">
                <i class="pi pi-refresh" [class.hos-spin]="refreshing()"></i> Actualizar
            </button>
        </div>
    </div>

    @if (error()) {
        <div class="hos-error">
            <i class="pi pi-exclamation-triangle"></i>
            <span>{{ error() }}</span>
            <button class="hos-btn hos-btn--ghost" (click)="refresh()">Reintentar</button>
        </div>
    }

    @if (loading()) {
        <div class="hos-kpis">
            @for (i of [1,2,3,4,5,6]; track i) {
                <div class="hos-kpi-card hos-skel">
                    <div class="hos-skel__bar" style="width:62%"></div>
                    <div class="hos-skel__bar hos-skel__bar--lg" style="width:80%"></div>
                </div>
            }
        </div>
    } @else {

    <!-- ── KPI Cards ──────────────────────────────────────── -->
    <div class="hos-kpis">
        <div class="hos-kpi-card">
            <div class="hos-kpi-card__icon" style="background: rgba(20,184,166,.12); color: #14b8a6">
                <i class="pi pi-percentage"></i>
            </div>
            <div class="hos-kpi-card__body">
                <span class="hos-kpi-card__label">Ocupación</span>
                <span class="hos-kpi-card__value">{{ metrics().occupancy }}%</span>
                <span class="hos-kpi-card__trend" style="color:var(--text-color-secondary)"><i class="pi pi-hashtag"></i>{{ metrics().occupiedRooms ?? 0 }} de {{ metrics().rooms }} en casa</span>
            </div>
        </div>

        <div class="hos-kpi-card">
            <div class="hos-kpi-card__icon" style="background: rgba(99,102,241,.12); color: #6366f1">
                <i class="pi pi-dollar"></i>
            </div>
            <div class="hos-kpi-card__body">
                <span class="hos-kpi-card__label">Ingresos hoy</span>
                <span class="hos-kpi-card__value">\${{ metrics().revenue | number }}</span>
                <span class="hos-kpi-card__trend" style="color:var(--text-color-secondary)"><i class="pi pi-calendar"></i>Mes: \${{ metrics().monthlyRevenue ?? 0 | number }}</span>
            </div>
        </div>

        <div class="hos-kpi-card">
            <div class="hos-kpi-card__icon" style="background: rgba(245,158,11,.12); color: #f59e0b">
                <i class="pi pi-sign-in"></i>
            </div>
            <div class="hos-kpi-card__body">
                <span class="hos-kpi-card__label">Check-ins hoy</span>
                <span class="hos-kpi-card__value">{{ metrics().checkIns }}</span>
                <span class="hos-kpi-card__trend" style="color:var(--text-color-secondary)"><i class="pi pi-sign-out"></i>{{ metrics().checkOutsToday ?? 0 }} salidas</span>
            </div>
        </div>

        <div class="hos-kpi-card">
            <div class="hos-kpi-card__icon" style="background: rgba(34,197,94,.12); color: #22c55e">
                <i class="pi pi-building"></i>
            </div>
            <div class="hos-kpi-card__body">
                <span class="hos-kpi-card__label">Disponibles</span>
                <span class="hos-kpi-card__value">{{ metrics().availableRooms }} <span class="hos-kpi-card__of">/ {{ metrics().rooms }}</span></span>
                <span class="hos-kpi-card__trend" style="color:var(--text-color-secondary)"><i class="pi pi-wrench"></i>{{ metrics().maintenanceRooms ?? 0 }} en mantenimiento</span>
            </div>
        </div>

        <div class="hos-kpi-card">
            <div class="hos-kpi-card__icon" style="background: rgba(20,184,166,.1); color: #14b8a6">
                <i class="pi pi-chart-bar"></i>
            </div>
            <div class="hos-kpi-card__body">
                <span class="hos-kpi-card__label">ADR</span>
                <span class="hos-kpi-card__value">\${{ metrics().adr }}</span>
                <span class="hos-kpi-card__trend" style="color:var(--text-color-secondary)"><i class="pi pi-tag"></i>Tarifa media por noche</span>
            </div>
        </div>

        <div class="hos-kpi-card">
            <div class="hos-kpi-card__icon" style="background: rgba(99,102,241,.1); color: #6366f1">
                <i class="pi pi-chart-line"></i>
            </div>
            <div class="hos-kpi-card__body">
                <span class="hos-kpi-card__label">RevPAR</span>
                <span class="hos-kpi-card__value">\${{ metrics().revpar }}</span>
                <span class="hos-kpi-card__trend" style="color:var(--text-color-secondary)"><i class="pi pi-sparkles"></i>{{ kpis()['pendingBookings'] ?? 0 }} reservas por confirmar</span>
            </div>
        </div>
    </div>

    <!-- ── Grid principal ─────────────────────────────────── -->
    <div class="hos-dash__grid">

        <!-- Columna izquierda -->
        <div class="hos-dash__col">

            <!-- Reservaciones del día -->
            <div class="hos-card">
                <div class="hos-card__head">
                    <span class="hos-card__title"><i class="pi pi-calendar"></i>Reservaciones del día</span>
                    <a class="hos-card__link" routerLink="/app/reservations">
                        Ver todas <i class="pi pi-arrow-right"></i>
                    </a>
                </div>
                @if (!bookings().length) {
                    <div class="hos-empty-state">
                        <span class="hos-empty-state__dot"></span>
                        <span>No hay reservaciones tocando hoy.</span>
                    </div>
                } @else {
                <div class="hos-table">
                    <div class="hos-table__head">
                        <span>Huésped</span>
                        <span>Hab.</span>
                        <span>Check-in</span>
                        <span>Check-out</span>
                        <span>Estado</span>
                    </div>
                    @for (b of bookings(); track $index) {
                        <div class="hos-table__row">
                            <span class="hos-table__name">{{ b.guest }}</span>
                            <span class="hos-table__room">{{ b.room }}</span>
                            <span>{{ b.checkIn }}</span>
                            <span>{{ b.checkOut }}</span>
                            <span class="hos-badge" [class]="statusClass(b.status)">{{ b.status }}</span>
                        </div>
                    }
                </div>
                }
            </div>

            <!-- Ocupación semanal -->
            <div class="hos-card">
                <div class="hos-card__head">
                    <span class="hos-card__title"><i class="pi pi-chart-bar"></i>Ocupación semanal</span>
                    <span class="hos-tag">{{ avgOccupancy() }}% promedio</span>
                </div>
                @if (!occupancy().length) {
                    <div class="hos-empty-state"><span>Sin datos de ocupación todavía.</span></div>
                } @else {
                <div class="hos-chart">
                    @for (pt of occupancy(); track pt.label; let i = $index) {
                        <div class="hos-chart__col">
                            <span class="hos-chart__val">{{ pt.value }}%</span>
                            <div class="hos-chart__bar-wrap">
                                <div class="hos-chart__bar"
                                     [style.height.%]="pt.value"
                                     [class.hos-chart__bar--peak]="pt.value >= 85">
                                </div>
                            </div>
                            <span class="hos-chart__lbl">{{ pt.label }}</span>
                        </div>
                    }
                </div>
                }
            </div>

        </div>

        <!-- Columna derecha -->
        <div class="hos-dash__col">

            <!-- Housekeeping -->
            <div class="hos-card">
                <div class="hos-card__head">
                    <span class="hos-card__title"><i class="pi pi-sparkles"></i>Housekeeping</span>
                    <a class="hos-card__link" routerLink="/app/housekeeping">
                        Ver panel <i class="pi pi-arrow-right"></i>
                    </a>
                </div>
                <!-- mini stats -->
                <div class="hos-hk-stats">
                    <div class="hos-hk-stat">
                        <span class="hos-hk-dot" style="background:#22c55e"></span>
                        <span>Limpias</span>
                        <b>{{ hkCounts().clean }}</b>
                    </div>
                    <div class="hos-hk-stat">
                        <span class="hos-hk-dot" style="background:#f59e0b"></span>
                        <span>Pendientes</span>
                        <b>{{ hkCounts().pending }}</b>
                    </div>
                    <div class="hos-hk-stat">
                        <span class="hos-hk-dot" style="background:#818cf8"></span>
                        <span>Inspección</span>
                        <b>{{ hkCounts().inspection }}</b>
                    </div>
                    <div class="hos-hk-stat">
                        <span class="hos-hk-dot" style="background:#94a3b8"></span>
                        <span>Mant.</span>
                        <b>{{ hkCounts().maintenance }}</b>
                    </div>
                </div>
                @if (!housekeeping().length) {
                    <div class="hos-empty-state"><span>Nada pendiente de limpieza.</span></div>
                } @else {
                @for (room of housekeeping(); track room.room) {
                    <div class="hos-hk-row">
                        <div class="hos-hk-row__left">
                            <span class="hos-hk-dot" [style.background]="hkColor(room.status)"></span>
                            <span class="hos-hk-row__room">{{ room.room }}</span>
                            <span class="hos-hk-row__who">{{ room.housekeeper }}</span>
                        </div>
                        <div class="hos-hk-row__right">
                            <span class="hos-badge" [class]="hkBadge(room.status)">{{ room.status }}</span>
                            @if (room.priority !== 'baja') {
                                <span class="hos-priority" [class]="priorityClass(room.priority)">{{ room.priority }}</span>
                            }
                        </div>
                    </div>
                }
                }
            </div>

            <!-- Mantenimiento abierto -->
            <div class="hos-card">
                <div class="hos-card__head">
                    <span class="hos-card__title"><i class="pi pi-wrench"></i>Mantenimiento abierto</span>
                    <a class="hos-card__link" routerLink="/app/maintenance">
                        Ver todos <i class="pi pi-arrow-right"></i>
                    </a>
                </div>
                @if (!tickets().length) {
                    <div class="hos-empty-state"><span>Sin tickets abiertos.</span></div>
                } @else {
                @for (t of tickets(); track t.room) {
                    <div class="hos-ticket" [class]="'hos-ticket--' + t.priority">
                        <div class="hos-ticket__left">
                            <span class="hos-ticket__badge" [class]="'hos-ticket__badge--' + t.priority">{{ t.priority }}</span>
                            <div>
                                <span class="hos-ticket__room">Hab. {{ t.room }}</span>
                                <span class="hos-ticket__issue">{{ t.issue }}</span>
                            </div>
                        </div>
                        <div class="hos-ticket__right">
                            @if (t.assignee) { <span class="hos-ticket__assignee">{{ t.assignee }}</span> }
                            @if (t.sla) { <span class="hos-ticket__sla">SLA {{ t.sla }}</span> }
                        </div>
                    </div>
                }
                }
            </div>

            <!-- Revenue mensual -->
            <div class="hos-card">
                <div class="hos-card__head">
                    <span class="hos-card__title"><i class="pi pi-dollar"></i>Revenue mensual</span>
                    @if (revenueTotal() > 0) {
                        <span class="hos-tag hos-tag--up"><i class="pi pi-chart-line"></i>Total \${{ revenueTotal() | number }}</span>
                    }
                </div>
                @if (!revenue().length) {
                    <div class="hos-empty-state"><span>Sin ingresos registrados todavía.</span></div>
                } @else {
                <div class="hos-revenue">
                    @for (pt of revenue(); track pt.label; let i = $index) {
                        <div class="hos-revenue__col">
                            <div class="hos-revenue__bar-wrap">
                                <div class="hos-revenue__bar" [style.height.%]="barPct(pt.value)"></div>
                            </div>
                            <span class="hos-revenue__lbl">{{ pt.label }}</span>
                        </div>
                    }
                </div>
                }
            </div>

        </div>
    </div>

    }
</div>
    `,
    styles: [`
        /* ══════════════════════════════════════════════════════
           DASHBOARD SHELL
        ══════════════════════════════════════════════════════ */
        .hos-dash {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding: 0.5rem 0 2rem;
            font-family: var(--font-family);
        }

        /* ── Cabecera ───────────────────────────────────────── */
        .hos-dash__header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 1rem;
            flex-wrap: wrap;
        }
        .hos-dash__title {
            font-size: 1.375rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: var(--text-color);
            margin: 0;
        }
        .hos-wave { font-style: normal; }
        .hos-dash__sub {
            font-size: 0.8125rem;
            color: var(--text-color-secondary);
            margin: 4px 0 0;
        }
        .hos-dash__header-actions {
            display: flex; align-items: center; gap: 10px;
        }
        .hos-live-badge {
            display: inline-flex; align-items: center; gap: 6px;
            font-size: 0.75rem; font-weight: 700;
            padding: 5px 12px; border-radius: 999px;
            background: rgba(34,197,94,.1);
            border: 1px solid rgba(34,197,94,.3);
            color: #16a34a;
        }
        .hos-live-dot {
            width: 7px; height: 7px; border-radius: 50%;
            background: #22c55e;
            animation: hosPulse 2s ease-in-out infinite;
        }
        @keyframes hosPulse {
            0%,100% { opacity:1; } 50% { opacity:.4; }
        }
        .hos-spin { display: inline-block; animation: hosSpin 1s linear infinite; }
        @keyframes hosSpin { to { transform: rotate(360deg); } }

        /* ── Error banner ───────────────────────────────────── */
        .hos-error {
            display: flex; align-items: center; gap: 10px;
            padding: 12px 16px; border-radius: 10px;
            background: rgba(239,68,68,.08);
            border: 1px solid rgba(239,68,68,.25);
            color: #dc2626; font-size: 0.85rem; font-weight: 600;
            flex-wrap: wrap;
        }
        .hos-error .hos-btn { margin-left: auto; color: #dc2626; border-color: rgba(239,68,68,.4); }

        /* ── Skeleton loading ───────────────────────────────── */
        .hos-skel {
            display: flex; flex-direction: column; gap: 10px; pointer-events: none;
        }
        .hos-skel__bar {
            height: 12px; border-radius: 6px;
            background: linear-gradient(90deg, var(--surface-hover) 25%, var(--surface-border) 50%, var(--surface-hover) 75%);
            background-size: 200% 100%;
            animation: hosShimmer 1.2s infinite;
        }
        .hos-skel__bar--lg { height: 26px; }
        @keyframes hosShimmer { to { background-position: -200% 0; } }

        .hos-empty-state {
            display: flex; align-items: center; justify-content: center; gap: 8px;
            padding: 18px 10px; color: var(--text-color-secondary);
            font-size: 0.8rem; text-align: center;
        }
        .hos-empty-state__dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-color-secondary); opacity: .4; }

        /* ── Botones inline ─────────────────────────────────── */
        .hos-btn {
            display: inline-flex; align-items: center; gap: 6px;
            padding: 7px 14px; border-radius: 8px;
            font-size: 0.8125rem; font-weight: 600;
            border: 1px solid var(--surface-border);
            background: transparent; color: var(--text-color-secondary);
            cursor: pointer; text-decoration: none;
            transition: background .15s, color .15s, border-color .15s;
            font-family: inherit;
        }
        .hos-btn:hover {
            background: var(--surface-hover);
            color: var(--text-color);
            border-color: var(--primary-color);
        }
        .hos-btn--ghost { background: transparent; }
        .hos-btn:disabled { opacity: .55; cursor: wait; }

        /* ── KPI Cards ──────────────────────────────────────── */
        .hos-kpis {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 14px;
        }
        .hos-kpi-card {
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 14px;
            padding: 16px 18px;
            display: flex; gap: 12px; align-items: flex-start;
            transition: transform .25s ease, box-shadow .25s ease;
        }
        .hos-kpi-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 24px rgba(0,0,0,.08);
        }
        .hos-kpi-card__icon {
            width: 40px; height: 40px;
            border-radius: 12px;
            display: grid; place-items: center;
            font-size: 1rem; flex-shrink: 0;
        }
        .hos-kpi-card__body {
            display: flex; flex-direction: column; gap: 3px; min-width: 0;
        }
        .hos-kpi-card__label {
            font-size: 0.72rem; text-transform: uppercase;
            letter-spacing: .07em; color: var(--text-color-secondary);
            font-weight: 600; white-space: nowrap;
        }
        .hos-kpi-card__value {
            font-size: 1.375rem; font-weight: 800;
            letter-spacing: -0.02em; color: var(--text-color);
            line-height: 1.1;
        }
        .hos-kpi-card__of {
            font-size: 0.875rem; font-weight: 400;
            color: var(--text-color-secondary);
        }
        .hos-kpi-card__trend {
            display: flex; align-items: center; gap: 4px;
            font-size: 0.72rem; font-weight: 600;
        }
        .hos-trend--up  { color: #16a34a; }
        .hos-trend--down { color: #dc2626; }

        /* ── Grid 2 cols ────────────────────────────────────── */
        .hos-dash__grid {
            display: grid;
            grid-template-columns: 1.4fr 1fr;
            gap: 1.25rem;
            align-items: start;
        }
        .hos-dash__col {
            display: flex; flex-direction: column; gap: 1.25rem;
        }

        /* ── Card genérica ──────────────────────────────────── */
        .hos-card {
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 14px;
            padding: 20px;
        }
        .hos-card__head {
            display: flex; align-items: center;
            justify-content: space-between;
            gap: 10px; margin-bottom: 16px;
        }
        .hos-card__title {
            display: flex; align-items: center; gap: 8px;
            font-size: 0.875rem; font-weight: 700;
            color: var(--text-color);
        }
        .hos-card__title i { color: var(--primary-color); }
        .hos-card__link {
            display: inline-flex; align-items: center; gap: 5px;
            font-size: 0.75rem; font-weight: 600;
            color: var(--primary-color); text-decoration: none;
            transition: gap .15s;
        }
        .hos-card__link:hover { gap: 8px; }

        /* ── Tags ───────────────────────────────────────────── */
        .hos-tag {
            font-size: 0.68rem; font-weight: 700;
            padding: 3px 10px; border-radius: 999px;
            background: var(--surface-hover);
            color: var(--text-color-secondary);
            border: 1px solid var(--surface-border);
        }
        .hos-tag--up {
            background: rgba(34,197,94,.1);
            color: #16a34a;
            border-color: rgba(34,197,94,.25);
        }

        /* ── Tabla reservaciones ────────────────────────────── */
        .hos-table { display: flex; flex-direction: column; }
        .hos-table__head {
            display: grid;
            grid-template-columns: 1.6fr .7fr .9fr .9fr 1fr;
            gap: 8px; padding: 6px 10px;
            font-size: 0.65rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: .07em;
            color: var(--text-color-secondary);
            background: var(--surface-hover);
            border-radius: 8px 8px 0 0;
        }
        .hos-table__row {
            display: grid;
            grid-template-columns: 1.6fr .7fr .9fr .9fr 1fr;
            gap: 8px; padding: 10px 10px;
            font-size: 0.8rem; color: var(--text-color-secondary);
            align-items: center;
            border-bottom: 1px solid var(--surface-border);
        }
        .hos-table__row:last-child { border-bottom: none; }
        .hos-table__name { font-weight: 600; color: var(--text-color); }
        .hos-table__room { font-weight: 600; }

        /* ── Badges de estado ───────────────────────────────── */
        .hos-badge {
            display: inline-flex; align-items: center;
            font-size: 0.62rem; font-weight: 700;
            padding: 3px 9px; border-radius: 999px;
            white-space: nowrap;
        }
        .hos-badge--checkin   { background: rgba(59,130,246,.12); color: #2563eb; }
        .hos-badge--confirm   { background: rgba(20,184,166,.12); color: #0d9488; }
        .hos-badge--pending   { background: rgba(245,158,11,.12); color: #b45309; }
        .hos-badge--checkout  { background: var(--surface-hover); color: var(--text-color-secondary); }
        .hos-badge--limpia    { background: rgba(34,197,94,.12); color: #16a34a; }
        .hos-badge--pendiente { background: rgba(245,158,11,.12); color: #b45309; }
        .hos-badge--inspeccion{ background: rgba(129,140,248,.12); color: #6366f1; }
        .hos-badge--mant      { background: var(--surface-hover); color: var(--text-color-secondary); }

        /* ── Prioridad ──────────────────────────────────────── */
        .hos-priority {
            font-size: 0.58rem; font-weight: 700;
            text-transform: uppercase; letter-spacing: .06em;
            padding: 2px 7px; border-radius: 999px;
        }
        .hos-priority--alta { background: rgba(239,68,68,.1); color: #dc2626; }
        .hos-priority--media { background: rgba(245,158,11,.1); color: #b45309; }
        .hos-priority--baja { background: var(--surface-hover); color: var(--text-color-secondary); }

        /* ── Gráfica ocupación ──────────────────────────────── */
        .hos-chart {
            display: flex; align-items: flex-end;
            gap: 8px; height: 100px;
        }
        .hos-chart__col {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; gap: 4px; height: 100%;
            justify-content: flex-end;
        }
        .hos-chart__val {
            font-size: 0.6rem; color: var(--text-color-secondary); font-weight: 600;
        }
        .hos-chart__bar-wrap {
            width: 100%; flex: 1; display: flex;
            align-items: flex-end; max-height: 70px;
        }
        .hos-chart__bar {
            width: 100%;
            border-radius: 4px 4px 2px 2px;
            background: color-mix(in srgb, var(--primary-color) 50%, transparent);
            transition: height .4s ease;
            min-height: 4px;
        }
        .hos-chart__bar--peak {
            background: var(--primary-color);
        }
        .hos-chart__lbl {
            font-size: 0.65rem; color: var(--text-color-secondary); font-weight: 600;
        }

        /* ── Housekeeping ───────────────────────────────────── */
        .hos-hk-stats {
            display: flex; gap: 16px; flex-wrap: wrap;
            padding: 10px 0 14px;
            border-bottom: 1px solid var(--surface-border);
            margin-bottom: 12px;
        }
        .hos-hk-stat {
            display: flex; align-items: center; gap: 6px;
            font-size: 0.78rem; color: var(--text-color-secondary);
        }
        .hos-hk-stat b { font-weight: 800; color: var(--text-color); }
        .hos-hk-dot {
            width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
        }
        .hos-hk-row {
            display: flex; align-items: center;
            justify-content: space-between; gap: 8px;
            padding: 8px 0;
            border-bottom: 1px solid var(--surface-border);
            font-size: 0.8rem;
        }
        .hos-hk-row:last-child { border-bottom: none; }
        .hos-hk-row__left {
            display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;
        }
        .hos-hk-row__room {
            font-weight: 700; color: var(--text-color); flex-shrink: 0;
        }
        .hos-hk-row__who {
            color: var(--text-color-secondary);
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .hos-hk-row__right {
            display: flex; align-items: center; gap: 6px; flex-shrink: 0;
        }

        /* ── Tickets mantenimiento ──────────────────────────── */
        .hos-ticket {
            display: flex; align-items: center;
            justify-content: space-between; gap: 10px;
            padding: 10px 12px; border-radius: 10px;
            border-left: 3px solid transparent;
            background: var(--surface-hover);
            margin-bottom: 8px; font-size: 0.8rem;
        }
        .hos-ticket:last-child { margin-bottom: 0; }
        .hos-ticket--critica { border-left-color: #ef4444; }
        .hos-ticket--alta    { border-left-color: #f59e0b; }
        .hos-ticket--media   { border-left-color: #6366f1; }
        .hos-ticket--baja    { border-left-color: var(--surface-border); }
        .hos-ticket__left {
            display: flex; align-items: flex-start; gap: 8px; flex: 1; min-width: 0;
        }
        .hos-ticket__badge {
            font-size: 0.6rem; font-weight: 800;
            text-transform: uppercase; letter-spacing: .06em;
            padding: 2px 8px; border-radius: 6px; flex-shrink: 0;
            white-space: nowrap;
        }
        .hos-ticket__badge--critica { background: rgba(239,68,68,.12); color: #dc2626; }
        .hos-ticket__badge--alta    { background: rgba(245,158,11,.12); color: #b45309; }
        .hos-ticket__badge--media   { background: rgba(99,102,241,.12); color: #6366f1; }
        .hos-ticket__badge--baja    { background: var(--surface-hover); color: var(--text-color-secondary); }
        .hos-ticket__room { font-weight: 700; color: var(--text-color); font-size: 0.75rem; }
        .hos-ticket__issue { color: var(--text-color-secondary); font-size: 0.78rem; display: block; }
        .hos-ticket__right {
            display: flex; flex-direction: column; align-items: flex-end;
            gap: 2px; flex-shrink: 0;
        }
        .hos-ticket__assignee { font-weight: 600; color: var(--text-color); font-size: 0.75rem; }
        .hos-ticket__sla { font-size: 0.68rem; color: var(--text-color-secondary); }

        /* ── Revenue barras ─────────────────────────────────── */
        .hos-revenue {
            display: flex; align-items: flex-end;
            gap: 6px; height: 80px;
        }
        .hos-revenue__col {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; gap: 4px; height: 100%;
            justify-content: flex-end;
        }
        .hos-revenue__bar-wrap {
            width: 100%; flex: 1; display: flex;
            align-items: flex-end; max-height: 60px;
        }
        .hos-revenue__bar {
            width: 100%; border-radius: 3px 3px 1px 1px;
            background: linear-gradient(180deg,
                color-mix(in srgb, var(--primary-color) 80%, transparent),
                color-mix(in srgb, var(--primary-color) 50%, transparent));
            min-height: 4px;
        }
        .hos-revenue__lbl {
            font-size: 0.6rem; color: var(--text-color-secondary); font-weight: 600;
        }

        /* ══════════════════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════════════════ */
        @media (max-width: 1200px) {
            .hos-kpis { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
            .hos-dash__grid { grid-template-columns: 1fr; }
            .hos-kpis { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 580px) {
            .hos-kpis { grid-template-columns: 1fr 1fr; }
            .hos-table__head,
            .hos-table__row {
                grid-template-columns: 1.4fr .7fr 1fr;
            }
            .hos-table__head span:nth-child(3),
            .hos-table__head span:nth-child(4),
            .hos-table__row span:nth-child(3),
            .hos-table__row span:nth-child(4) { display: none; }
        }
    `]
})
export class Dashboard implements OnInit, OnDestroy {
    private dashboard = inject(DashboardService);
    private hotels = inject(HotelService);

    readonly today = new Date().toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    hotelName = signal('');
    lastUpdated = signal<Date | null>(null);
    updatedLabel = computed(() => {
        const d = this.lastUpdated();
        return d ? d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '';
    });

    loading = signal(true);
    refreshing = signal(false);
    error = signal<string | null>(null);

    metrics = signal<HotelMetrics>({ rooms: 0, occupancy: 0, revenue: 0, checkIns: 0, availableRooms: 0, adr: 0, revpar: 0 });
    kpis = signal<Record<string, number>>({});
    bookings = signal<BookingRow[]>([]);
    housekeeping = signal<HousekeepingRoom[]>([]);
    tickets = signal<MaintenanceTicket[]>([]);
    occupancy = signal<ChartPoint[]>([]);
    revenue = signal<ChartPoint[]>([]);
    hkCounts = signal({ clean: 0, pending: 0, inspection: 0, maintenance: 0 });

    private timer?: ReturnType<typeof setInterval>;

    avgOccupancy = computed(() => {
        const vals = this.occupancy().map(p => p.value);
        if (!vals.length) return 0;
        return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    });

    revenueTotal = computed(() =>
        Math.round(this.revenue().reduce((acc, p) => acc + p.value, 0) ?? 0));

    ngOnInit(): void {
        this.resolveHotel();
        this.timer = setInterval(() => this.refresh(), 60_000);
    }

    ngOnDestroy(): void {
        if (this.timer) clearInterval(this.timer);
    }

    private resolveHotel(): void {
        const stored = localStorage.getItem('auth_hotel_id');
        if (stored) {
            this.hotels.getHotelById(stored).subscribe({
                next: (h) => this.hotelName.set(h.name ?? ''),
                error: () => {}
            });
        }
    }

    refresh(): void {
        this.refreshing.set(true);
        const stored = localStorage.getItem('auth_hotel_id');
        if (!stored) {
            this.error.set('No hay una propiedad asociada a tu cuenta todavía.');
            this.loading.set(false);
            this.refreshing.set(false);
            return;
        }
        this.error.set(null);
        forkJoin({
            widgets: this.dashboard.getWidgets().pipe(catchError(() => of(null))),
            kpis: this.dashboard.getKpis().pipe(catchError(() => of(null)))
        }).subscribe(({ widgets, kpis }) => {
            if (!widgets) {
                this.error.set('No se pudieron cargar los datos del dashboard.');
                this.loading.set(false);
                this.refreshing.set(false);
                return;
            }
            this.applyWidgets(widgets, kpis ?? {});
            this.loading.set(false);
            this.refreshing.set(false);
            this.lastUpdated.set(new Date());
        });
    }

    private applyWidgets(w: DashboardWidgetsDto, k: Record<string, number>): void {
        const m = w.metrics;
        this.metrics.set({
            rooms: Math.round(m.totalRooms ?? 0),
            occupiedRooms: Math.round(m.occupiedRooms ?? 0),
            occupancy: Math.round(m.occupancyRate ?? 0),
            revenue: Math.round(m.todayRevenue ?? 0),
            monthlyRevenue: Math.round(m.monthlyRevenue ?? 0),
            checkIns: Math.round(m.checkInsToday ?? 0),
            checkOutsToday: Math.round(m.checkOutsToday ?? 0),
            availableRooms: Math.round(m.availableRooms ?? 0),
            maintenanceRooms: Math.round(m.maintenanceRooms ?? 0),
            adr: Math.round(k['averageDailyRate'] ?? 0),
            revpar: Math.round(k['revenuePerAvailableRoom'] ?? 0)
        });
        this.kpis.set(k);

        this.bookings.set(w.todayBookings.map((b) => ({
            guest: b.guest,
            room: b.room,
            checkIn: b.checkIn,
            checkOut: b.checkOut,
            status: this.bookingStatus(b.status),
            amount: b.amount ?? 0
        })));

        const hk = w.housekeeping;
        this.housekeeping.set(hk.rooms.map((r) => ({
            room: r.room,
            status: this.housekeepingStatus(r.status),
            housekeeper: r.housekeeper ?? '',
            priority: this.housekeepingPriority(r.priority)
        })));
        this.hkCounts.set({
            clean: hk.clean ?? 0,
            pending: hk.pending ?? 0,
            inspection: hk.inspection ?? 0,
            maintenance: hk.maintenance ?? 0
        });

        this.tickets.set(w.maintenanceTickets.map((t) => ({
            room: t.room,
            issue: t.issue,
            priority: this.priorityLabel(t.priority),
            assignee: t.assignee ?? '',
            sla: t.sla ?? '',
            status: 'abierto'
        })));

        this.occupancy.set(w.occupancyTrend.map((p) => ({ label: p.label, value: Math.round(p.value ?? 0) })));
        this.revenue.set(w.revenueTrend.map((p) => ({ label: p.label, value: Math.round(p.value ?? 0) })));
    }

    private bookingStatus(status: string): BookingRow['status'] {
        const map: Record<string, BookingRow['status']> = {
            'Pending': 'pendiente',
            'Confirmed': 'confirmada',
            'CheckedIn': 'check-in',
            'CheckedOut': 'check-out',
            'Cancelled': 'pendiente',
            'NoShow': 'pendiente'
        };
        return map[status] ?? 'pendiente';
    }

    private housekeepingStatus(status: string): HousekeepingRoom['status'] {
        const map: Record<string, HousekeepingRoom['status']> = {
            'Dirty': 'pendiente',
            'InProgress': 'pendiente',
            'Inspection': 'inspeccion',
            'Clean': 'limpia',
            'OutOfService': 'mantenimiento'
        };
        return map[status] ?? 'pendiente';
    }

    private housekeepingPriority(priority: string): HousekeepingRoom['priority'] {
        const map: Record<string, HousekeepingRoom['priority']> = {
            'Critical': 'alta',
            'High': 'alta',
            'Medium': 'media',
            'Low': 'baja'
        };
        return map[priority] ?? 'baja';
    }

    private priorityLabel(priority: string): MaintenanceTicket['priority'] {
        const map: Record<string, MaintenanceTicket['priority']> = {
            'Critical': 'critica',
            'High': 'alta',
            'Medium': 'media',
            'Low': 'baja'
        };
        return map[priority] ?? 'baja';
    }

    statusClass(status: string): string {
        const map: Record<string, string> = {
            'check-in':  'hos-badge--checkin',
            'confirmada':'hos-badge--confirm',
            'pendiente': 'hos-badge--pending',
            'check-out': 'hos-badge--checkout',
        };
        return map[status] ?? '';
    }

    hkColor(status: string): string {
        const map: Record<string, string> = {
            'limpia':        '#22c55e',
            'pendiente':     '#f59e0b',
            'inspeccion':    '#818cf8',
            'mantenimiento': '#94a3b8',
        };
        return map[status] ?? '#94a3b8';
    }

    hkBadge(status: string): string {
        const map: Record<string, string> = {
            'limpia':        'hos-badge--limpia',
            'pendiente':     'hos-badge--pendiente',
            'inspeccion':    'hos-badge--inspeccion',
            'mantenimiento': 'hos-badge--mant',
        };
        return map[status] ?? '';
    }

    priorityClass(p: string): string {
        return `hos-priority--${p}`;
    }

    barPct(value: number): number {
        const max = Math.max(...this.revenue().map(r => r.value));
        if (max <= 0) return 0;
        return Math.max(3, Math.round((value / max) * 100));
    }
}