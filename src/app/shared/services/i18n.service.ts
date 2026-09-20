import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type LangCode = 'es' | 'en';

export type I18nDict = Record<string, string>;

const ES: I18nDict = {
    'brand.hospitality': 'Hospitality',
    'brand.os': 'OS',

    'nav.dashboard': 'Dashboard',
    'nav.onboarding': 'Puesta en marcha',
    'nav.channels': 'Canales y ventas',
    'nav.workflows': 'Automatización',
    'nav.section.operation': 'Operación',
    'nav.reservations': 'Reservaciones',
    'nav.calendar': 'Calendario',
    'nav.rooms': 'Habitaciones',
    'nav.roomTypes': 'Tipos de habitación',
    'nav.websites': 'Sitios Web',
    'nav.rates': 'Tarifas',
    'nav.guests': 'Huéspedes',
    'nav.housekeeping': 'Housekeeping',
    'nav.maintenance': 'Mantenimiento',
    'nav.section.finance': 'Finanzas',
    'nav.finance': 'Finanzas',
    'nav.analytics': 'Analytics',
    'nav.section.account': 'Mi cuenta',
    'nav.security': 'Seguridad',
    'nav.organization': 'Organización',
    'nav.section.system': 'Sistema',
    'nav.audit': 'Auditoría',
    'nav.settings': 'Configuración',
    'nav.soon': 'Pronto',
    'nav.switchProperty': 'Cambiar de propiedad',
    'nav.roomsCount': '{count} habitaciones',
    'nav.noProperty': 'Sin propiedad',
    'nav.noPropertyConfig': 'Sin propiedad configurada',
    'nav.pendingLoad': 'Pendiente de cargar',
    'nav.user': 'Usuario',
    'nav.teamRole': 'Miembro del equipo',
    'nav.signOut': 'Cerrar sesión',
    'nav.mainNav': 'Menú principal',
    'nav.soonSuffix': '{label} (próximamente)',

    'topbar.module': 'Dashboard',
    'topbar.search': 'Buscar',
    'topbar.notifications': 'Notificaciones',
    'topbar.toggleMenu': 'Menú',
    'theme.light': 'Modo claro',
    'theme.dark': 'Modo oscuro',

    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
    'footer.demo': 'Demo',

    'lang.es': 'Español',
    'lang.en': 'English',

    'auth.login.eyebrow': 'Bienvenido de nuevo',
    'auth.login.title': 'Inicia sesión en {app}',
    'auth.login.subtitle': 'Accede a la plataforma de tu hospitalidad.',
    'auth.login.email': 'Email',
    'auth.login.password': 'Contraseña',
    'auth.login.forgot': '¿Olvidaste tu contraseña?',
    'auth.login.submit': 'Entrando',
    'auth.login.sep': 'o continúa con',
    'auth.login.noAccount': '¿Aún no tienes cuenta?',
    'auth.login.create': 'Crea una gratis',
    'auth.login.missing': 'Introduce tu email y contraseña.'
};

const EN: I18nDict = {
    'brand.hospitality': 'Hospitality',
    'brand.os': 'OS',

    'nav.dashboard': 'Dashboard',
    'nav.onboarding': 'Getting started',
    'nav.channels': 'Channels & sales',
    'nav.workflows': 'Automation',
    'nav.section.operation': 'Operations',
    'nav.reservations': 'Reservations',
    'nav.calendar': 'Calendar',
    'nav.rooms': 'Rooms',
    'nav.roomTypes': 'Room types',
    'nav.websites': 'Websites',
    'nav.rates': 'Rates',
    'nav.guests': 'Guests',
    'nav.housekeeping': 'Housekeeping',
    'nav.maintenance': 'Maintenance',
    'nav.section.finance': 'Finance',
    'nav.finance': 'Finance',
    'nav.analytics': 'Analytics',
    'nav.section.account': 'My account',
    'nav.security': 'Security',
    'nav.organization': 'Organization',
    'nav.section.system': 'System',
    'nav.audit': 'Audit',
    'nav.settings': 'Settings',
    'nav.soon': 'Soon',
    'nav.switchProperty': 'Switch property',
    'nav.roomsCount': '{count} rooms',
    'nav.noProperty': 'No property',
    'nav.noPropertyConfig': 'No property configured',
    'nav.pendingLoad': 'Pending to load',
    'nav.user': 'User',
    'nav.teamRole': 'Team member',
    'nav.signOut': 'Sign out',
    'nav.mainNav': 'Main menu',
    'nav.soonSuffix': '{label} (coming soon)',

    'topbar.module': 'Dashboard',
    'topbar.search': 'Search',
    'topbar.notifications': 'Notifications',
    'topbar.toggleMenu': 'Menu',
    'theme.light': 'Light mode',
    'theme.dark': 'Dark mode',

    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.demo': 'Demo',

    'lang.es': 'Español',
    'lang.en': 'English',

    'auth.login.eyebrow': 'Welcome back',
    'auth.login.title': 'Sign in to {app}',
    'auth.login.subtitle': 'Access your hospitality platform.',
    'auth.login.email': 'Email',
    'auth.login.password': 'Password',
    'auth.login.forgot': 'Forgot your password?',
    'auth.login.submit': 'Signing in',
    'auth.login.sep': 'or continue with',
    'auth.login.noAccount': "Don't have an account yet?",
    'auth.login.create': 'Create one for free',
    'auth.login.missing': 'Enter your email and password.'
};

const DICTS: Record<LangCode, I18nDict> = { es: ES, en: EN };

@Injectable({
    providedIn: 'root'
})
export class I18nService {
    private readonly doc = inject(DOCUMENT);
    private readonly lang = signal<LangCode>(this.load());

    readonly current = this.lang.asReadonly();

    constructor() {
        this.doc.documentElement.setAttribute('lang', this.lang() === 'en' ? 'en' : 'es');
    }

    t(key: string): string {
        const dict = DICTS[this.lang()];
        return dict[key] ?? ES[key] ?? key;
    }

    tp(key: string, params: Record<string, string | number>): string {
        let out = this.t(key);
        for (const [k, v] of Object.entries(params)) {
            out = out.replaceAll(`{${k}}`, String(v));
        }
        return out;
    }

    setLocale(locale: LangCode): void {
        this.lang.set(locale);
        localStorage.setItem('auth_locale', locale);
        this.doc.documentElement.setAttribute('lang', locale === 'en' ? 'en' : 'es');
    }

    cycle(): void {
        this.setLocale(this.lang() === 'es' ? 'en' : 'es');
    }

    isEn(): boolean {
        return this.lang() === 'en';
    }

    private load(): LangCode {
        const saved = localStorage.getItem('auth_locale');
        return saved === 'en' || saved === 'es' ? saved : 'es';
    }
}