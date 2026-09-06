import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GosAuthCard } from '@/app/shared/components/auth-card';
import { OnboardingStep1Data, OnboardingStep2Data } from '@/app/shared/services/onboarding.service';

// ─── Validators ──────────────────────────────────────────────────────────────
function passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pw  = group.get('password')?.value  ?? '';
    const cpw = group.get('confirmPassword')?.value ?? '';
    return pw && cpw && pw !== cpw ? { passwordsMismatch: true } : null;
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
    imports: [RouterModule, GosAuthCard],
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
                    <input id="login-email" type="email" class="gos-input" placeholder="tu@hotel.com" />
                </div>
                <div class="gos-field">
                    <label for="login-pass">Contraseña</label>
                    <input id="login-pass" type="password" class="gos-input" placeholder="••••••••" />
                    <div style="text-align: right; margin-top: 6px">
                        <a class="gos-link" routerLink="/account/forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>
                </div>
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block">Iniciar sesión <i class="pi pi-arrow-right"></i></button>
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
    submit(): void {
        alert('Demo: en el MVP real aquí se autentica contra el backend.');
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
                       autocomplete="email" />
            </div>
            @if (inv(form1,'email')) {
                <p class="reg-err">
                    <i class="pi pi-exclamation-circle"></i>
                    @if (form1.get('email')?.errors?.['required']) { El email es obligatorio }
                    @else { Introduce un email válido }
                </p>
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
                        @if (form1.get('password')?.errors?.['required']) { La contraseña es obligatoria }
                        @else { Mínimo 8 caracteres }
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
        <div class="reg-actions2">
            <button type="button" class="reg-btn reg-btn--ghost" (click)="goBack()">
                <i class="pi pi-arrow-left"></i> Volver
            </button>
            <button type="submit" class="reg-btn reg-btn--primary">
                Finalizar configuración <i class="pi pi-arrow-right"></i>
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
            box-shadow: 0 0 0 3px rgba(var(--hos-accent-rgb),.13);
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
            box-shadow: 0 4px 12px rgba(var(--hos-accent-rgb),.15);
        }
        .reg-module.is-on {
            border-color: var(--hos-primary);
            background: var(--hos-primary-soft);
            color: var(--hos-primary);
            box-shadow: 0 0 0 3px rgba(var(--hos-accent-rgb),.12);
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
            box-shadow: 0 0 0 8px rgba(var(--hos-accent-rgb),.08);
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
        .app-dark .reg-eyebrow { border-color: rgba(var(--hos-accent-rgb),.35); }
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
        .app-dark .reg-pill { border-color: rgba(var(--hos-accent-rgb),.35); }

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

    form1!: FormGroup;
    form2!: FormGroup;

    savedModules: string[] = [];
    private savedStep1!: OnboardingStep1Data;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        this.form1 = this.fb.group(
            {
                firstName:       ['', Validators.required],
                lastName:        ['', Validators.required],
                email:           ['', [Validators.required, Validators.email]],
                password:        ['', [Validators.required, Validators.minLength(8)]],
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
            role:         ['', Validators.required],
            modules:      [[] as string[], atLeastOneModuleValidator],
        });
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

    // ── Paso 1 → Paso 2 ──────────────────────────────────────────────────────
    onStep1Submit(): void {
        this.s1 = true;
        this.form1.markAllAsTouched();
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
        /* eslint-disable @typescript-eslint/no-unused-vars */
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

        /*
         * ─────────────────────────────────────────────────────────
         * TODO — Integración backend (pendiente)
         * ─────────────────────────────────────────────────────────
         * Cuando el backend esté disponible, reemplazar este bloque:
         *
         *   this.authService.register(this.savedStep1, step2Data).subscribe({
         *     next:  () => { this.savedModules = v.modules; this.completed = true; },
         *     error: (err) => { ... manejar error ... }
         *   });
         *
         * Datos listos para enviar:
         *   - this.savedStep1  → UserCredentials + termsAccepted
         *   - step2Data        → PropertyConfiguration (incluye category, aunque
         *                        no esté en el modelo actual — se puede extender)
         * ─────────────────────────────────────────────────────────
         */

        this.savedModules = v.modules;
        this.completed = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ════════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-forgot',
    standalone: true,
    imports: [RouterModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-key"
            eyebrow="Recuperación de acceso"
            title="¿Olvidaste tu contraseña?"
            subtitle="Te enviamos un enlace seguro para restablecerla."
        >
            <form (ngSubmit)="submit()">
                <div class="gos-field">
                    <label for="forgot-email">Email</label>
                    <input id="forgot-email" type="email" class="gos-input" placeholder="tu@hotel.com" />
                </div>
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block">Enviar enlace <i class="pi pi-send"></i></button>
            </form>
            <p class="auth-foot">
                <a class="gos-link" routerLink="/account/login"><i class="pi pi-arrow-left"></i> Volver a iniciar sesión</a>
            </p>
        </gos-auth-card>
    `
})
export class ForgotPasswordPage {
    submit(): void {
        alert('Demo: enviamos el correo con el enlace de restablecimiento.');
    }
}

// ════════════════════════════════════════════════════════════════════════════
// RESET PASSWORD
// ════════════════════════════════════════════════════════════════════════════
@Component({
    selector: 'account-reset',
    standalone: true,
    imports: [RouterModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-key"
            eyebrow="Nueva contraseña"
            title="Restablece tu contraseña"
            subtitle="Elige una contraseña nueva y segura."
        >
            <form (ngSubmit)="submit()">
                <div class="gos-field">
                    <label for="reset-pass">Nueva contraseña</label>
                    <input id="reset-pass" type="password" class="gos-input" placeholder="Mínimo 8 caracteres" />
                </div>
                <div class="gos-field">
                    <label for="reset-pass2">Confirma la contraseña</label>
                    <input id="reset-pass2" type="password" class="gos-input" placeholder="Repite la contraseña" />
                </div>
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block">Guardar contraseña <i class="pi pi-check"></i></button>
            </form>
            <p class="auth-foot">
                <a class="gos-link" routerLink="/account/login"><i class="pi pi-arrow-left"></i> Volver a iniciar sesión</a>
            </p>
        </gos-auth-card>
    `
})
export class ResetPasswordPage {
    submit(): void {
        alert('Demo: contraseña restablecida, ya puedes iniciar sesión.');
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
    imports: [RouterModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-lock"
            eyebrow="Pantalla bloqueada"
            title="Sesión bloqueada"
            subtitle="Ingresa tu contraseña para continuar."
        >
            <form (ngSubmit)="submit()">
                <div class="gos-field">
                    <label for="lock-pass">Contraseña</label>
                    <input id="lock-pass" type="password" class="gos-input" placeholder="••••••••" />
                </div>
                <button type="submit" class="gos-btn gos-btn--primary gos-btn--block">Desbloquear <i class="pi pi-unlock"></i></button>
            </form>
            <p class="auth-foot">
                <a class="gos-link" routerLink="/account/login">Entrar con otra cuenta</a>
            </p>
        </gos-auth-card>
    `
})
export class LockScreenPage {
    submit(): void {
        alert('Demo: en el MVP real aquí se valida y se restaura la sesión.');
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
    imports: [RouterModule, GosAuthCard],
    template: `
        <gos-auth-card
            icon="pi pi-compass"
            eyebrow="Error 404"
            title="Página no encontrada"
            subtitle="La página que buscas no existe o fue movida."
        >
            <div class="auth-grid-2" style="gap: 12px">
                <a class="gos-btn gos-btn--primary gos-btn--block" routerLink="/">Ir al inicio <i class="pi pi-home"></i></a>
            </div>
        </gos-auth-card>
    `
})
export class NotFoundPage {}

@Component({
    selector: 'account-500',
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
