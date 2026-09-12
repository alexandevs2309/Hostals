import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService, AuditLogItem } from '@/app/core/services/audit.service';

const ACTION_LABEL: Record<string, string> = {
    login: 'Inicio de sesión',
    login_failed: 'Login fallido',
    login_locked: 'Cuenta bloqueada',
    register: 'Registro',
    logout: 'Cierre de sesión',
    password_changed: 'Contraseña cambiada',
    password_reset: 'Contraseña restablecida'
};

const ACTION_ICON: Record<string, string> = {
    login: 'pi-sign-in',
    login_failed: 'pi-times-circle',
    login_locked: 'pi-lock',
    register: 'pi-user-plus',
    logout: 'pi-sign-out',
    password_changed: 'pi-key',
    password_reset: 'pi-lock-open'
};

const ACTION_TONE: Record<string, string> = {
    login: 'ok',
    login_failed: 'warn',
    login_locked: 'danger',
    register: 'info',
    logout: 'neutral',
    password_changed: 'teal',
    password_reset: 'amber'
};

const ACTION_DEFAULT = '';

@Component({
    selector: 'app-audit',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './audit.html',
    styleUrl: './audit.scss'
})
export class AuditPage implements OnInit {
    private audit = inject(AuditService);

    items: WritableSignal<AuditLogItem[]> = signal([]);
    total = signal(0);
    loading = signal(true);
    error = signal<string | null>(null);
    refreshing = signal(false);

    actions = Object.keys(ACTION_LABEL);

    search = signal('');
    action = signal<string>(ACTION_DEFAULT);
    from = signal<Date | null>(null);
    to = signal<Date | null>(null);
    pageNumber = signal(1);
    pageSize = 20;

    authFailBadgePulse = false;

    ngOnInit(): void {
        this.load(false);
    }

    load(showSpinner: boolean): void {
        this.loading.set(showSpinner);
        const q = this.search().trim();
        this.audit.getLogs({
            search: q || undefined,
            action: this.action() || undefined,
            from: this.from(),
            to: this.to(),
            pageNumber: this.pageNumber(),
            pageSize: this.pageSize
        }).subscribe({
            next: (page) => {
                this.items.set(page.items);
                this.total.set(page.total);
                this.loading.set(false);
                this.error.set(null);
            },
            error: () => {
                this.loading.set(false);
                this.error.set('No se pudieron cargar los registros de auditoría.');
            }
        });
    }

    applyFilters(): void {
        this.pageNumber.set(1);
        this.load(true);
    }

    setFrom(v: string): void {
        this.from.set(v ? new Date(v + 'T00:00:00') : null);
    }

    setTo(v: string): void {
        this.to.set(v ? new Date(v + 'T23:59:59') : null);
    }

    refresh(): void {
        this.refreshing.set(true);
        this.load(false);
        this.refreshing.set(false);
    }

    clearFilters(): void {
        this.search.set('');
        this.action.set(ACTION_DEFAULT);
        this.from.set(null);
        this.to.set(null);
        this.applyFilters();
    }

    hasFilters(): boolean {
        return !!this.search().trim() || !!this.action() || !!this.from() || !!this.to();
    }

    nextPage(): void {
        if (this.pageNumber() * this.pageSize < this.total()) {
            this.pageNumber.update((p) => p + 1);
            this.load(true);
        }
    }

    prevPage(): void {
        if (this.pageNumber() > 1) {
            this.pageNumber.update((p) => p - 1);
            this.load(true);
        }
    }

    totalPages(): number {
        return Math.max(1, Math.ceil(this.total() / this.pageSize));
    }

    actionLabel(a: string): string {
        return ACTION_LABEL[a] ?? a;
    }

    actionIcon(a: string): string {
        return ACTION_ICON[a] ?? 'pi-circle-fill';
    }

    actionTone(a: string): string {
        return ACTION_TONE[a] ?? 'neutral';
    }

    fmtDate(iso: string): string {
        return new Date(iso).toLocaleString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    initials(name?: string | null): string {
        if (!name) return '?';
        const parts = name.replace(/@.*/, '').split(/[.\s_]+/).filter(Boolean);
        return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
    }
}