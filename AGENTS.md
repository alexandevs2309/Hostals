# AGENTS.md — AURON Hospitality OS (frontend)

## Contexto del proyecto
SPA Angular 21 (standalone + signals, PrimeNG Aura/teal, Tailwind 4, layout Sakai) para un PMS hotelero multi-tenant.
Backend .NET 8 + EF Core + Postgres en `../hospitality-backend-main/hospitality-backend-main` (contenedor `hospitality-api`, puerto 5000).

## Plan vivo (LEER ANTES DE TRABAJAR)
- **`docs/PLAN-UX-UI.md`** — plan de transformación UX/UI con checkboxes, criterios de aceptación y registro de cambios.
- Antes de una tarea: marcar `[~]`. Al validar el criterio: `[x]` + actualizar la tabla de progreso (§3) + añadir fila en el registro (§10).
- No iniciar una ola sin cerrar la anterior (salvo hotfix).

## Reglas
1. Una sola fuente de verdad de diseño: tokens `--hos-*` sobre PrimeNG. Prohibido hex sueltos en componentes.
2. No copiar marca/colores/código de competidores; solo patrones de UX.
3. No romper funcionalidad existente; verificar por pantalla.
4. Clasificar hallazgos como REAL / PARCIAL / MOCK / NO IMPLEMENTADO / DESCONOCIDO.
5. No commitear a menos que se pida explícitamente.

## Comandos
- Dev: `npx ng serve` (usa `src/environments/environment.ts` → `localhost:5000`).
- Build dev: `npx ng build --configuration development`.
- Build prod: `npx ng build --configuration production` (usa `environment.prod.ts` vía `fileReplacements`; requiere internet para inlining de fuentes).
- Lint: `npx ng lint` (si aplica).

## Estado actual
- Ola 0 (hotfix de producción) completada: CSP de prod, `fileReplacements` en `angular.json`, URL del widget parametrizada, favicon propio.
- Ola 1 (fundación de diseño) completada: tokens `--hos-*` mapeados a PrimeNG, dark mode automático, tipografía unificada, Settings migrado y Hotel eliminado (redirect). Guía: `docs/DESIGN-TOKENS.md`.
- Ola 2 (purga y desduplicación) completada: residuo Sakai eliminado (uikit/pages/crud/empty/notfound/auth/landing/coming-soon/docs, widgets dashboard dead, servicios demo, `assets/demo`, `public/demo`); `HotelService.resolveActiveHotel()` centralizado en 14 páginas; política consistente de guards (hotel+rol) en `src/app.routes.ts`.
- Ola 3 (coherencia UX) completada: confirmaciones destructivas unificadas (confirmDialog global), Analytics corregido, moneda paramétrica (`src/app/shared/utils/money.ts` + `auth_hotel_currency`), filtros/search de Finance y Guests conectados (no-ops eliminados), KPIs sobre totales server-side (reservations `loadCounts`, guests `totalCount`), `aria-label` en cierres de modal, tablas con `overflow-x`+`min-width`, estados skeleton/empty/error auditados.
- Siguiente: Fase 4 completa (T4.1–T4.6). T4.5 (integraciones reales OTA/pagos) implementada con libertad delegada: StripeGateway HTTP real (api.stripe.com, activo con Payments:StripeSecretKey sk_); Azul/CardNet simuladores (IsLive=false); BookingComAdapter/ExpediaAdapter reescritos a HTTP real fail-fast (ChannelManager:BookingCom:Username/Secret/PropertyId, ChannelManager:Expedia:ApiKey/HotelId); DTOs con IsLive/Mode; badge UI en channels. Clasificación: Stripe REAL, OTA PARCIAL (requiere credenciales reales), Azul/CardNet SIMULADORES. Mensajería (AutomationService) documentada out-of-scope. Builds backend+frontend verdes.
- Fase 2 (Foundation del sistema visual) completada: tokens y primitivas centrales `hos-*` en `src/assets/hospitality.scss` (escala tipográfica, espaciado `--hos-space-1..9`, radio canónico, elevación none/sm/md/lg, densidad compact/default/comfortable, estados de dominio PMS + softs, focus ring; primitivas hos-page/section/metric/panel/btn/field/table/badge/status-dot/modal/toast/empty/error/skel/chart/filterbar/tabs). Sin migrar páginas todavía; el Dashboard es la siguiente referencia visual (F3) y después la migración por prioridad (F4). Detalle en `docs/DESIGN-TOKENS.md` §6 y trazable en §10 del plan.
- Fase 3 (Dashboard) completada: `dashboard.ts` ahora usa `dashboard.html`+`dashboard.scss` (template y CSS ya no inline); jerarquía L1/L2/L3/L4 con primitivas `hos-metric--primary/--secondary`, `hos-panel`, `hos-status-dot`/`hos-badge` semánticos, `hos-chart`, `hos-table`; eliminados hover-lift y colores inline (hex/rgba) del Dashboard; refresh 60s, servicios y cálculos intactos. Pendiente: migración de las demás páginas (F4, espera autorización).
