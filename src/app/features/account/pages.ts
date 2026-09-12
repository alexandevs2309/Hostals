import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GosAuthCard } from '@/app/shared/components/auth-card';
import { OnboardingStep1Data, OnboardingStep2Data } from '@/app/shared/services/onboarding.service';
import { AuthService } from '@/app/core/services/auth.service';
import { HotelService } from '@/app/core/services/hotel.service';

// ─── Validators ──────────────────────────────────────────────────────────────
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pw  = group.get('password')?.value  ?? '';
    const cpw = group.get('confirmPassword')?.value ?? '';
    return pw && cpw && pw !== cpw ? { passwordsMismatch: true } : null;
}

function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value ?? '';
    if (!value) return null;
    const errors: ValidationErrors = {};
    if (value.length < 8) errors['passwordTooShort'] = true;
    if (!/[A-ZÀ-Ý]/.test(value)) errors['passwordRequiresUpper'] = true;
    if (!/[a-zà-ý]/.test(value)) errors['passwordRequiresLower'] = true;
    if (!/[0-9]/.test(value)) errors['passwordRequiresDigit'] = true;
    if (!/[^A-Za-z0-9]/.test(value)) errors['passwordRequiresNonAlphanumeric'] = true;
    return Object.keys(errors).length ? errors : null;
}

function atLeastOneModuleValidator(control: AbstractControl): ValidationErrors | null {
    return ((control.value ?? []) as string[]).length === 0 ? { noModuleSelected: true } : null;
}

// ─── Datos estáticos ─────────────────────────────────────────────────────────
const REGISTER_MODULES = [
    { id: 'PMS',           label: 'PMS',          icon: 'pi pi-server'    },
    { id: 'Reservas',      label: 'Reservas',     icon: 'pi pi-calendar'  },
    { id: 'Habitaciones',  label: 'Habitaciones', icon: 'pi pi-home'      },
    { id: 'Housekeeping',  label: 'Housekeeping', icon: 'pi pi-sparkles'  },
    { id: 'Mantenimiento', label: 'Mantenimiento',icon: 'pi pi-wrench'    },
    { id: 'Finanzas',      label: 'Finanzas',     icon: 'pi pi-dollar'    },
    { id: 'Analytics',     label: 'Analytics',    icon: 'pi pi-chart-bar' },
];

// ════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-login',
    standalone: true,
    imports: [RouterModule, FormsModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-lock"
            eyebrow="Bienvenido de nuevo"
            title="Inicia sesión en Hospitality OS"
            subtitle="Accede a la plataforma de tu hospitalidad."
        >
            <form (ngSubmit)="submit()">
                <div class="gos-field">
                    <label for="login-email">Email</label>
                    <input id="login-email" type="email" name="email" class="gos-input" placeholder="tu@hotel.com" [(ngModel)]="email" />
                </div>
                <div class="gos-field">
                    <label for="login-pass">Contraseña</label>
                    <input id="login-pass" type="password" name="password" class="gos-input" placeholder="••••••••" [(ngModel)]="password" />
                    <div style="text-align: right; margin-top: 6px">
                        <a class="gos-link" routerLink="/account/forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>
                </div>
                @if (errorMessage) {
                    <div class="gos-error"><i class="pi pi-exclamation-circle"></i> {{ errorMessage }}</div>
                }
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block" [disabled]="loading">
                    @if (loading) { <span class="gos-spinner"></span> } Entrando <i class="pi pi-arrow-right"></i>
                </button>
            </form>
            <div class="auth-sep">o continúa con</div>
            <div class="auth-grid-2">
                <button type="button" class="gos-btn gos-btn--ghost gos-btn--block"><i class="pi pi-google"></i> Google</button>
                <button type="button" class="gos-btn gos-btn--ghost gos-btn--block"><i class="pi pi-apple"></i> Apple</button>
            </div>
            <p class="auth-foot">
                ¿Aún no tienes cuenta? <a class="gos-link" routerLink="/account/register">Crea una gratis</a>
            </p>
        </gos-auth-card>
    `
})
export class LoginPage {
    email = '';
    password = '';
    errorMessage = '';
    loading = false;

    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    submit(): void {
        if (!this.email || !this.password) {
            this.errorMessage = 'Introduce tu email y contraseña.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.auth.login({ email: this.email, password: this.password, rememberMe: false }).subscribe({
            next: (res) => {
                if (res.requiresTwoFactor && res.twoFactorToken) {
                    this.auth.setPendingTwoFactor(res.twoFactorToken);
                    this.router.navigate(['/account/two-factor']);
                    return;
                }
                const dest = res.user?.mustChangePassword ? ['/account/change-password'] : ['/app'];
                this.router.navigate(dest);
            },
            error: (err: { error?: string | { message?: string } }) => {
                this.loading = false;
                if (typeof err.error === 'string' && err.error) {
                    this.errorMessage = err.error;
                } else {
                    this.errorMessage = (err.error as { message?: string })?.message ?? 'Credenciales inválidas o usuario inactivo.';
                }
                this.cdr.detectChanges();
            }
        });
    }
}

// ════════════════════════════════════════════════════════════════════════════
// TWO-FACTOR PAGE — segundo paso del login (código TOTP o de recuperación)
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-two-factor',
    standalone: true,
    imports: [RouterModule, FormsModule, CommonModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-shield"
            eyebrow="Verificación en dos pasos"
            title="Es el último paso"
            subtitle="Introduce el código de 6 dígitos de tu aplicación de autenticación o uno de tus códigos de recuperación."
        >
            @if (errorMessage) {
                <div class="gos-error" style="margin-bottom: 12px"><i class="pi pi-exclamation-circle"></i> {{ errorMessage }}</div>
            }
            <form (ngSubmit)="submit()">
                <div class="gos-field">
                    <label for="tfa-code">Código de verificación</label>
                    <input id="tfa-code" type="text" class="gos-input" placeholder="000000"
                        [(ngModel)]="code" name="code" autocomplete="one-time-code" maxlength="12"
                        style="font-size: 1.4rem; letter-spacing: .35em; text-align: center; text-transform: uppercase;" />
                </div>
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block" [disabled]="loading">
                    @if (loading) { <span class="gos-spinner"></span> } Verificar e iniciar sesión <i class="pi pi-arrow-right"></i>
                </button>
            </form>
            <p class="auth-foot">
                <a class="gos-link" routerLink="/account/login">Volver al inicio de sesión</a>
            </p>
        </gos-auth-card>
    `
})
export class TwoFactorPage {
    code = '';
    errorMessage = '';
    loading = false;

    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    submit(): void {
        const token = this.auth.getPendingTwoFactor();
        if (!token) {
            this.errorMessage = 'Tu inicio de sesión ha expirado. Vuelve a introducir tu contraseña.';
            this.router.navigate(['/account/login']);
            return;
        }
        if (!this.code.trim()) {
            this.errorMessage = 'Introduce el código de verificación.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.auth.loginWithTwoFactor(token, this.code.trim()).subscribe({
            next: (res) => {
                this.auth.clearPendingTwoFactor();
                const dest = res.user?.mustChangePassword ? ['/account/change-password'] : ['/app'];
                this.router.navigate(dest);
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'El código introducido no es válido o ha expirado.';
                this.cdr.detectChanges();
            }
        });
    }
}

// ════════════════════════════════════════════════════════════════════════════
// REGISTER PAGE — Flujo de 2 pasos
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-register',
    standalone: true,
    imports: [RouterModule, CommonModule, ReactiveFormsModule],
    template: `
<!-- ═══════════════════════════════════════════════════════════
     ESTADO DE ÉXITO
══════════════════════════════════════════════════════════════ -->
@if (completed) {
<div class="reg-success">
    <div class="reg-success__orb reg-success__orb--1"></div>
    <div class="reg-success__orb reg-success__orb--2"></div>
    <div class="reg-success__inner">
        <div class="reg-success__icon">
            <i class="pi pi-check-circle"></i>
        </div>
        <span class="reg-eyebrow"><i class="pi pi-building"></i> Hospitality OS</span>
        <h2 class="reg-success__title">¡Tu espacio de trabajo<br><span class="reg-grad">está listo!</span></h2>
        <p class="reg-success__body">
            Hospitality OS está preparando tu entorno personalizado.<br>
            En unos segundos tendrás todo listo para operar.
        </p>
        <div class="reg-success__pills">
            @for (mod of savedModules; track mod) {
                <span class="reg-pill"><i class="pi pi-check"></i> {{ mod }}</span>
            }
        </div>
        <a class="reg-btn reg-btn--primary" routerLink="/app">
            Entrar a Hospitality OS <i class="pi pi-arrow-right"></i>
        </a>
    </div>
</div>

} @else {

<!-- ═══════════════════════════════════════════════════════════
     REGISTRO PRINCIPAL
══════════════════════════════════════════════════════════════ -->
<div class="reg-wrap">

    <!-- Orbs decorativos -->
    <div class="reg-orb reg-orb--1" aria-hidden="true"></div>
    <div class="reg-orb reg-orb--2" aria-hidden="true"></div>

    <!-- Cabecera de marca -->
    <div class="reg-brand-head">
        <div class="reg-brand-head__icon"><i class="pi pi-building"></i></div>
        <h1 class="reg-brand-head__title">
            @if (step === 1) {
                Crea tu <span class="reg-grad">cuenta</span>
            } @else {
                Configura tu <span class="reg-grad">propiedad</span>
            }
        </h1>
        <p class="reg-brand-head__sub">
            @if (step === 1) {
                Comienza tu prueba gratuita · <strong>14 días</strong> sin tarjeta de crédito
            } @else {
                Cuéntanos sobre tu operación para preparar tu entorno
            }
        </p>
    </div>

    <!-- Stepper -->
    <div class="reg-stepper" role="navigation" aria-label="Progreso del registro">
        <div class="reg-stepper__item"
             [class.is-active]="step === 1"
             [class.is-done]="step === 2">
            <div class="reg-stepper__bubble">
                @if (step === 2) { <i class="pi pi-check"></i> } @else { <span>1</span> }
            </div>
            <div class="reg-stepper__meta">
                <span class="reg-stepper__num">Paso 01</span>
                <span class="reg-stepper__label">Crear cuenta</span>
            </div>
        </div>
        <div class="reg-stepper__track">
            <div class="reg-stepper__fill" [style.width]="step === 2 ? '100%' : '0%'"></div>
        </div>
        <div class="reg-stepper__item"
             [class.is-active]="step === 2">
            <div class="reg-stepper__bubble">
                <span>2</span>
            </div>
            <div class="reg-stepper__meta">
                <span class="reg-stepper__num">Paso 02</span>
                <span class="reg-stepper__label">Tu propiedad</span>
            </div>
        </div>
    </div>

    <!-- ────────────────────────────────────────────────────
         PASO 1 — CREAR CUENTA
    ──────────────────────────────────────────────────────── -->
    @if (step === 1) {
    <form [formGroup]="form1" (ngSubmit)="onStep1Submit()" novalidate class="reg-form reg-anim">

        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-fn">Nombre <span class="reg-req">*</span></label>
                <input id="r-fn" type="text" class="reg-input"
                       [class.reg-input--err]="inv(form1,'firstName')"
                       formControlName="firstName"
                       placeholder="Juan"
                       autocomplete="given-name" />
                @if (inv(form1,'firstName')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> El nombre es obligatorio</p>
                }
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-ln">Apellidos <span class="reg-req">*</span></label>
                <input id="r-ln" type="text" class="reg-input"
                       [class.reg-input--err]="inv(form1,'lastName')"
                       formControlName="lastName"
                       placeholder="García Pérez"
                       autocomplete="family-name" />
                @if (inv(form1,'lastName')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Los apellidos son obligatorios</p>
                }
            </div>
        </div>

        <div class="reg-field">
            <label class="reg-label" for="r-email">Email profesional <span class="reg-req">*</span></label>
            <div class="reg-input-icon">
                <i class="pi pi-envelope reg-input-icon__i"></i>
                <input id="r-email" type="email" class="reg-input reg-input--pl"
                       [class.reg-input--err]="inv(form1,'email')"
                       formControlName="email"
                       placeholder="juan.perez@hotel.com"
                       autocomplete="email"
                       (blur)="onEmailBlur()" />
            </div>
            @if (inv(form1,'email')) {
                <p class="reg-err">
                    <i class="pi pi-exclamation-circle"></i>
                    @if (form1.get('email')?.errors?.['required']) { El email es obligatorio }
                    @else { Introduce un email válido }
                </p>
            } @else if ((emailBlurred || s1) && emailTaken) {
                <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Ese email ya está registrado</p>
            } @else if (emailChecking) {
                <p class="reg-err reg-err--muted"><i class="pi pi-spin pi-spinner"></i> Verificando disponibilidad…</p>
            }
        </div>

        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-pw">Contraseña <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-lock reg-input-icon__i"></i>
                    <input id="r-pw" [type]="showPw?'text':'password'" class="reg-input reg-input--pl reg-input--pr"
                           [class.reg-input--err]="inv(form1,'password')"
                           formControlName="password"
                           placeholder="Mín. 8 caracteres"
                           autocomplete="new-password" />
                    <button type="button" class="reg-eye" (click)="showPw=!showPw" [attr.aria-label]="showPw?'Ocultar':'Mostrar'">
                        <i [class]="showPw?'pi pi-eye-slash':'pi pi-eye'"></i>
                    </button>
                </div>
                @if (inv(form1,'password')) {
                    <p class="reg-err">
                        <i class="pi pi-exclamation-circle"></i>
                        @let pw = form1.get('password')?.errors;
                        @if (pw?.['required']) { La contraseña es obligatoria }
                        @else if (pw?.['passwordTooShort']) { Debe tener al menos 8 caracteres }
                        @else if (pw?.['passwordRequiresUpper']) { Debe incluir una letra mayúscula (A-Z) }
                        @else if (pw?.['passwordRequiresLower']) { Debe incluir una letra minúscula (a-z) }
                        @else if (pw?.['passwordRequiresDigit']) { Debe incluir un número (0-9) }
                        @else if (pw?.['passwordRequiresNonAlphanumeric']) { Debe incluir un símbolo (por ej. !@#$%) }
                    </p>
                }
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-cpw">Confirmar contraseña <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-lock reg-input-icon__i"></i>
                    <input id="r-cpw" [type]="showCpw?'text':'password'" class="reg-input reg-input--pl reg-input--pr"
                           [class.reg-input--err]="inv(form1,'confirmPassword')||(s1&&!!form1.errors?.['passwordsMismatch'])"
                           formControlName="confirmPassword"
                           placeholder="Repite la contraseña"
                           autocomplete="new-password" />
                    <button type="button" class="reg-eye" (click)="showCpw=!showCpw" [attr.aria-label]="showCpw?'Ocultar':'Mostrar'">
                        <i [class]="showCpw?'pi pi-eye-slash':'pi pi-eye'"></i>
                    </button>
                </div>
                @if (inv(form1,'confirmPassword')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Confirma la contraseña</p>
                } @else if (s1 && form1.errors?.['passwordsMismatch']) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Las contraseñas no coinciden</p>
                }
            </div>
        </div>

        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-phone">Teléfono (opcional)</label>
                <div class="reg-input-icon">
                    <i class="pi pi-phone reg-input-icon__i"></i>
                    <input id="r-phone" type="tel" class="reg-input reg-input--pl"
                           [class.reg-input--err]="inv(form1,'phoneNumber')"
                           formControlName="phoneNumber"
                           placeholder="+52 99 8888 7777"
                           autocomplete="tel" />
                </div>
                @if (inv(form1,'phoneNumber')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Máximo 30 caracteres</p>
                }
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-lang">Idioma <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-globe reg-input-icon__i"></i>
                    <select id="r-lang" class="reg-input reg-select reg-input--pl" formControlName="language">
                        <option value="es">Español</option>
                        <option value="en">English</option>
                        <option value="pt">Português</option>
                        <option value="fr">Français</option>
                    </select>
                </div>
            </div>
        </div>

        <label class="reg-terms">
            <input type="checkbox" formControlName="terms" class="reg-check" />
            <span>
                Acepto los <a class="reg-link" routerLink="/legal/terminos">términos de servicio</a>
                y la <a class="reg-link" routerLink="/legal/privacidad">política de privacidad</a>
            </span>
        </label>
        @if (s1 && form1.get('terms')?.errors?.['required']) {
            <p class="reg-err" style="margin-top:-8px"><i class="pi pi-exclamation-circle"></i> Debes aceptar los términos</p>
        }

        <button type="submit" class="reg-btn reg-btn--primary reg-btn--block">
            Continuar <i class="pi pi-arrow-right"></i>
        </button>

        <p class="reg-foot">
            ¿Ya tienes cuenta? <a class="reg-link" routerLink="/account/login">Inicia sesión</a>
        </p>
    </form>
    }

    <!-- ────────────────────────────────────────────────────
         PASO 2 — CONFIGURAR PROPIEDAD
    ──────────────────────────────────────────────────────── -->
    @if (step === 2) {
    <form [formGroup]="form2" (ngSubmit)="onStep2Submit()" novalidate class="reg-form reg-anim">

        <!-- Nombre + Tipo -->
        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-pname">Nombre de la propiedad <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-building reg-input-icon__i"></i>
                    <input id="r-pname" type="text" class="reg-input reg-input--pl"
                           [class.reg-input--err]="inv(form2,'propertyName')"
                           formControlName="propertyName"
                           placeholder="Hotel Aurora" />
                </div>
                @if (inv(form2,'propertyName')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Obligatorio</p>
                }
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-ptype">Tipo de propiedad <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-tag reg-input-icon__i"></i>
                    <select id="r-ptype" class="reg-input reg-select reg-input--pl"
                            [class.reg-input--err]="inv(form2,'propertyType')"
                            formControlName="propertyType">
                        <option value="" disabled>Selecciona un tipo</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Resort">Resort</option>
                        <option value="Villa">Villa</option>
                        <option value="Apartahotel">Apartahotel</option>
                        <option value="Hostal">Hostal</option>
                        <option value="Bed & Breakfast">Bed &amp; Breakfast</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>
                @if (inv(form2,'propertyType')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Selecciona el tipo</p>
                }
            </div>
        </div>

        <!-- Habitaciones + Categoría (estrellas) -->
        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-rooms">Número de habitaciones <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-home reg-input-icon__i"></i>
                    <input id="r-rooms" type="number" class="reg-input reg-input--pl"
                           [class.reg-input--err]="inv(form2,'roomCount')"
                           formControlName="roomCount"
                           placeholder="50"
                           min="1" />
                </div>
                @if (inv(form2,'roomCount')) {
                    <p class="reg-err">
                        <i class="pi pi-exclamation-circle"></i>
                        @if (form2.get('roomCount')?.errors?.['required']) { Obligatorio }
                        @else { Debe ser mayor que 0 }
                    </p>
                }
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-cat">Categoría</label>
                <div class="reg-input-icon">
                    <i class="pi pi-star reg-input-icon__i"></i>
                    <select id="r-cat" class="reg-input reg-select reg-input--pl" formControlName="category">
                        <option value="">Sin categoría</option>
                        <option value="1">1 estrella</option>
                        <option value="2">2 estrellas</option>
                        <option value="3">3 estrellas</option>
                        <option value="4">4 estrellas</option>
                        <option value="5">5 estrellas</option>
                        <option value="boutique">Boutique</option>
                        <option value="apart">Apart-hotel</option>
                    </select>
                </div>
            </div>
        </div>

        <!-- País + Ciudad -->
        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-country">País <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-globe reg-input-icon__i"></i>
                    <input id="r-country" type="text" class="reg-input reg-input--pl"
                           [class.reg-input--err]="inv(form2,'country')"
                           formControlName="country"
                           placeholder="México" />
                </div>
                @if (inv(form2,'country')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Obligatorio</p>
                }
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-city">Ciudad <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-map-marker reg-input-icon__i"></i>
                    <input id="r-city" type="text" class="reg-input reg-input--pl"
                           [class.reg-input--err]="inv(form2,'city')"
                           formControlName="city"
                           placeholder="Cancún" />
                </div>
                @if (inv(form2,'city')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Obligatorio</p>
                }
            </div>
        </div>

        <!-- Dirección -->
        <div class="reg-field">
            <label class="reg-label" for="r-address">Dirección <span class="reg-req">*</span></label>
            <div class="reg-input-icon">
                <i class="pi pi-map reg-input-icon__i"></i>
                <input id="r-address" type="text" class="reg-input reg-input--pl"
                       [class.reg-input--err]="inv(form2,'address')"
                       formControlName="address"
                       placeholder="Av. Bonampak Mz 1, Lote 3" />
            </div>
            @if (inv(form2,'address')) {
                <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Obligatorio</p>
            }
        </div>

        <!-- Razón social + Código postal -->
        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-bname">Razón social (opcional)</label>
                <div class="reg-input-icon">
                    <i class="pi pi-briefcase reg-input-icon__i"></i>
                    <input id="r-bname" type="text" class="reg-input reg-input--pl"
                           formControlName="businessName"
                           placeholder="Hotel Aurora, S.A. de C.V." />
                </div>
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-cp">Código postal (opcional)</label>
                <div class="reg-input-icon">
                    <i class="pi pi-hashtag reg-input-icon__i"></i>
                    <input id="r-cp" type="text" class="reg-input reg-input--pl"
                           [class.reg-input--err]="inv(form2,'postalCode')"
                           formControlName="postalCode"
                           placeholder="77500" />
                </div>
                @if (inv(form2,'postalCode')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Máximo 20 caracteres</p>
                }
            </div>
        </div>

        <!-- Año de apertura + Email de contacto del hotel -->
        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-year">Año de apertura (opcional)</label>
                <div class="reg-input-icon">
                    <i class="pi pi-calendar reg-input-icon__i"></i>
                    <input id="r-year" type="number" class="reg-input reg-input--pl"
                           formControlName="yearOpened"
                           placeholder="2019" min="1900" [max]="currentYear" />
            </div>
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-hemail">Email del hotel (opcional)</label>
                <div class="reg-input-icon">
                    <i class="pi pi-envelope reg-input-icon__i"></i>
                    <input id="r-hemail" type="email" class="reg-input reg-input--pl"
                           [class.reg-input--err]="inv(form2,'contactEmail')"
                           formControlName="contactEmail"
                           placeholder="reservas@hotelaurora.com" />
                </div>
                @if (inv(form2,'contactEmail')) {
                    <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Email no válido</p>
                }
            </div>
        </div>

        <!-- Teléfono del hotel + Sitio web -->
        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-hphone">Teléfono del hotel (opcional)</label>
                <div class="reg-input-icon">
                    <i class="pi pi-phone reg-input-icon__i"></i>
                    <input id="r-hphone" type="tel" class="reg-input reg-input--pl"
                           formControlName="hotelPhone"
                           placeholder="+52 998 888 2222" />
                </div>
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-web">Sitio web (opcional)</label>
                <div class="reg-input-icon">
                    <i class="pi pi-globe reg-input-icon__i"></i>
                    <input id="r-web" type="url" class="reg-input reg-input--pl"
                           formControlName="website"
                           placeholder="https://www.hotelaurora.com" />
                </div>
            </div>
        </div>

        <!-- Zona horaria + Moneda -->
        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-tz">Zona horaria <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-clock reg-input-icon__i"></i>
                    <select id="r-tz" class="reg-input reg-select reg-input--pl" formControlName="timeZone">
                        @for (tz of TIME_ZONES; track tz) {
                            <option [value]="tz">{{ tz }}</option>
                        }
                    </select>
                </div>
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-cur">Moneda <span class="reg-req">*</span></label>
                <div class="reg-input-icon">
                    <i class="pi pi-dollar reg-input-icon__i"></i>
                    <select id="r-cur" class="reg-input reg-select reg-input--pl" formControlName="currency">
                        @for (cur of CURRENCIES; track cur) {
                            <option [value]="cur">{{ cur }}</option>
                        }
                    </select>
                </div>
            </div>
        </div>

        <!-- Impuestos + Idiomas del hotel -->
        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-tax">Impuesto por defecto (opcional)</label>
                <div class="reg-input-icon">
                    <i class="pi pi-percentage reg-input-icon__i"></i>
                    <input id="r-tax" type="number" class="reg-input reg-input--pl"
                           formControlName="taxRate"
                           placeholder="16" min="0" max="100" step="0.01" />
                </div>
                <p class="reg-hint">% aplicado a las tarifas (ej. IVA 16%)</p>
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-hlangs">Idiomas del hotel (opcional)</label>
                <div class="reg-input-icon">
                    <i class="pi pi-comments reg-input-icon__i"></i>
                    <input id="r-hlangs" type="text" class="reg-input reg-input--pl"
                           formControlName="hotelLanguages"
                           placeholder="es, en, pt" />
                </div>
                <p class="reg-hint">Sepáralos con comas</p>
            </div>
        </div>

        <!-- Horarios check-in / check-out -->
        <div class="reg-row2">
            <div class="reg-field">
                <label class="reg-label" for="r-checkin">Check-in <span class="reg-req">*</span></label>
                <input id="r-checkin" type="time" class="reg-input"
                       formControlName="checkInTime" />
            </div>
            <div class="reg-field">
                <label class="reg-label" for="r-checkout">Check-out <span class="reg-req">*</span></label>
                <input id="r-checkout" type="time" class="reg-input"
                       formControlName="checkOutTime" />
            </div>
        </div>

        <!-- Rol -->
        <div class="reg-field">
            <label class="reg-label" for="r-role">Tu rol en la operación <span class="reg-req">*</span></label>
            <div class="reg-input-icon">
                <i class="pi pi-id-card reg-input-icon__i"></i>
                <select id="r-role" class="reg-input reg-select reg-input--pl"
                        [class.reg-input--err]="inv(form2,'role')"
                        formControlName="role">
                    <option value="" disabled>Selecciona tu rol</option>
                    <option value="Propietario">Propietario</option>
                    <option value="Director General">Director / Gerente general</option>
                    <option value="Operaciones">Gerente de Operaciones</option>
                    <option value="Recepción">Jefe de Recepción</option>
                    <option value="Finanzas">Gerente de Finanzas</option>
                    <option value="Housekeeping">Jefe de Housekeeping</option>
                    <option value="Mantenimiento">Jefe de Mantenimiento</option>
                    <option value="IT">IT / Tecnología</option>
                    <option value="Otro">Otro</option>
                </select>
            </div>
            @if (inv(form2,'role')) {
                <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Selecciona tu rol</p>
            }
        </div>

        <!-- Módulos -->
        <div class="reg-field">
            <label class="reg-label">
                Módulos que necesitas <span class="reg-req">*</span>
                <span class="reg-label__hint"> — Selecciona uno o más</span>
            </label>
            <div class="reg-modules">
                @for (mod of modules; track mod.id) {
                    <button type="button" class="reg-module"
                            [class.is-on]="hasModule(mod.id)"
                            (click)="toggleModule(mod.id)"
                            [attr.aria-pressed]="hasModule(mod.id)">
                        <i [class]="mod.icon"></i>
                        <span>{{ mod.label }}</span>
                        @if (hasModule(mod.id)) {
                            <span class="reg-module__check"><i class="pi pi-check"></i></span>
                        }
                    </button>
                }
            </div>
            @if (s2 && form2.get('modules')?.errors?.['noModuleSelected']) {
                <p class="reg-err"><i class="pi pi-exclamation-circle"></i> Selecciona al menos un módulo</p>
            }
        </div>

        <!-- Acciones paso 2 -->
        @if (errorMessage) {
            <p class="reg-err"><i class="pi pi-exclamation-circle"></i> {{ errorMessage }}</p>
        }
        <div class="reg-actions2">
            <button type="button" class="reg-btn reg-btn--ghost" (click)="goBack()" [disabled]="submitting">
                <i class="pi pi-arrow-left"></i> Volver
            </button>
            <button type="submit" class="reg-btn reg-btn--primary" [disabled]="submitting">
                @if (submitting) { <span class="gos-spinner"></span> } {{ submitting ? 'Creando cuenta…' : 'Finalizar configuración' }} <i class="pi pi-arrow-right"></i>
            </button>
        </div>

    </form>
    }

    <!-- Nota de seguridad -->
    <div class="reg-secure">
        <i class="pi pi-shield"></i>
        <span>Conexión segura · Datos encriptados · Sin tarjeta de crédito</span>
    </div>

</div><!-- /reg-wrap -->
}<!-- /else completed -->
    `,
    styles: [`
        /* ══════════════════════════════════════════════════════════
           HOST
        ══════════════════════════════════════════════════════════ */
        :host {
            display: block;
            width: 100%;
        }

        /* ══════════════════════════════════════════════════════════
           WRAPPER PRINCIPAL
        ══════════════════════════════════════════════════════════ */
        .reg-wrap {
            position: relative;
            width: min(640px, 100%);
            margin-inline: auto;
            padding: 2.5rem 2.5rem 2rem;
            background: var(--hos-surface);
            border: 1px solid var(--hos-border);
            border-radius: 24px;
            box-shadow:
                0 4px 6px -1px rgba(0,0,0,.04),
                0 20px 50px -12px rgba(0,0,0,.1),
                0 0 0 1px rgba(255,255,255,.02);
            overflow: hidden;
        }

        /* ── Orbs decorativos ─────────────────────────────────── */
        .reg-orb {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
        }
        .reg-orb--1 {
            width: 320px; height: 320px;
            top: -120px; right: -100px;
            background: radial-gradient(circle, rgba(20,184,166,.14), transparent 65%);
            filter: blur(40px);
        }
        .reg-orb--2 {
            width: 260px; height: 260px;
            bottom: -100px; left: -80px;
            background: radial-gradient(circle, rgba(99,102,241,.1), transparent 65%);
            filter: blur(40px);
        }

        /* Todo el contenido sobre los orbs */
        .reg-brand-head, .reg-stepper, .reg-form, .reg-secure { position: relative; z-index: 1; }

        /* ══════════════════════════════════════════════════════════
           CABECERA DE MARCA
        ══════════════════════════════════════════════════════════ */
        .reg-brand-head {
            text-align: center;
            margin-bottom: 2rem;
        }
        .reg-brand-head__icon {
            width: 56px; height: 56px;
            border-radius: 16px;
            background: var(--hos-grad);
            color: #fff;
            display: grid; place-items: center;
            font-size: 1.35rem;
            margin: 0 auto 1.25rem;
            box-shadow: 0 8px 24px rgba(20,184,166,.35);
        }
        .app-dark .reg-brand-head__icon { color: #042f2e; }
        .reg-brand-head__title {
            font-family: var(--hos-font-display);
            font-size: clamp(1.6rem, 3vw, 2rem);
            font-weight: 800;
            letter-spacing: -0.03em;
            line-height: 1.1;
            margin: 0 0 .625rem;
            color: var(--hos-text);
        }
        .reg-brand-head__sub {
            margin: 0;
            color: var(--hos-text-muted);
            font-size: .9375rem;
            line-height: 1.6;
        }
        .reg-brand-head__sub strong { color: var(--hos-primary); font-weight: 600; }

        /* ── Degradado de texto ──────────────────────────────── */
        .reg-grad {
            background: var(--hos-grad);
            -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent; color: transparent;
        }

        /* ══════════════════════════════════════════════════════════
           STEPPER
        ══════════════════════════════════════════════════════════ */
        .reg-stepper {
            display: flex;
            align-items: center;
            gap: 0;
            margin-bottom: 2rem;
            padding: 1rem 1.25rem;
            background: var(--hos-bg-soft);
            border: 1px solid var(--hos-border);
            border-radius: 14px;
        }
        .reg-stepper__item {
            display: flex; align-items: center; gap: .625rem; flex: 0 0 auto;
        }
        .reg-stepper__bubble {
            width: 36px; height: 36px;
            border-radius: 50%;
            display: grid; place-items: center;
            font-size: .8125rem; font-weight: 700;
            border: 2px solid var(--hos-border);
            color: var(--hos-text-muted);
            background: var(--hos-surface);
            transition: all .25s;
            flex-shrink: 0;
        }
        .reg-stepper__item.is-active .reg-stepper__bubble {
            background: var(--hos-grad);
            border-color: transparent; color: #fff;
            box-shadow: 0 4px 14px rgba(20,184,166,.35);
        }
        .app-dark .reg-stepper__item.is-active .reg-stepper__bubble { color: #042f2e; }
        .reg-stepper__item.is-done .reg-stepper__bubble {
            background: var(--hos-primary-soft);
            border-color: var(--hos-primary); color: var(--hos-primary);
        }
        .reg-stepper__meta {
            display: flex; flex-direction: column; gap: 1px;
        }
        .reg-stepper__num {
            font-size: .7rem; font-weight: 700;
            letter-spacing: .1em; text-transform: uppercase;
            color: var(--hos-text-muted);
        }
        .reg-stepper__item.is-active .reg-stepper__num { color: var(--hos-primary); }
        .reg-stepper__label {
            font-size: .8125rem; font-weight: 600;
            color: var(--hos-text-muted); white-space: nowrap;
        }
        .reg-stepper__item.is-active .reg-stepper__label,
        .reg-stepper__item.is-done .reg-stepper__label { color: var(--hos-text); }
        .reg-stepper__track {
            flex: 1; height: 3px;
            background: var(--hos-border);
            border-radius: 9px;
            margin: 0 .875rem;
            overflow: hidden;
        }
        .reg-stepper__fill {
            height: 100%; background: var(--hos-grad);
            border-radius: 9px;
            transition: width .4s cubic-bezier(.22,1,.36,1);
        }

        /* ══════════════════════════════════════════════════════════
           FORMULARIO
        ══════════════════════════════════════════════════════════ */
        .reg-form {
            display: flex; flex-direction: column; gap: 1.125rem;
        }
        .reg-anim {
            animation: regUp .22s ease both;
        }
        @keyframes regUp {
            from { opacity:0; transform:translateY(8px); }
            to   { opacity:1; transform:none; }
        }

        .reg-row2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }

        /* ── Campo ──────────────────────────────────────────── */
        .reg-field {
            display: flex; flex-direction: column; gap: .375rem;
        }
        .reg-label {
            font-size: .8125rem; font-weight: 600; color: var(--hos-text);
        }
        .reg-label__hint {
            font-weight: 400; color: var(--hos-text-muted); font-size: .75rem;
        }
        .reg-req { color: #ef4444; }
        .reg-hint {
            margin-top: .25rem; font-size: .72rem; color: var(--hos-text-muted);
        }

        /* ── Input base ────────────────────────────────────── */
        .reg-input {
            width: 100%;
            padding: .8125rem 1rem;
            font-size: .9375rem;
            border: 1.5px solid var(--hos-border);
            border-radius: 12px;
            background: var(--hos-bg);
            color: var(--hos-text);
            font-family: inherit;
            transition: border-color .15s, box-shadow .15s;
            box-sizing: border-box;
            outline: none;
        }
        .reg-input:focus {
            border-color: var(--hos-primary);
            box-shadow: 0 0 0 3px rgba(20, 184, 166,.13);
        }
        .reg-input::placeholder { color: var(--hos-text-muted); opacity: .7; }
        .reg-input--err {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239,68,68,.1) !important;
        }
        .reg-select { cursor: pointer; appearance: auto; }
        .reg-input--pl { padding-left: 2.625rem; }
        .reg-input--pr { padding-right: 2.875rem; }

        /* ── Input con icono ───────────────────────────────── */
        .reg-input-icon { position: relative; }
        .reg-input-icon__i {
            position: absolute; left: .875rem; top: 50%;
            transform: translateY(-50%);
            color: var(--hos-text-muted); font-size: .875rem;
            pointer-events: none; z-index: 1;
        }

        /* ── Ojo de contraseña ─────────────────────────────── */
        .reg-eye {
            position: absolute; right: .75rem; top: 50%;
            transform: translateY(-50%);
            background: none; border: none; padding: .25rem;
            cursor: pointer; color: var(--hos-text-muted);
            display: grid; place-items: center;
            transition: color .15s; line-height: 1;
        }
        .reg-eye:hover { color: var(--hos-text); }

        /* ── Error ──────────────────────────────────────────── */
        .reg-err {
            font-size: .78rem; color: #ef4444; margin: 0;
            display: flex; align-items: center; gap: .3rem;
        }
        .reg-err--muted { color: var(--hos-text-muted); }

        /* ── Términos ───────────────────────────────────────── */
        .reg-terms {
            display: flex; align-items: flex-start; gap: .625rem;
            font-size: .8125rem; color: var(--hos-text-muted);
            line-height: 1.55; cursor: pointer;
        }
        .reg-check {
            width: 1.1rem; height: 1.1rem;
            accent-color: var(--hos-primary);
            flex-shrink: 0; margin-top: .15rem; cursor: pointer;
        }

        /* ══════════════════════════════════════════════════════════
           MÓDULOS
        ══════════════════════════════════════════════════════════ */
        .reg-modules {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: .5rem; margin-top: .25rem;
        }
        .reg-module {
            display: flex; flex-direction: column;
            align-items: center; justify-content: center;
            gap: .375rem; padding: .875rem .5rem;
            border: 1.5px solid var(--hos-border);
            border-radius: 12px;
            background: var(--hos-bg);
            color: var(--hos-text-muted);
            cursor: pointer; font-size: .8rem; font-weight: 600;
            font-family: inherit;
            transition: all .15s;
            position: relative;
        }
        .reg-module i { font-size: 1.1rem; }
        .reg-module:hover {
            border-color: var(--hos-primary);
            background: var(--hos-primary-soft);
            color: var(--hos-primary);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(20, 184, 166,.15);
        }
        .reg-module.is-on {
            border-color: var(--hos-primary);
            background: var(--hos-primary-soft);
            color: var(--hos-primary);
            box-shadow: 0 0 0 3px rgba(20, 184, 166,.12);
        }
        .reg-module__check {
            position: absolute; top: 5px; right: 6px;
            width: 16px; height: 16px; border-radius: 50%;
            background: var(--hos-primary); color: #fff;
            display: grid; place-items: center;
            font-size: .55rem;
        }
        .app-dark .reg-module__check { color: #042f2e; }

        /* ══════════════════════════════════════════════════════════
           ACCIONES
        ══════════════════════════════════════════════════════════ */
        .reg-actions2 {
            display: flex; align-items: center;
            justify-content: space-between; gap: .75rem;
            margin-top: .5rem;
            padding-top: 1.25rem;
            border-top: 1px solid var(--hos-border);
        }

        /* ══════════════════════════════════════════════════════════
           BOTONES
        ══════════════════════════════════════════════════════════ */
        .reg-btn {
            display: inline-flex; align-items: center;
            justify-content: center; gap: .5rem;
            padding: .875rem 1.5rem;
            font-size: .9375rem; font-weight: 600;
            border-radius: 999px;
            border: 1.5px solid transparent;
            cursor: pointer; font-family: inherit;
            text-decoration: none; white-space: nowrap;
            transition: transform .2s ease, box-shadow .2s ease, background .15s, color .15s, border-color .15s;
        }
        .reg-btn i { font-size: .85em; }
        .reg-btn--primary {
            background: linear-gradient(180deg, var(--hos-teal-500), var(--hos-teal-700));
            color: #fff; border-color: transparent;
            box-shadow: 0 12px 28px rgba(13,148,136,.3);
        }
        .reg-btn--primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 36px rgba(13,148,136,.4);
        }
        .app-dark .reg-btn--primary { background: linear-gradient(180deg, var(--hos-teal-400), var(--hos-teal-600)); color: #042f2e; }
        .reg-btn--ghost {
            background: transparent;
            color: var(--hos-text-muted);
            border-color: var(--hos-border);
        }
        .reg-btn--ghost:hover {
            border-color: var(--hos-primary);
            color: var(--hos-primary);
            background: var(--hos-primary-soft);
        }
        .reg-btn--block { width: 100%; }

        /* ══════════════════════════════════════════════════════════
           ENLACES Y TEXTO
        ══════════════════════════════════════════════════════════ */
        .reg-link {
            color: var(--hos-primary); font-weight: 600;
            text-decoration: none;
        }
        .reg-link:hover { text-decoration: underline; }

        .reg-foot {
            text-align: center; margin: .25rem 0 0;
            font-size: .875rem; color: var(--hos-text-muted);
        }

        /* ── Nota de seguridad ─────────────────────────────── */
        .reg-secure {
            display: flex; align-items: center; justify-content: center;
            gap: .5rem; margin-top: 1.5rem;
            font-size: .75rem; color: var(--hos-text-muted);
        }
        .reg-secure i { color: var(--hos-primary); font-size: .8rem; }

        /* ══════════════════════════════════════════════════════════
           ÉXITO
        ══════════════════════════════════════════════════════════ */
        .reg-success {
            position: relative;
            width: min(560px, 100%);
            margin-inline: auto;
            background: var(--hos-surface);
            border: 1px solid var(--hos-border);
            border-radius: 24px;
            box-shadow: 0 20px 60px rgba(0,0,0,.1);
            overflow: hidden;
            animation: regUp .35s ease both;
        }
        .reg-success__orb {
            position: absolute; border-radius: 50%;
            pointer-events: none;
        }
        .reg-success__orb--1 {
            width: 280px; height: 280px;
            top: -100px; right: -80px;
            background: radial-gradient(circle, rgba(20,184,166,.2), transparent 65%);
            filter: blur(40px);
        }
        .reg-success__orb--2 {
            width: 220px; height: 220px;
            bottom: -80px; left: -60px;
            background: radial-gradient(circle, rgba(99,102,241,.15), transparent 65%);
            filter: blur(40px);
        }
        .reg-success__inner {
            position: relative; z-index: 1;
            padding: 3rem 2.5rem;
            text-align: center;
            display: flex; flex-direction: column;
            align-items: center; gap: 1rem;
        }
        .reg-success__icon {
            width: 72px; height: 72px; border-radius: 50%;
            background: var(--hos-primary-soft);
            color: var(--hos-primary);
            display: grid; place-items: center;
            font-size: 2rem;
            box-shadow: 0 0 0 8px rgba(20, 184, 166,.08);
        }
        .reg-eyebrow {
            display: inline-flex; align-items: center; gap: 8px;
            font-size: .72rem; font-weight: 700;
            letter-spacing: .14em; text-transform: uppercase;
            color: var(--hos-primary);
            padding: 7px 14px; border-radius: 999px;
            border: 1px solid var(--hos-teal-300);
            background: var(--hos-primary-soft);
        }
        .app-dark .reg-eyebrow { border-color: rgba(20, 184, 166,.35); }
        .reg-success__title {
            font-family: var(--hos-font-display);
            font-size: clamp(1.5rem,3vw,1.875rem);
            font-weight: 800; letter-spacing: -.03em;
            margin: 0; line-height: 1.15; color: var(--hos-text);
        }
        .reg-success__body {
            margin: 0; color: var(--hos-text-muted);
            font-size: .9375rem; line-height: 1.65;
        }
        .reg-success__pills {
            display: flex; flex-wrap: wrap;
            justify-content: center; gap: .5rem;
        }
        .reg-pill {
            display: inline-flex; align-items: center; gap: 6px;
            font-size: .72rem; font-weight: 700;
            padding: 5px 12px; border-radius: 999px;
            background: var(--hos-primary-soft);
            color: var(--hos-primary);
            border: 1px solid var(--hos-teal-300);
        }
        .app-dark .reg-pill { border-color: rgba(20, 184, 166,.35); }

        /* ══════════════════════════════════════════════════════════
           RESPONSIVE
        ══════════════════════════════════════════════════════════ */
        @media (max-width: 640px) {
            .reg-wrap {
                border-radius: 0;
                border-left: none; border-right: none;
                padding: 1.75rem 1.25rem 1.5rem;
                box-shadow: none;
            }
            .reg-row2 { grid-template-columns: 1fr; }
            .reg-modules { grid-template-columns: repeat(2, 1fr); }
            .reg-actions2 { flex-direction: column-reverse; }
            .reg-actions2 .reg-btn { width: 100%; }
            .reg-success__inner { padding: 2rem 1.25rem; }
            .reg-btn--block { justify-content: center; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
            .reg-modules { grid-template-columns: repeat(3, 1fr); }
        }
    `]
})
export class RegisterPage implements OnInit {
    readonly modules = REGISTER_MODULES;

    step: 1 | 2 = 1;
    completed = false;
    showPw  = false;
    showCpw = false;
    /** ¿Se intentó enviar el paso 1? */
    s1 = false;
    /** ¿Se intentó enviar el paso 2? */
    s2 = false;
    errorMessage = '';
    submitting = false;
    emailBlurred  = false;
    emailChecking = false;
    emailTaken    = false;
    currentYear = new Date().getFullYear();

    form1!: FormGroup;
    form2!: FormGroup;

    savedModules: string[] = [];
    private savedStep1!: OnboardingStep1Data;

    private readonly auth = inject(AuthService);
    private readonly hotels = inject(HotelService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form1 = this.fb.group(
            {
                firstName:       ['', Validators.required],
                lastName:        ['', Validators.required],
                email:           ['', [Validators.required, Validators.email]],
                phoneNumber:     ['', Validators.maxLength(30)],
                language:        ['es'],
                password:        ['', [Validators.required, strongPasswordValidator]],
                confirmPassword: ['', Validators.required],
                terms:           [false, Validators.requiredTrue],
            },
            { validators: passwordsMatchValidator }
        );

        this.form2 = this.fb.group({
            propertyName: ['', Validators.required],
            propertyType: ['', Validators.required],
            roomCount:    [null, [Validators.required, Validators.min(1)]],
            category:     [''],
            country:      ['', Validators.required],
            city:         ['', Validators.required],
            address:      ['', Validators.required],
            postalCode:   ['', Validators.maxLength(20)],
            businessName: ['', Validators.maxLength(200)],
            yearOpened:   [null],
            contactEmail: ['', Validators.email],
            hotelPhone:   ['', Validators.maxLength(30)],
            website:      ['', Validators.maxLength(300)],
            timeZone:     ['UTC'],
            currency:     ['USD'],
            taxRate:      [null],
            checkInTime:  ['14:00'],
            checkOutTime: ['12:00'],
            hotelLanguages: [''],
            role:         ['', Validators.required],
            modules:      [[] as string[], atLeastOneModuleValidator],
        });

        this.form2.get('country')?.valueChanges.subscribe((country: string) => this.applyCountryDefaults(country));
    }

    /** Campo inválido: tocado o submit intentado */
    inv(form: FormGroup, field: string): boolean {
        const c = form.get(field);
        if (!c) return false;
        const tried = form === this.form1 ? this.s1 : this.s2;
        return !!(c.invalid && (c.touched || tried));
    }

    // ── Módulos ──────────────────────────────────────────────────────────────
    hasModule(id: string): boolean {
        return ((this.form2.get('modules')?.value ?? []) as string[]).includes(id);
    }
    toggleModule(id: string): void {
        const cur: string[] = this.form2.get('modules')?.value ?? [];
        this.form2.get('modules')?.setValue(
            cur.includes(id) ? cur.filter(m => m !== id) : [...cur, id]
        );
        this.form2.get('modules')?.markAsTouched();
    }

    // ── Prefill zona horaria / moneda según país ────────────────────────────
    private readonly COUNTRY_LOOKUP: Record<string, { tz: string; currency: string }> = {
        'mexico':            { tz: 'America/Mexico_City', currency: 'MXN' },
        'espana':            { tz: 'Europe/Madrid', currency: 'EUR' },
        'estadosunidos':     { tz: 'America/New_York', currency: 'USD' },
        'eeuu':              { tz: 'America/New_York', currency: 'USD' },
        'argentin':          { tz: 'America/Argentina/Buenos_Aires', currency: 'ARS' },
        'colombia':          { tz: 'America/Bogota', currency: 'COP' },
        'peru':              { tz: 'America/Lima', currency: 'PEN' },
        'chile':             { tz: 'America/Santiago', currency: 'CLP' },
        'ecuador':           { tz: 'America/Guayaquil', currency: 'USD' },
        'uruguay':           { tz: 'America/Montevideo', currency: 'UYU' },
        'paraguay':          { tz: 'America/Asuncion', currency: 'PYG' },
        'bolivia':           { tz: 'America/La_Paz', currency: 'BOB' },
        'venezuela':         { tz: 'America/Caracas', currency: 'USD' },
        'brasil':            { tz: 'America/Sao_Paulo', currency: 'BRL' },
        'portugal':          { tz: 'Europe/Lisbon', currency: 'EUR' },
        'francia':           { tz: 'Europe/Paris', currency: 'EUR' },
        'italia':            { tz: 'Europe/Rome', currency: 'EUR' },
        'alemania':          { tz: 'Europe/Berlin', currency: 'EUR' },
        'reino unido':       { tz: 'Europe/London', currency: 'GBP' },
        'costarica':         { tz: 'America/Costa_Rica', currency: 'CRC' },
        'guatemala':         { tz: 'America/Guatemala', currency: 'GTQ' },
        'panama':            { tz: 'America/Panama', currency: 'USD' },
        'honduras':          { tz: 'America/Tegucigalpa', currency: 'HNL' },
        'elsalvador':        { tz: 'America/El_Salvador', currency: 'USD' },
        'nicaragua':         { tz: 'America/Managua', currency: 'NIO' },
        'republicadominicana': { tz: 'America/Santo_Domingo', currency: 'DOP' },
        'cuba':              { tz: 'America/Havana', currency: 'CUP' },
        'puertorico':        { tz: 'America/Puerto_Rico', currency: 'USD' },
        'canada':            { tz: 'America/Toronto', currency: 'CAD' },
    };

    readonly TIME_ZONES: string[] = [
        'UTC', 'America/Mexico_City', 'America/New_York', 'America/Los_Angeles',
        'America/Argentina/Buenos_Aires', 'America/Bogota', 'America/Lima',
        'America/Santiago', 'America/Sao_Paulo', 'America/Caracas', 'America/Montevideo',
        'America/Asuncion', 'America/La_Paz', 'America/Panama', 'America/Costa_Rica',
        'America/Guatemala', 'America/Tegucigalpa', 'America/Managua', 'America/Havana',
        'America/Santo_Domingo', 'America/Puerto_Rico', 'America/Toronto', 'America/Chicago',
        'America/Denver', 'Europe/Madrid', 'Europe/Lisbon', 'Europe/Paris', 'Europe/Rome',
        'Europe/Berlin', 'Europe/London',
    ];

    readonly CURRENCIES: string[] = [
        'USD', 'MXN', 'EUR', 'BRL', 'GBP', 'CAD', 'ARS', 'COP', 'PEN', 'CLP',
        'UYU', 'PYG', 'BOB', 'CRC', 'GTQ', 'HNL', 'NIO', 'DOP', 'CUP', 'CHF',
    ];

    applyCountryDefaults(country: string): void {
        const key = (country ?? '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const hit = this.COUNTRY_LOOKUP[key] ?? this.COUNTRY_LOOKUP[key.replace(/\s+/g, '')];
        if (!hit) return;
        if (!this.form2.get('timeZone')?.value || this.form2.get('timeZone')?.value === 'UTC') {
            this.form2.get('timeZone')?.setValue(hit.tz);
        }
        if (this.form2.get('currency')?.value === 'USD' || !this.form2.get('currency')?.value) {
            this.form2.get('currency')?.setValue(hit.currency);
        }
    }

    // ── Disponibilidad de email (GET /auth/check-email/{email}) ────────────
    onEmailBlur(): void {
        const email = this.form1.get('email');
        if (!email || email.invalid || !email.value) {
            return;
        }
        this.emailBlurred = true;
        this.emailChecking = true;
        this.emailTaken = false;
        this.auth.checkEmailAvailability(email.value).subscribe({
            next: (available) => {
                this.emailChecking = false;
                this.emailTaken = !available;
                this.cdr.detectChanges();
            },
            error: () => {
                this.emailChecking = false;
                this.cdr.detectChanges();
            }
        });
    }

    // ── Paso 1 → Paso 2 ──────────────────────────────────────────────────────
    onStep1Submit(): void {
        this.s1 = true;
        this.form1.markAllAsTouched();
        if (this.emailTaken) {
            return;
        }
        if (this.form1.invalid) return;

        const v = this.form1.value;
        this.savedStep1 = {
            user: { firstName: v.firstName, lastName: v.lastName, email: v.email, password: v.password },
            termsAccepted: v.terms,
        };
        this.step = 2;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    goBack(): void {
        this.step = 1;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ── Paso 2 → Completado ───────────────────────────────────────────────────
    onStep2Submit(): void {
        this.s2 = true;
        this.form2.markAllAsTouched();
        if (this.form2.invalid) return;

        const v = this.form2.value;
        const step2Data: OnboardingStep2Data = {
            property: {
                propertyName:    v.propertyName,
                propertyType:    v.propertyType,
                roomCount:       v.roomCount,
                country:         v.country,
                city:            v.city,
                role:            v.role,
                selectedModules: v.modules,
            },
        };

        const u = this.savedStep1.user;
        this.submitting = true;
        this.errorMessage = '';
        this.auth.register({
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email,
            phoneNumber: String(this.form1.value['phoneNumber'] ?? ''),
            password: u.password,
            confirmPassword: u.password,
            department: step2Data.property.role ?? '',
            position: step2Data.property.propertyType ?? '',
            language: String(this.form1.value['language'] ?? 'es'),
            timeZone: String(v['timeZone'] ?? 'UTC')
        }).subscribe({
            next: () => this.createProperty(u, v),
            error: (err: { error?: string | { message?: string } }) => {
                this.submitting = false;
                if (typeof err.error === 'string' && err.error) {
                    this.errorMessage = err.error;
                } else {
                    this.errorMessage = (err.error as { message?: string })?.message ?? 'No se pudo crear la cuenta. Inténtalo de nuevo.';
                }
                this.cdr.detectChanges();
            }
        });
    }

    /** Persiste la propiedad con POST /api/v1/hotels (el token ya está en localStorage) */
    private createProperty(u: { firstName: string; lastName: string; email: string; password: string }, v: Record<string, unknown>): void {
        const parsedRating = Number.parseInt(String(v['category']), 10);
        const yearOpened = Number(v['yearOpened']) || null;
        const taxRate = Number(v['taxRate']);
        this.hotels.createHotel({
            name: String(v['propertyName']),
            description: `Propiedad "${String(v['propertyType'])}" creada durante el registro.`,
            address: String(v['address'] ?? ''),
            phoneNumber: String(v['hotelPhone'] ?? ''),
            email: String(v['contactEmail'] ?? u.email),
            website: (v['website'] as string)?.trim() || undefined,
            starRating: Number.isFinite(parsedRating) ? parsedRating : 3,
            totalRooms: Number(v['roomCount']) || 0,
            timeZone: String(v['timeZone'] ?? 'UTC'),
            city: String(v['city'] ?? ''),
            country: String(v['country'] ?? ''),
            businessName: (v['businessName'] as string)?.trim() || undefined,
            yearOpened: yearOpened || undefined,
            postalCode: (v['postalCode'] as string)?.trim() || undefined,
            currency: String(v['currency'] ?? 'USD'),
            taxRate: Number.isFinite(taxRate) ? taxRate : undefined,
            checkInTime: String(v['checkInTime'] ?? '14:00') || undefined,
            checkOutTime: String(v['checkOutTime'] ?? '12:00') || undefined,
            hotelLanguages: (v['hotelLanguages'] as string)?.trim() || undefined,
            selectedModules: ((v['modules'] as string[]) ?? []).join(',')
        }).subscribe({
            next: (hotel) => {
                localStorage.setItem('auth_hotel_id', hotel.id);
                this.savedModules = (v['modules'] as string[]) ?? [];
                this.completed = true;
                this.cdr.detectChanges();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            error: () => {
                this.savedModules = (v['modules'] as string[]) ?? [];
                this.completed = true;
                this.cdr.detectChanges();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

// ════════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-forgot',
    standalone: true,
    imports: [RouterModule, FormsModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-key"
            eyebrow="Recuperación de acceso"
            title="¿Olvidaste tu contraseña?"
            subtitle="Te enviamos un enlace seguro para restablecerla."
        >
            @if (!sent) {
            <form (ngSubmit)="submit()">
                <div class="gos-field">
                    <label for="forgot-email">Email</label>
                    <input id="forgot-email" type="email" name="email" class="gos-input" placeholder="tu@hotel.com" [(ngModel)]="email" />
                </div>
                @if (errorMessage) {
                    <div class="gos-error"><i class="pi pi-exclamation-circle"></i> {{ errorMessage }}</div>
                }
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block" [disabled]="loading">
                    @if (loading) { <span class="gos-spinner"></span> } Enviar enlace <i class="pi pi-send"></i>
                </button>
            </form>
            } @else {
                <div class="gos-success"><i class="pi pi-check-circle"></i> Si el correo existe, recibirás un enlace para restablecer tu contraseña.</div>
            }
            <p class="auth-foot">
                <a class="gos-link" routerLink="/account/login"><i class="pi pi-arrow-left"></i> Volver a iniciar sesión</a>
            </p>
        </gos-auth-card>
    `
})
export class ForgotPasswordPage {
    email = '';
    sent = false;
    loading = false;
    errorMessage = '';

    private readonly auth = inject(AuthService);
    private readonly cdr = inject(ChangeDetectorRef);

    submit(): void {
        if (!this.email) {
            this.errorMessage = 'Introduce tu email.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.auth.forgotPassword(this.email).subscribe({
            next: () => {
                this.loading = false;
                this.sent = true;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loading = false;
                this.errorMessage = 'No se pudo enviar el enlace. Inténtalo de nuevo.';
                this.cdr.detectChanges();
            }
        });
    }
}

// ════════════════════════════════════════════════════════════════════════════
// RESET PASSWORD
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-reset',
    standalone: true,
    imports: [RouterModule, FormsModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-key"
            eyebrow="Nueva contraseña"
            title="Restablece tu contraseña"
            subtitle="Elige una contraseña nueva y segura."
        >
            @if (done) {
                <div class="gos-success"><i class="pi pi-check-circle"></i> Contraseña restablecida correctamente.</div>
                <a class="gos-btn gos-btn--primary gos-btn--block" routerLink="/account/login">Iniciar sesión <i class="pi pi-arrow-right"></i></a>
            } @else {
            <form (ngSubmit)="submit()">
                <div class="gos-field">
                    <label for="reset-email">Email</label>
                    <input id="reset-email" type="email" name="email" class="gos-input" placeholder="tu@hotel.com" [(ngModel)]="email" />
                </div>
                <div class="gos-field">
                    <label for="reset-pass">Nueva contraseña</label>
                    <input id="reset-pass" type="password" name="password" class="gos-input" placeholder="Mínimo 8 caracteres" [(ngModel)]="password" />
                </div>
                <div class="gos-field">
                    <label for="reset-pass2">Confirma la contraseña</label>
                    <input id="reset-pass2" type="password" name="confirmPassword" class="gos-input" placeholder="Repite la contraseña" [(ngModel)]="confirmPassword" />
                </div>
                @if (errorMessage) {
                    <div class="gos-error"><i class="pi pi-exclamation-circle"></i> {{ errorMessage }}</div>
                }
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block" [disabled]="loading">
                    @if (loading) { <span class="gos-spinner"></span> } Guardar contraseña <i class="pi pi-check"></i>
                </button>
            </form>
            }
            <p class="auth-foot">
                <a class="gos-link" routerLink="/account/login"><i class="pi pi-arrow-left"></i> Volver a iniciar sesión</a>
            </p>
        </gos-auth-card>
    `
})
export class ResetPasswordPage implements OnInit {
    email = '';
    password = '';
    confirmPassword = '';
    done = false;
    loading = false;
    errorMessage = '';

    private token = '';

    private readonly route = inject(ActivatedRoute);
    private readonly auth = inject(AuthService);
    private readonly cdr = inject(ChangeDetectorRef);

    ngOnInit(): void {
        this.route.queryParams.subscribe((params) => {
            this.token = params['token'] ?? '';
            if (params['email']) {
                this.email = params['email'];
            }
        });
    }

    submit(): void {
        if (!this.token) {
            this.errorMessage = 'El enlace es inválido o ha expirado. Solicita uno nuevo.';
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.errorMessage = 'Las contraseñas no coinciden.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.auth.resetPassword(this.email, this.token, this.password, this.confirmPassword).subscribe({
            next: () => {
                this.loading = false;
                this.done = true;
                this.cdr.detectChanges();
            },
            error: (err: { error?: string | { message?: string } }) => {
                this.loading = false;
                if (typeof err.error === 'string' && err.error) {
                    this.errorMessage = err.error;
                } else {
                    this.errorMessage = (err.error as { message?: string })?.message ?? 'No se pudo restablecer la contraseña. Inténtalo de nuevo.';
                }
                this.cdr.detectChanges();
            }
        });
    }
}

// ════════════════════════════════════════════════════════════════════════════
// VERIFY EMAIL
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-verify-email',
    standalone: true,
    imports: [RouterModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-envelope"
            eyebrow="Verifica tu email"
            title="Revisa tu bandeja de entrada"
            subtitle="Te enviamos un enlace de verificación a tu correo para activar tu cuenta."
        >
            <button type="button" class="gos-btn gos-btn--primary gos-btn--block" (click)="resend()">Reenviar correo <i class="pi pi-send"></i></button>
            <p class="auth-foot">
                ¿Ya lo verificaste? <a class="gos-link" routerLink="/account/login">Inicia sesión</a>
            </p>
        </gos-auth-card>
    `
})
export class VerifyEmailPage {
    resend(): void {
        alert('Demo: correo reenviado.');
    }
}

// ════════════════════════════════════════════════════════════════════════════
// ACTIVATE
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-activate',
    standalone: true,
    imports: [RouterModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-check-circle"
            eyebrow="¡Listo!"
            title="Tu cuenta está activa"
            subtitle="Bienvenido a Hospitality OS. Configura tu primer hotel y empieza hoy."
        >
            <div class="auth-grid-2" style="gap: 12px">
                <a class="gos-btn gos-btn--primary gos-btn--block" routerLink="/account/login">Ir a la plataforma <i class="pi pi-arrow-right"></i></a>
            </div>
            <p class="auth-foot">
                <a class="gos-link" routerLink="/">Volver al sitio</a>
            </p>
        </gos-auth-card>
    `
})
export class ActivatePage {}

// ════════════════════════════════════════════════════════════════════════════
// LOCK SCREEN
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-lock',
    standalone: true,
    imports: [RouterModule, FormsModule, CommonModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-lock"
            eyebrow="Pantalla bloqueada"
            title="Sesión bloqueada"
            subtitle="Esto es un bloqueo de seguridad por inactividad. Escribe tu contraseña para retomar la sesión."
        >
            <p class="gos-lock-user">
                <i class="pi pi-user"></i>
                {{ user?.firstName }} {{ user?.lastName }}
            </p>
            <form (ngSubmit)="submit()">
                <div class="gos-field">
                    <label for="lock-pass">Contraseña</label>
                    <input id="lock-pass" type="password" class="gos-input" placeholder="••••••••"
                        [(ngModel)]="password" name="password" autocomplete="current-password" />
                </div>
                @if (errorMessage) {
                    <p class="gos-form-error">{{ errorMessage }}</p>
                }
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block" [disabled]="loading">
                    <i class="pi pi-spin pi-spinner" *ngIf="loading"></i>
                    <ng-container *ngIf="!loading">Desbloquear <i class="pi pi-unlock"></i></ng-container>
                </button>
            </form>
            <p class="auth-foot">
                <a class="gos-link" routerLink="/account/login">Entrar con otra cuenta</a>
            </p>
        </gos-auth-card>
    `
})
export class LockScreenPage {
    password = '';
    errorMessage = '';
    loading = false;

    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    user = this.auth.getCachedUser();

    submit(): void {
        if (!this.password) {
            this.errorMessage = 'Introduce tu contraseña.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.auth.login({ email: this.user?.email ?? '', password: this.password, rememberMe: false }).subscribe({
            next: () => this.router.navigate(['/app']),
            error: (err: { error?: string | { message?: string } }) => {
                this.loading = false;
                if (typeof err.error === 'string' && err.error) {
                    this.errorMessage = err.error;
                } else {
                    this.errorMessage = (err.error as { message?: string })?.message ?? 'Contraseña incorrecta.';
                }
                this.cdr.detectChanges();
            }
        });
    }
}

// ════════════════════════════════════════════════════════════════════════════
// CHANGE PASSWORD — obligatorio tras el primer acceso / registro
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-change-password',
    standalone: true,
    imports: [RouterModule, FormsModule, CommonModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-key"
            eyebrow="Seguridad de cuenta"
            title="Cambia tu contraseña"
            subtitle="Por seguridad, debes definir una contraseña nueva antes de continuar."
        >
            <form (ngSubmit)="submit()">
                <div class="gos-field">
                    <label for="cp-current">Contraseña actual</label>
                    <input id="cp-current" type="password" class="gos-input" placeholder="••••••••"
                        [(ngModel)]="currentPassword" name="currentPassword" autocomplete="current-password" />
                </div>
                <div class="gos-field">
                    <label for="cp-new">Nueva contraseña</label>
                    <input id="cp-new" type="password" class="gos-input" placeholder="Mínimo 6 caracteres"
                        [(ngModel)]="newPassword" name="newPassword" autocomplete="new-password" />
                </div>
                <div class="gos-field">
                    <label for="cp-confirm">Confirmar nueva contraseña</label>
                    <input id="cp-confirm" type="password" class="gos-input" placeholder="Repite la contraseña nueva"
                        [(ngModel)]="confirmPassword" name="confirmPassword" autocomplete="new-password" />
                </div>
                @if (errorMessage) {
                    <p class="gos-form-error">{{ errorMessage }}</p>
                }
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block" [disabled]="loading">
                    <i class="pi pi-spin pi-spinner" *ngIf="loading"></i>
                    <ng-container *ngIf="!loading">Guardar contraseña <i class="pi pi-check"></i></ng-container>
                </button>
            </form>
        </gos-auth-card>
    `
})
export class ChangePasswordPage {
    currentPassword = '';
    newPassword = '';
    confirmPassword = '';
    errorMessage = '';
    loading = false;

    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);

    submit(): void {
        if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
            this.errorMessage = 'Completa todos los campos.';
            return;
        }
        if (this.newPassword.length < 6) {
            this.errorMessage = 'La nueva contraseña debe tener al menos 6 caracteres.';
            return;
        }
        if (this.newPassword !== this.confirmPassword) {
            this.errorMessage = 'Las contraseñas no coinciden.';
            return;
        }

        this.loading = true;
        this.errorMessage = '';
        this.auth.changePassword(this.currentPassword, this.newPassword, this.confirmPassword).subscribe({
            next: () => {
                const user = this.auth.getCachedUser();
                if (user) {
                    this.auth.updateCachedUser({ ...user, mustChangePassword: false });
                }
                this.router.navigate(['/app']);
            },
            error: (err: { error?: string | { message?: string } }) => {
                this.loading = false;
                if (typeof err.error === 'string' && err.error) {
                    this.errorMessage = err.error;
                } else {
                    this.errorMessage = (err.error as { message?: string })?.message ?? 'No se pudo cambiar la contraseña.';
                }
                this.cdr.detectChanges();
            }
        });
    }
}

// ════════════════════════════════════════════════════════════════════════════
// ERROR PAGES
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-error',
    standalone: true,
    imports: [RouterModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-exclamation-triangle"
            eyebrow="Error 403"
            title="Acceso no autorizado"
            subtitle="No tienes permisos para ver esta página. Contacta con tu administrador."
        >
            <a class="gos-btn gos-btn--primary gos-btn--block" routerLink="/app">Ir al dashboard <i class="pi pi-arrow-right"></i></a>
        </gos-auth-card>
    `
})
export class ErrorPage {}

@Component({
    selector: 'account-404',
    standalone: true,
    imports: [RouterModule],
    template: `
        <div class="not-found">
            <div class="not-found__orb not-found__orb--1" aria-hidden="true"></div>
            <div class="not-found__orb not-found__orb--2" aria-hidden="true"></div>
            <div class="not-found__inner">
                <div class="not-found__number">404</div>
                <span class="not-found__eyebrow"><i class="pi pi-compass"></i> Página no encontrada</span>
                <h1 class="not-found__title">Esta habitación<br>no existe.</h1>
                <p class="not-found__desc">
                    La página que buscas fue movida, eliminada o nunca existió.<br>
                    Volvamos a la recepción.
                </p>
                <div class="not-found__actions">
                    <a class="not-found__btn not-found__btn--primary" routerLink="/">
                        <i class="pi pi-home"></i> Ir al inicio
                    </a>
                    <a class="not-found__btn not-found__btn--ghost" routerLink="/contact">
                        Contactar soporte
                    </a>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host { display: block; }
        .not-found {
            position: relative;
            min-height: 100vh;
            display: flex; align-items: center; justify-content: center;
            background: var(--hos-bg);
            overflow: hidden; padding: 2rem 1rem;
        }
        .not-found__orb {
            position: absolute; border-radius: 50%;
            filter: blur(100px); pointer-events: none;
        }
        .not-found__orb--1 {
            width: 600px; height: 600px;
            top: -200px; right: -150px;
            background: radial-gradient(circle, rgba(20,184,166,.12), transparent 65%);
        }
        .not-found__orb--2 {
            width: 400px; height: 400px;
            bottom: -150px; left: -100px;
            background: radial-gradient(circle, rgba(99,102,241,.1), transparent 65%);
        }
        .not-found__inner {
            position: relative; z-index: 1;
            text-align: center;
            display: flex; flex-direction: column;
            align-items: center; gap: 1.25rem;
            max-width: 520px;
        }
        .not-found__number {
            font-family: var(--hos-font-display);
            font-size: clamp(6rem, 18vw, 10rem);
            font-weight: 900; letter-spacing: -0.06em;
            line-height: 1;
            background: var(--hos-grad);
            -webkit-background-clip: text; background-clip: text;
            -webkit-text-fill-color: transparent; color: transparent;
            opacity: .15; user-select: none; margin-bottom: -1rem;
        }
        .not-found__eyebrow {
            display: inline-flex; align-items: center; gap: 8px;
            font-size: 0.72rem; font-weight: 700;
            letter-spacing: .14em; text-transform: uppercase;
            color: var(--hos-primary); padding: 7px 14px; border-radius: 999px;
            border: 1px solid var(--hos-teal-300); background: var(--hos-primary-soft);
        }
        .app-dark .not-found__eyebrow { border-color: rgba(20, 184, 166,.35); }
        .not-found__title {
            font-family: var(--hos-font-display);
            font-size: clamp(2rem, 5vw, 2.75rem);
            font-weight: 800; letter-spacing: -0.04em;
            line-height: 1.1; margin: 0; color: var(--hos-text);
        }
        .not-found__desc {
            color: var(--hos-text-muted); font-size: 1rem; line-height: 1.7; margin: 0;
        }
        .not-found__actions {
            display: flex; gap: 10px; flex-wrap: wrap;
            justify-content: center; margin-top: .5rem;
        }
        .not-found__btn {
            display: inline-flex; align-items: center; gap: 8px;
            padding: .875rem 1.5rem; border-radius: 999px;
            font-size: .9375rem; font-weight: 600;
            border: 1.5px solid transparent; text-decoration: none;
            transition: transform .2s, box-shadow .2s, background .15s, color .15s, border-color .15s;
            font-family: var(--hos-font-sans);
        }
        .not-found__btn--primary {
            background: linear-gradient(180deg, var(--hos-teal-500), var(--hos-teal-700));
            color: #fff; box-shadow: 0 10px 28px rgba(13,148,136,.3);
        }
        .not-found__btn--primary:hover { transform: translateY(-2px); box-shadow: 0 14px 34px rgba(13,148,136,.4); }
        .app-dark .not-found__btn--primary { color: #042f2e; }
        .not-found__btn--ghost {
            background: transparent; color: var(--hos-text-muted); border-color: var(--hos-border);
        }
        .not-found__btn--ghost:hover { border-color: var(--hos-primary); color: var(--hos-primary); }
        @media (max-width: 480px) {
            .not-found__actions { flex-direction: column; }
            .not-found__btn { justify-content: center; }
        }
    `]
})
export class NotFoundPage {}

@Component({
    selector: 'page-server-error',
    standalone: true,
    imports: [RouterModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-exclamation-circle"
            eyebrow="Error 500"
            title="Algo salió mal"
            subtitle="Un error inesperado. Nuestro equipo ya fue notificado."
        >
            <div class="auth-grid-2" style="gap: 12px">
                <a class="gos-btn gos-btn--primary gos-btn--block" routerLink="/">Volver al inicio <i class="pi pi-home"></i></a>
            </div>
        </gos-auth-card>
    `
})
export class ServerErrorPage {}

@Component({
    selector: 'page-access-denied',
    standalone: true,
    imports: [RouterModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-lock"
            eyebrow="Acceso denegado · 403"
            title="Zona restringida"
            subtitle="Tu rol no tiene permisos para acceder a esta sección. Contacta con un administrador si crees que es un error."
        >
            <div class="auth-grid-2" style="gap: 12px">
                <a class="gos-btn gos-btn--primary gos-btn--block" routerLink="/app">Ir al dashboard <i class="pi pi-arrow-right"></i></a>
                <a class="gos-btn gos-btn--ghost gos-btn--block" routerLink="/">Página principal</a>
            </div>
        </gos-auth-card>
    `
})
export class AccessDeniedPage {}
