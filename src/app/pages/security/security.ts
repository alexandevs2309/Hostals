import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, Session } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-security',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './security.html',
    styleUrl: './security.scss'
})
export class SecurityPage implements OnInit {
    private auth = inject(AuthService);

    user = this.auth.getCachedUser();

    // ── 2FA ──
    twoFactorEnabled: WritableSignal<boolean> = signal(!!this.user?.twoFactorEnabled);
    setupLoading = signal(false);
    showSetup = signal(false);
    sharedKey = signal('');
    qrDataUrl = signal('');
    setupCode = '';
    setupMsg = signal('');
    setupError = signal(false);
    recoveryCodes: WritableSignal<string[]> = signal([]);
    recoveryAcked = signal(false);
    busyDisable = signal(false);
    disableCode = '';
    disableMsg = signal('');
    disableError = signal(false);

    // ── 2FA: regenerar códigos de recuperación ────────────────
    showRegen = signal(false);
    regenCode = '';
    regenMsg = signal('');
    regenError = signal(false);
    regenLoading = signal(false);
    regenSuccess = signal(false);

    // ── Sesiones ──
    sessions: WritableSignal<Session[]> = signal([]);
    sessionsLoading = signal(true);
    revokingId = signal<string | null>(null);
    sessionsError = signal<string | null>(null);

    ngOnInit(): void {
        this.loadSessions();
    }

    // ── 2FA: activar ─────────────────────────────────────────────
    startSetup(): void {
        this.setupLoading.set(true);
        this.setupMsg.set('');
        this.setupError.set(false);
        this.auth.getTwoFactorSetup().subscribe({
            next: (setup) => {
                this.sharedKey.set(setup.sharedKey);
                this.qrDataUrl.set('data:image/svg+xml;base64,' + btoa(setup.qrCodeSvg));
                this.showSetup.set(true);
                this.setupLoading.set(false);
            },
            error: () => {
                this.setupLoading.set(false);
                this.setupMsg.set('No se pudo preparar la configuración. Inténtalo de nuevo.');
                this.setupError.set(true);
            }
        });
    }

    confirmSetup(): void {
        const code = this.setupCode.trim().replace(/\s/g, '');
        if (!/^\d{6}$/.test(code)) {
            this.setupMsg.set('Introduce el código de 6 dígitos de tu aplicación de autenticación.');
            this.setupError.set(true);
            return;
        }
        this.setupLoading.set(true);
        this.setupMsg.set('');
        this.auth.verifyTwoFactor(code).subscribe({
            next: (res) => {
                if (!res.succeeded) {
                    this.setupLoading.set(false);
                    this.setupMsg.set('El código no es válido. Comprueba que la hora de tu dispositivo esté sincronizada.');
                    this.setupError.set(true);
                    return;
                }
                this.recoveryCodes.set(res.recoveryCodes ?? []);
                this.twoFactorEnabled.set(true);
                this.setupLoading.set(false);
                this.syncUser(true);
            },
            error: () => {
                this.setupLoading.set(false);
                this.setupMsg.set('El código no es válido.');
                this.setupError.set(true);
            }
        });
    }

    ackRecovery(): void {
        this.recoveryAcked.set(true);
    }

    openRegen(): void {
        this.showRegen.set(true);
        this.regenCode = '';
        this.regenMsg.set('');
        this.regenError.set(false);
        this.regenSuccess.set(false);
    }

    regenerate(): void {
        const code = this.regenCode.trim().replace(/\s/g, '');
        if (!/^\d{6}$/.test(code)) {
            this.regenMsg.set('Introduce el código de 6 dígitos de tu aplicación de autenticación.');
            this.regenError.set(true);
            return;
        }
        this.regenLoading.set(true);
        this.regenMsg.set('');
        this.regenError.set(false);
        this.auth.regenerateRecoveryCodes(code).subscribe({
            next: (res) => {
                this.regenLoading.set(false);
                if (!res.succeeded) {
                    this.regenMsg.set('El código no es válido. No se regeneraron los códigos.');
                    this.regenError.set(true);
                    return;
                }
                this.recoveryCodes.set(res.recoveryCodes ?? []);
                this.recoveryAcked.set(false);
                this.regenSuccess.set(true);
                this.showRegen.set(false);
                this.regenCode = '';
            },
            error: () => {
                this.regenLoading.set(false);
                this.regenMsg.set('El código no es válido. No se regeneraron los códigos.');
                this.regenError.set(true);
            }
        });
    }

    async copyKey(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.sharedKey());
            this.setupMsg.set('Clave copiada.');
            this.setupError.set(false);
        } catch {
            this.setupMsg.set('No se pudo copiar; anótala manualmente.');
            this.setupError.set(true);
        }
    }

    private syncUser(twoFactorEnabled: boolean): void {
        const cached = this.auth.getCachedUser();
        if (!cached) return;
        this.auth.updateCachedUser({ ...cached, twoFactorEnabled });
        this.user = this.auth.getCachedUser();
    }

    // ── 2FA: desactivar ──────────────────────────────────────────
    disable(): void {
        const code = this.disableCode.trim().replace(/\s/g, '');
        if (!/^\d{6}$/.test(code)) {
            this.disableMsg.set('Introduce el código de 6 dígitos actual para confirmar.');
            this.disableError.set(true);
            return;
        }
        this.busyDisable.set(true);
        this.disableMsg.set('');
        this.auth.disableTwoFactor(code).subscribe({
            next: () => {
                this.busyDisable.set(false);
                this.disableMsg.set('Verificación en dos pasos desactivada.');
                this.disableError.set(false);
                this.twoFactorEnabled.set(false);
                this.showSetup.set(false);
                this.recoveryCodes.set([]);
                this.disableCode = '';
                this.syncUser(false);
            },
            error: () => {
                this.busyDisable.set(false);
                this.disableMsg.set('El código no es válido. La verificación en dos pasos sigue activa.');
                this.disableError.set(true);
            }
        });
    }

    // ── Sesiones ─────────────────────────────────────────────────
    loadSessions(): void {
        this.sessionsLoading.set(true);
        this.sessionsError.set(null);
        this.auth.getSessions().subscribe({
            next: (list) => {
                this.sessions.set(list);
                this.sessionsLoading.set(false);
            },
            error: () => {
                this.sessionsLoading.set(false);
                this.sessionsError.set('No se pudieron cargar tus sesiones activas.');
            }
        });
    }

    revoke(sessionId: string): void {
        this.revokingId.set(sessionId);
        this.auth.revokeSession(sessionId).subscribe({
            next: () => {
                this.revokingId.set(null);
                this.sessions.set(this.sessions().filter((s) => s.id !== sessionId));
            },
            error: () => {
                this.revokingId.set(null);
                this.sessionsError.set('No se pudo revocar esa sesión.');
            }
        });
    }

    fmtDate(iso: string): string {
        return new Date(iso).toLocaleString('es-ES', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
}