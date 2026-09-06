import { Injectable, inject, computed } from '@angular/core';
import { LayoutService } from '@/app/layout/service/layout.service';

const STORAGE_KEY = 'hos-dark-mode';
const PALETTE_KEY = 'hos-palette';

export interface HosPalette {
    name: string;
    hex: string;
    rgb: string;
}

export const HOS_PALETTES: HosPalette[] = [
    { name: 'emerald', hex: '#10b981', rgb: '16 185 129' },
    { name: 'green', hex: '#22c55e', rgb: '34 197 94' },
    { name: 'lime', hex: '#84cc16', rgb: '132 204 22' },
    { name: 'orange', hex: '#f97316', rgb: '249 115 22' },
    { name: 'amber', hex: '#f59e0b', rgb: '245 158 11' },
    { name: 'yellow', hex: '#eab308', rgb: '234 179 8' },
    { name: 'teal', hex: '#14b8a6', rgb: '20 184 166' },
    { name: 'cyan', hex: '#06b6d4', rgb: '6 182 212' },
    { name: 'sky', hex: '#0ea5e9', rgb: '14 165 233' },
    { name: 'blue', hex: '#3b82f6', rgb: '59 130 246' },
    { name: 'indigo', hex: '#6366f1', rgb: '99 102 241' },
    { name: 'violet', hex: '#8b5cf6', rgb: '139 92 246' },
    { name: 'purple', hex: '#a855f7', rgb: '168 85 247' },
    { name: 'fuchsia', hex: '#d946ef', rgb: '217 70 239' },
    { name: 'pink', hex: '#ec4899', rgb: '236 72 153' },
    { name: 'rose', hex: '#f43f5e', rgb: '244 63 94' },
    { name: 'noir', hex: '#0f172a', rgb: '15 23 42' }
];

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private layoutService = inject(LayoutService);

    readonly isDark = computed(() => this.layoutService.isDarkTheme());

    readonly palettes = HOS_PALETTES;

    private paletteName = 'teal';

    constructor() {
        const savedDark = localStorage.getItem(STORAGE_KEY);
        if (savedDark !== null) {
            const dark = savedDark === 'true';
            if (dark !== this.layoutService.layoutConfig().darkTheme) {
                this.toggleDarkMode(dark);
            }
        }

        const savedPalette = localStorage.getItem(PALETTE_KEY);
        if (savedPalette !== null && HOS_PALETTES.some((p) => p.name === savedPalette)) {
            this.applyPalette(savedPalette);
        } else {
            this.applyPalette('teal');
        }
    }

    palette(): string {
        return this.paletteName;
    }

    setPalette(name: string): void {
        if (!HOS_PALETTES.some((p) => p.name === name)) {
            return;
        }
        this.applyPalette(name);
    }

    clearPalette(): void {
        this.setPalette('teal');
    }

    private applyPalette(name: string): void {
        const palette = HOS_PALETTES.find((p) => p.name === name);
        if (!palette) {
            return;
        }

        this.paletteName = name;
        localStorage.setItem(PALETTE_KEY, name);

        const root = document.documentElement;
        root.style.setProperty('--hos-brand', palette.hex);
        root.style.setProperty('--hos-accent-rgb', palette.rgb);
    }

    toggleDarkMode(force?: boolean): void {
        const next = force ?? !this.layoutService.layoutConfig().darkTheme;
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: next }));
        localStorage.setItem(STORAGE_KEY, String(next));
    }
}