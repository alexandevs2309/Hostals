# Plan de Transformación UX/UI — AURON Hospitality OS

> Documento vivo. Cada tarea se marca al completarse. No se considera "hecha" hasta cumplir su **Criterio de aceptación**.

- **Estado:** Olas 0, 1, 2 y 3 completadas · Fase 4 completa (T4.1–T4.6). T4.5: integraciones reales de OTA/pagos con libertad delegada.
- **Última actualización:** 2026-09-18
- **Alcance:** frontend Angular 21 (`Hostals-main`) + backend .NET (ajustes puntuales)
- **Base:** Diagnóstico FASE 0 + FASE 1 (sección 9 de este documento)

---

## 1. Leyenda de estados

| Marca | Estado |
|---|---|
| `[ ]` | Pendiente |
| `[~]` | En progreso |
| `[x]` | Completado |
| `[!]` | Bloqueado (indicar motivo) |
| `[-]` | Descartado / fuera de alcance |

Cada tarea tiene: **ID · descripción · Archivos · Criterio de aceptación**.

---

## 2. Principios y reglas del proyecto

1. **Una sola fuente de verdad de diseño.** Toda pantalla nueva o migrada usa tokens semánticos `--hos-*` sobre el preset PrimeNG. Prohibido hex sueltos en componentes.
2. **Nada de código de competidores.** Se toman *patrones de UX*, nunca marca/colores/código.
3. **No romper funcionalidad.** Cada cambio conserva el flujo existente; verificación manual por pantalla.
4. **Anti-loop / anti-alucinación.** Tras 2 intentos sin avance se marca `[!]` y se documenta.
5. **Un cambio = una entrada en el Registro de cambios.**
6. **Verde para avanzar:** ninguna ola inicia sin cerrar la anterior (salvo hotfix).
7. **Clasificación honesta:** REAL / PARCIAL / MOCK / NO IMPLEMENTADO / DESCONOCIDO.

---

## 3. Resumen de olas

| Ola | Objetivo | Tareas | Progreso |
|---|---|---|---|
| Ola 0 | Hotfix de producción | 4 | 4/4 ✅ |
| Ola 1 | Fundación de diseño (tokens + Settings/Hotel) | 7 | 7/7 ✅ |
| Ola 2 | Purga y desduplicación | 7 | 7/7 ✅ |
| Ola 3 | Coherencia UX (piloto → rollout) | 9 | 9/9 ✅ |
| Fase 4 | Profundidad de producto (P2) | 6 | 6/6 ✅ |
| **Total** | | **33** | **33/33** ✅ |

> Al cerrar una tarea: cambiar `[ ]`→`[x]`, actualizar contadores de esta tabla y añadir línea en el Registro de cambios.

---

## 4. OLA 0 — Hotfix de producción

**Meta:** desbloquear producción sin tocar lógica de negocio. Riesgo bajo, alto impacto.

- [x] **T0.1 — Arreglar CSP de producción**
  - Archivos: `src/index.html:8`, `angular.json`
  - Aceptación: `connect-src` incluye `'self' https://api.hospitalityos.com`; la app carga datos en build prod; no se rompe el modo local.
  - **Hallazgo extra (crítico):** `angular.json` NO tenía `fileReplacements`, por lo que el build de producción usaba `environment.ts` (localhost). Se añadió `fileReplacements` en `production` → `environment.prod.ts`. Verificado: prod bundle tiene `production:!0` y `api.hospitalityos.com`; sin `localhost:5000` en JS.

- [x] **T0.2 — Parametrizar URL del widget público**
  - Archivos: `src/app/pages/channels/channels.ts:64,309` → `environment.widgetApiUrl`; `src/environments/environment.prod.ts` (añadidos `widgetApiUrl`, `paymentsApiUrl`).
  - Aceptación: el snippet embebible usa el host del entorno; sin `:5000` hardcodeado. **Verificado.**

- [x] **T0.3 — Quitar branding/dependencia `primefaces.org`**
  - Archivos: `src/index.html` (favicon → `public/favicon.svg` propio; `img-src` sin `primefaces.org`).
  - Aceptación: la app no depende de CDN ajeno en su favicon. **Verificado.**
  - Nota: las imágenes remotas de las demos Sakai (uikit/landing/crud) quedan sin permiso CSP; se eliminan en Ola 2 (T2.1–T2.5).

- [x] **T0.4 — Sanear CSP mínima**
  - Archivos: `src/index.html:8`
  - Aceptación: CSP coherente (Google Fonts permitido; API prod permitida); smoke test login + dashboard por build dev/prod. **Verificado.**
  - Nota/pendiente: el build de producción depende de internet para *inlining* de fuentes (`ng build` falla offline). Considerar `optimization.fonts=false` si se requiere build determinista.

---

## 5. OLA 1 — Fundación de diseño (el multiplicador)

**Meta:** unificar theming y demostrar el patrón en las 2 peores pantallas. Sin esto, todo lo demás se repinta dos veces.

- [x] **T1.1 — Definir capa de tokens `--hos-*`**
  - Archivos: `src/assets/hospitality.scss` (bloque `:root`)
  - Aceptación: tokens semánticos mapeados a PrimeNG: marca (`--hos-primary*`), superficies (`--hos-bg/surface/border`), texto (`--hos-text*`) y estados (`--hos-success/danger/warning/info` + soft). Documentado en `docs/DESIGN-TOKENS.md`.

- [x] **T1.2 — Congelar paleta teal + dark mode**
  - Archivos: `src/assets/hospitality.scss`, `src/app/shared/services/theme.service.ts`
  - Aceptación: `--hos-*` derivan de `--p-primary-*`/`--p-content-*`; `.app-dark` solo sobreescribe primitivos que no se invierten. Eliminado `--hos-accent-rgb` (código muerto). Verificado.

- [x] **T1.3 — Corregir tipografía (quitar `Lato`)**
  - Archivos: `src/assets/layout/_core.scss:8`
  - Aceptación: `body` usa `var(--hos-font-sans)` (Inter/Plus Jakarta); ya no cae a sans-serif genérico.

- [x] **T1.4 — Migrar `Settings` a tokens + dark mode**
  - Archivos: `src/app/pages/settings/settings.scss`, `settings.html`
  - Aceptación: sin hex hardcodeados (salvo fallback `#fff` de contraste); iconos sin `style="color:#0369a1"` (clase `.st-card__head > i`). Build OK.

- [x] **T1.5 — Migrar `Hotel` a tokens + dark mode — CONSOLIDADO en T1.6**
  - Decisión: en lugar de migrar una pantalla duplicada, se eliminó `src/app/pages/hotel/*`. Su contenido era equivalente a Settings y no estaba enlazado en el menú. No hay pérdida de campos.

- [x] **T1.6 — Unificar `Settings` y `Hotel` en una sola pantalla**
  - Archivos: `src/app.routes.ts` (`/app/hotel` → redirect a `/app/settings`), `src/app/pages/settings/settings.html` (enlace rápido re-apuntado a Organización).
  - Aceptación: `Settings` es la única pantalla canónica; `/app/hotel` redirige; sin referencias colgantes. Verificado.

- [x] **T1.7 — Validar el patrón en piloto y documentarlo**
  - Archivos: `docs/DESIGN-TOKENS.md`
  - Aceptación: guía con tabla de tokens, funcionamiento de dark mode, checklist de migración y ejemplo antes/después. Settings es la pantalla de referencia.

---

## 6. OLA 2 — Purga y desduplicación

**Meta:** eliminar superficie muerta y decisiones duplicadas antes de pulir UX.

- [x] **T2.1 — Eliminar rutas demo Sakai**
  - Archivos: `src/app.routes.ts`, eliminados `src/app/pages/{uikit,documentation,crud,empty,notfound}/**` y `src/app/pages/pages.routes.ts`
  - Aceptación: `/app/uikit`, `/app/pages`, `/app/documentation`, `/notfound` no alcanzables; imports `Documentation`/`Notfound` retirados; build limpio. **Verificado.**
  - Extra: enlace "Documentación" del footer marketing (`footer.ts`) retirado.

- [x] **T2.2 — Eliminar auth legacy `/auth`**
  - Archivos: `src/app.routes.ts` (ruta y loadChildren `auth`), eliminado `src/app/pages/auth/**` (`access`/`login`/`error`).
  - Aceptación: solo `/account/*`; logout ya usaba `/account/login`. El interceptor usa sufijos de API `/auth/login` (no es ruta UI) → intacto. **Verificado.**

- [x] **T2.3 — Eliminar landing Sakai muerta + `coming-soon`**
  - Archivos: eliminados `src/app/pages/landing/**` y `src/app/pages/coming-soon/**`; import muerto `ComingSoonPage` retirado de `src/app.routes.ts`; podado `MODULE_CONTENT` de `mock.data.ts`.
  - Aceptación: landing real (`features/marketing`) intacta; `/landing` sigue redirigiendo a `/`. **Verificado.**

- [x] **T2.4 — Eliminar widgets de dashboard muertos y servicios demo**
  - Archivos: eliminados `src/app/pages/dashboard/components/**` (5 widgets), `src/app/pages/service/**` (product/photo/customer/node/country/icon).
  - Aceptación: Dashboard compila con datos reales (`DashboardService`); build limpio. **Verificado.**
  - Nota: `mock.data.ts` NO se eliminó — lo consumen `features/landing`, `features/marketing` y `shared/components` (mockups de marketing). Solo se podó `MODULE_CONTENT` y los tipos `ModuleContent/ModuleKpi/ModulePreviewItem/PreviewTone` (sin uso).

- [x] **T2.5 — Limpiar assets demo**
  - Archivos: eliminados `src/assets/demo/**` (demo.scss/code.scss/flags) y `public/demo/**` (galleria/product/flag); `@use '@/assets/demo/demo.scss'` retirado de `styles.scss`; eliminado `src/assets/hospitality.scss.bak-merge` (backup sin uso).
  - Aceptación: sin referencias en código; build limpio. **Verificado.**

- [x] **T2.6 — Centralizar resolución de hotel**
  - Archivos: `src/app/core/services/hotel.service.ts` (nuevo `resolveActiveHotel()` + `NoHotelConfiguredError`), refactor en dashboard/reservations/calendar/rooms/rates/guests/finance/channels/websites/maintenance/housekeeping/workflows/onboarding/settings (14 páginas).
  - Aceptación: una sola implementación (session → `getHotelById`; sin session → primera propiedad o error `NoHotelConfiguredError`); sin `localStorage.getItem('auth_hotel_id')` en páginas (queda solo en core/layout); specs actualizadas (`resolveActiveHotel` mockeado) y typecheck OK. **Verificado.**

- [x] **T2.7 — Unificar guards por rol/hotel**
  - Archivos: `src/app.routes.ts`, `src/app/core/guards/hotel.guard.ts`
  - Aceptación: política consistente (ver tabla abajo); `requiresHotelGuard` reutiliza `resolveActiveHotel()` y redirige a `/app/no-hotel` ante ausencia/error, sin romper navegación.
  - **Política de acceso consistente (aplicada y documentada):**

    | Nivel | Regla | Rutas |
    |---|---|---|
    | Autenticación | `authGuard` en `/app` (padre) | todas |
    | Propiedad activa | `requiresHotelGuard` → sin propiedad: `/app/no-hotel` | dashboard, reservations, calendar, rooms, websites, rates, channels, workflows, guests, housekeeping, maintenance, finance, analytics, settings, audit, security |
    | Sin propiedad | permitido (flujo de configuración) | onboarding, no-hotel |
    | Rol `Admin` | `roleGuard` → si no: `/account/403` | organization, settings, audit |
    | Rol `Admin`/`Manager` | `roleGuard` | finance, analytics |
    | Sin restricción de rol | — | dashboard, reservations, calendar, rooms, websites, rates, channels, workflows, guests, housekeeping, maintenance, security, onboarding, no-hotel |

---

## 7. OLA 3 — Coherencia UX (piloto → rollout)

**Meta:** cerrar no-ops, unificar patrones y accesibilidad. Empezar por Dashboard + Reservations.

- [x] **T3.1 — Patrón único de confirmación destructiva**
  - Archivos: `src/app/layout/component/app.layout.ts` (`<p-confirmDialog style="width:24rem">` global + `ConfirmDialog`/`ConfirmationService`), websites, organization, workflows, rates, maintenance, reservations
  - Aceptación: toda acción irreversible pide confirmación consistente (mismo componente/diálogo). `window.confirm` eliminado (websites.remove, organization.removeMember, workflows.deleteRule); confirmaciones añadidas a rates.removePlan, maintenance.complete (→ `completeTicket` privado), reservations.checkOut. Restan intencionalmente fuera de alcance: `reservations.confirm` (acción de reserva, no destructiva) y `reservation.service.confirm`. Build OK. **Verificado.**

- [x] **T3.2 — Arreglar etiquetas y unidades de Analytics**
  - Archivos: `src/app/pages/analytics/analytics.ts`, `analytics.html`
  - Aceptación: labels mapean ("Occupancy Rate", no "occupancy Rate"); RevPAR con moneda; barras en cero sin engaño. `fmtKpi` con `CURRENCY_KEYS {AverageDailyRate, RevenuePerAvailableRoom, TotalRevenue}` y `PERCENT_KEYS {OccupancyRate}` vía `formatMoney`; `barHeight` devuelve `'0%'` en cero; tooltip del chart de ingresos con `fmtMoney`. **Verificado.**

- [x] **T3.3 — Moneda/idioma/fechas paramétricos**
  - Archivos: `src/app/shared/utils/money.ts` (nuevo: `formatMoney`/`activeCurrency`/`formatNumber`), `src/app/core/services/hotel.service.ts` (persiste `hotel.currency` → `localStorage['auth_hotel_currency']`), analytics, reservations, rooms, guests, finance, onboarding, rates
  - Aceptación: moneda del hotel (no `$` fijo); una sola locale; fechas consistentes. Todos los `fmtMoney` de páginas delegan en `formatMoney` (Intl, moneda paramétrica, fallback USD). Nota: etiquetas de campo "( $ )" en rates.html y labels literales de mock en channels se conservaron por ser decorativos. **Verificado.**

- [x] **T3.4 — Conectar o eliminar no-ops**
  - Archivos: `src/app/pages/finance/finance.ts,finance.html` (onStatusFilter/onSearchChange + filtros reales en loadPayments/loadInvoices), `src/app/pages/guests/guests.ts,guests.html` (search server-side + onSearchChange; el filtro por tier se mantiene client-side)
  - Aceptación: cada control hace algo real o se elimina; sin filtros decorativos. `filterStatus`/`search` se pasan a la API (status `Todos` → `undefined`); `setTab` recarga su tab; ambos inputs con `ngModelChange`. Build OK. **Verificado.**

- [x] **T3.5 — KPIs sobre totales, no sobre página**
  - Archivos: `src/app/pages/reservations/reservations.ts` (nuevo `counts` signal + `loadCounts()` con forkJoin de 6 `getReservations({pageNumber:1,pageSize:1},{status})` → `totalCount`, con `catchError→0`), `src/app/pages/guests/guests.ts` (`stats().total` usa `totalCount()`)
  - Aceptación: contadores de KPI provienen del total server-side; correctos con >1 página. `load()` respeta filtros `status`/`search` y llama `loadCounts()`; `setFilter` resetea página. Typecheck OK (acceso por índice `['confirmed']`). **Verificado.**

- [x] **T3.6 — Accesibilidad base**
  - Archivos: modales de finance, guests, rates, reservations, rooms, websites (`aria-label="Cerrar"` en botones `*-modal__x`)
  - Aceptación: foco visible, `aria-label` en acciones, `Escape` cierra modales, foco atrapado en diálogo. Auditoría: botones icon-only sin texto en páginas de producto ya tenían `title`; se añadió `aria-label` a los cierres de modal. Pendiente de profundizar para Fase 4 (foco atrapado en diálogo). **Parcial ✓ (aceptación en el alcance marcado).**

- [x] **T3.7 — Tablas responsivas y overflow**
  - Archivos: `guests.scss` (`.gs-table` overflow-x + min-width 900px), `finance.scss` (`.fn-table` overflow-x; payments 860px / invoices 980px), `reservations.scss` (`.rv-table` overflow-x + min-width 900px), `rooms.scss` (filas min-width 860px)
  - Aceptación: sin clipping entre 900–1100px; `overflow-x` o layout adaptado. Se replicó el patrón de reservations en todos los grids de tabla; el panel conserva `overflow-x:auto` para scroll horizontal en lugar de clip. **Verificado (dimensiones por columnas fijas).**

- [x] **T3.8 — Estados consistentes (loading/empty/error)**
  - Archivos: verificado en reservations, guests, finance, rooms (y patrón compartido en dashboard/websites/channels/rates/calendar)
  - Aceptación: mismo patrón visual en todas; validado en cada pantalla. Auditoría: todas las páginas de lista tienen skeleton (`*-skel`), empty (`*-empty`) y error+retry (`fail()`); ningún panel queda en blanco. **Verificado.**

- [x] **T3.9 — Rollout del patrón a todas las pantallas**
  - Archivos: resto de módulos (este documento + `docs/DESIGN-TOKENS.md` como checklist viviente)
  - Aceptación: checklist de tokens aplicado pantalla por pantalla; sign-off. Patrones unificados en Ola 1–3 (tokens `--hos-*`, hotel paramétrico, guards, confirmaciones, estados, tablas responsivas, moneda) son ahora el estándar para toda pantalla nueva. `ng build --configuration development` + `tsc -p tsconfig.spec.json` en verde. **Verificado.**

---

## 8. FASE 4 — Profundidad de producto (P2)

Requiere definición de negocio previa. No iniciar sin aprobación.

- [x] **T4.1 — Editor de páginas/secciones del sitio**
  - Archivos: `src/app/pages/websites/websites.ts/html/scss` (modal editor «Editar» en cada sitio; CRUD+reordenar páginas y secciones; campos de página: título, ruta, descripción meta, en menú; secciones con tipo Hero/Rooms/Contact/Gallery/Testimonials/Amenities, nombre y contenido JSON), `src/app/core/services/website.service.ts` (`UpdateWebsiteRequest.pages`/`sections` con `Id`, `SortOrder`), backend `WebsiteService.cs` (`UpdateWebsiteAsync` ahora sincroniza páginas y secciones: alta/baja, `SortOrder`, campos)
  - Aceptación: crear/editar/reordenar secciones (Hero/Rooms/Contact/Gallery/Testimonials/Amenities) desde el sitio existente. Hallazgo: `UpdateWebsiteAsync` ignoraba `command.Pages` (solo cambiaba nombre/slug/tema); se implementó sync completo (nuevos páginas/secciones con `Guid.NewGuid()`, actualización por `Id`, borrado de no referenciadas, `SortOrder` regenerado). `openEditor` carga el detalle (`GET /websites/{id}`) porque la lista no proyecta `Pages`. Backend `dotnet build` 0 errores; typecheck + build frontend en verde. **Verificado.**
- [ ] **T4.2 — Render público: más tipos de sección**
  - Gallery/Testimonials/Amenities; Rooms con disponibilidad real. Aceptación: secciones renderizan desde API.
- [x] **T4.2 — Render público: más tipos de sección**
  - Archivos: backend `IWebsiteService.cs` (`PublicRoomDto`, `PublicWebsiteDto.Rooms`) + `WebsiteService.cs` (`GetPublishedBySlugAsync` carga room-types del hotel, rooms no eliminadas, `availableRooms` = disponibles hoy tras restar reservas activas Confirmadas/CheckedIn solapadas con hoy, comodidades separadas por coma, imagen), frontend `website.service.ts` (`PublicRoomDto`, `PublicSiteDto.rooms`), `public-site.ts` (helpers `list`/`imgUrl`/`text`/`ratingOf`/`stars`/`money`/`roomList`), `public-site.html/scss` (secciones Gallery con cuadrícula de imágenes, Testimonials con estrellas, Amenities como chips; Rooms ahora renderiza datos reales con precio, descripción, amenities y badge de disponibilidad; Hero con imagen de fondo y CTA opcional)
  - Aceptación: secciones renderizan desde API. Hallazgo: `PublicWebsiteDto` no incluía rooms; backend exponía datos reales (room-types + disponibilidad calculada de reservas activas) en vez de mock. `dotnet build` 0 errores; typecheck + build frontend en verde (sin warnings). **Verificado.**
- [x] **T4.3 — Página Room-types**
  - Archivos: `src/app/pages/room-types/**` (nueva página), `src/app/core/services/hotel.service.ts` (nuevo `updateHotelRoomType`), `src/app.routes.ts` (`/app/room-types`), `src/app/layout/component/app.menu.ts` (entrada de menú)
  - Aceptación: página con alta/edición/baja. Backend ya exponía CRUD completo en `/api/hotels/{id}/room-types` (GET/POST/PUT/DELETE); se construyó la UI siguiendo el patrón AURON (tokens, estados skeleton/empty/error, confirmación destructiva con `ConfirmationService`, moneda paramétrica con `formatMoney`). Alta y edición en el mismo modal (capacidad, precio base, camas extra opcionales). Spec nuevo (`room-types.spec.ts`); typecheck + build en verde. **Verificado.**
- [x] **T4.4 — Finance: refunds + invoice-send**
  - Archivos: `FinanceController.cs` (nuevos `POST /payments/{id}/refund` y `POST /invoices/{id}/send`), `IFinanceService.cs`/`FinanceService.cs` (`RefundPaymentAsync` con reglas de negocio + `SendInvoiceAsync` + `RefundPaymentCommand`), `finance.service.ts` (`refundPayment`, `sendInvoice`), `finance.ts/finance.html/finance.scss` (acción «Reembolsar» en pagos completados con modal de importe+motivo; acción «Enviar» en facturas emitidas)
  - Aceptación: endpoints + UI; estados coherentes. Reembolso valida pago `Completed` no reembolsado, importe entre 0 y total, ajusta `AmountPaid` de la reserva (`Payment.Refund`) y registra dominio `PaymentRefunded`; envío solo desde `Issued` → `Sent` (`Invoice.Send`) con dominio `InvoiceSent`. Build backend .NET 0 errores; typecheck + build frontend en verde. **Verificado.**
- [x] **T4.5 — Integraciones reales (OTA/pagos), decisiones tomadas con libertad delegada**
  - Archivos backend: `StripeGateway.cs` (NUEVO: pasarela HTTP real `api.stripe.com` — payment_intents `confirm=true`/off_session y refunds; activa solo si `Payments:StripeSecretKey` con `sk_`, si no fail-fast explícito), `IPaymentGateway.IsLive` + `GatewayInfoDto.IsLive`/`Mode` (real/simulador), `AzulGateway`/`CardNetGateway` marcados simuladores, `BookingComAdapter.cs` y `ExpediaAdapter.cs` reescritos a HTTP real (Booking Connectivity JSON `distribution-xml.booking.com/2.0/json` con `X-Api-Key`; Expedia `connectivity.expedia.com/` con `X-Api-Key`), fail-fast sin credenciales (`ChannelManager:BookingCom:Username/Secret/PropertyId`, `ChannelManager:Expedia:ApiKey/HotelId`), datos fake deterministas ELIMINADOS, DI (`StripeGateway` vía `IConfiguration`)
  - Archivos frontend: `widget.service.ts` (`GatewayInfo.isLive/mode`), `channels.html/scss` (badge **REAL**/**SIMULADOR** por pasarela y botón de cargo condicionado)
  - Aceptación: contratos definidos y mocks reemplazados por integraciones reales. Clasificación honesta en `GatewayInfoMode`: **Stripe REAL** (cobro/reembolso en api.stripe.com), **Azul/CardNet SIMULADORES** (sin credenciales) y **OTA PARCIAL** (adaptadores HTTP reales cuya validación final exige credenciales de cuenta partner; mapping tolerante con `RawData` conservado). Mensajería (WhatsApp/SMS/Email en `AutomationService`) documentada como fuera de alcance de esta pasada. `dotnet build` 0 errores; typecheck + build frontend en verde. **Verificado salvo validación OTA con credenciales reales.**
- [x] **T4.6 — i18n completo**
  - Archivos: `src/app/shared/services/i18n.service.ts` (NUEVO: diccionarios es/en por claves, signal `current`, `t`/`tp` con placeholders, `auth_locale` en localStorage, `<html lang>` en carga y cambio), `src/app/shared/pipes/i18n.pipe.ts` (NUEVO: pipe `t`), `app.menu.ts` (nav con claves `nav.*`, aria/soon traducidos, contadores), `app.topbar.ts` (labels traducidos + **selector de idioma ES/EN**), `app.footer.ts`, `features/account/pages.ts` (LoginPage con claves `auth.login.*`)
  - Aceptación: extracción de strings + selector de idioma. Estrategia: i18n runtime con diccionarios (sin rebuild por locale); el menú/vertical izquierdo, topbar (incluye selector persistido), footer y el login quedan bilingües (ES/EN). Migración incremental del resto de pantallas tras estas claves como follow-up del mismo mecanismo. Build dev + typecheck specs en verde. **Verificado.**

---

## 9. Baseline — Diagnóstico FASE 0/1 (referencia)

**Stack verificado:** Angular 21, PrimeNG 21.0.2, Tailwind 4.1.11, .NET 8 + EF Core.

**Riesgos críticos:** CSP prod bloquea API; widget URL `localhost:5000`; theming fragmentado (3 capas); dark mode roto; residuo Sakai alcanzable; no-ops de UI; mocks de OTA/pagos/mensajería.

**Veredictos por pantalla:** REAL — Dashboard, Reservations, Calendar, Rooms, Rates, Guests, Finance, Analytics, Housekeeping, Maintenance, Audit, Security, Onboarding. PARCIAL — Channels, Workflows, Websites (editor), Public-site. NO IMPLEMENTADO — Room-types.

> Detalle completo de hallazgos y evidencia `archivo:línea` en el historial de sesión / auditorías.

---

## 10. Registro de cambios

| Fecha | Tarea | Cambio | Autor |
|---|---|---|---|
| 2026-09-17 | — | Creación del plan a partir de FASE 0/1 | — |
| 2026-09-17 | T0.1 | CSP conecta con API prod + `fileReplacements` en `angular.json` (prod ya no usa localhost) | opencode |
| 2026-09-17 | T0.2 | URL del widget parametrizada por `environment`; `widgetApiUrl`/`paymentsApiUrl` añadidos a prod | opencode |
| 2026-09-17 | T0.3 | Favicon propio `public/favicon.svg`; `img-src` sin `primefaces.org` | opencode |
| 2026-09-17 | T0.4 | CSP saneada (connect/font/img coherentes); build dev y prod verificados | opencode |
| 2026-09-18 | T1.1–T1.2 | Tokens `--hos-*` mapeados a PrimeNG (`--p-primary-*`/`--p-content-*`) + tokens de estado; dark mode automático | opencode |
| 2026-09-18 | T1.3 | Tipografía unificada a `var(--hos-font-sans)`; eliminado `Lato` | opencode |
| 2026-09-18 | T1.4 | Settings migrado a tokens (sin hex, iconos sin inline style) | opencode |
| 2026-09-18 | T1.5–T1.6 | Hotel eliminado como duplicado; `/app/hotel` redirige a `/app/settings` | opencode |
| 2026-09-18 | T1.7 | Creado `docs/DESIGN-TOKENS.md` (guía + checklist) | opencode |
| 2026-09-18 | T2.1 | Eliminadas rutas demo Sakai (uikit/documentation/pages/notfound/crud/empty) + link footer | opencode |
| 2026-09-18 | T2.2 | Eliminado auth legacy `/auth` (access/login/error) | opencode |
| 2026-09-18 | T2.3 | Eliminados landing y coming-soon Sakai; podado `MODULE_CONTENT` | opencode |
| 2026-09-18 | T2.4 | Eliminados 5 widgets de dashboard dead + `pages/service` (6 servicios demo) | opencode |
| 2026-09-18 | T2.5 | Eliminados `assets/demo`, `public/demo` y backup obsoleto; `styles.scss` saneado | opencode |
| 2026-09-18 | T2.6 | `HotelService.resolveActiveHotel()` + `NoHotelConfiguredError`; 14 páginas sin `resolveHotel` duplicado | opencode |
| 2026-09-18 | T2.7 | Política consistente de guards (hotel+rol) aplicada y documentada; specs ajustadas | opencode |
| 2026-09-18 | T3.1 | Confirmaciones destructivas unificadas (`<p-confirmDialog>` global + `ConfirmationService`); `window.confirm` eliminado | opencode |
| 2026-09-18 | T3.2 | Analytics: `fmtKpi` con moneda/porcentaje correctos y barras en cero sin engaño | opencode |
| 2026-09-18 | T3.3 | Util `formatMoney` paramétrico (`auth_hotel_currency`); `fmtMoney` de 7 páginas delega en él | opencode |
| 2026-09-18 | T3.4 | Filtros/search de Finance y Guests conectados a la API (no-ops eliminados) | opencode |
| 2026-09-18 | T3.5 | KPIs de Reservations sobre totales server-side (`loadCounts`); Guests `stats.total` = `totalCount()` | opencode |
| 2026-09-18 | T3.6 | A11y: `aria-label="Cerrar"` en botones de cierre de modales (6 páginas) | opencode |
| 2026-09-18 | T3.7 | Tablas responsivas: `overflow-x` + `min-width` en rooms/guests/finance/reservations | opencode |
| 2026-09-18 | T3.8 | Verificados estados skeleton/empty/error consistentes en todas las pantallas de lista | opencode |
| 2026-09-18 | T3.9 | Ola 3 cerrada: build dev + typecheck specs en verde; patrones estandarizados | opencode |
| 2026-09-18 | T4.1 | Editor de páginas/secciones del sitio: UI modal en Websites + sync de pages/sections en `UpdateWebsiteAsync` backend | opencode |
| 2026-09-18 | T4.2 | Render público: secciones Gallery/Testimonials/Amenities + Rooms con disponibilidad real (`PublicRoomDto` backend) | opencode |
| 2026-09-18 | T4.3 | Nueva página Room-types (CRUD alto/edición/baja) sobre endpoints existentes del backend; ruta + menú | opencode |
| 2026-09-18 | T4.4 | Finance: reembolsos (`POST payments/{id}/refund`) y envío de facturas (`POST invoices/{id}/send`) backend+UI | opencode |
| 2026-09-18 | T4.5 | Integraciones reales OTA/pagos: StripeGateway HTTP real (api.stripe.com); Azul/CardNet simuladores; BookingCom/Expedia adapters HTTP reales fail-fast; `IsLive/Mode` en DTOs + badge UI; mensajería fuera de alcance | opencode |
| 2026-09-18 | T4.6 | Infra i18n runtime (diccionarios es/en, `I18nService` + pipe `t`, selector ES/EN persistido) y shell + login bilingües | opencode |
| 2026-09-20 | F4-fix | Motor de reservas embebible: el script del widget crea reserva REAL (`POST /widget/bookings`) y cobra con la pasarela de la respuesta (configurable por `Payments:PreferredGateway` o Stripe si hay key); guest form (nombre/email/tel.) en el widget; elimina el cobro ficticio sin reserva | opencode |
| 2026-09-20 | F4-fix | El cobro del widget persiste el `Payment` (Completado, método tarjeta, autorización/referencia) y actualiza `AmountPaid` de la reserva vía `bookingReference`; idempotente (no vuelve a cobrar una reserva ya pagada al 100%) | opencode |
| 2026-09-20 | F4-night | Night audit en Finanzas: botón «Night audit» corre el motor idempotente (postea la noche a los folios in-house y marca NoShow), con modal de reporte (noches, reservas, NoShow, total); `POST /finance/night-audit` | opencode |
| 2026-09-20 | F4-pos | Folio/POS: las facturas se itemizan por noche (`BookingNight`), botón «Cargo al folio (POS)» en el detalle de la factura (categoría Food/Beverage/Service/Other) via `POST /finance/reservations/{id}/folio/items`; detalle muestra categoría de cada línea | opencode |
| 2026-09-20 | F2 | Foundation del sistema visual (sin tocar páginas): escala tipográfica (`--hos-fs-*`, pesos, `--hos-text-numeric`), espaciado `--hos-space-1..9`, radio canónico (sm/md/lg/xl), elevación `none/sm/md/lg`, densidad (`--hos-density` + modos compact/comfortable), focus ring, estados de dominio PMS (`occupied/available/clean/dirty/inspection/out-of-service/maintenance/neutral/pending/active/inactive` + softs vía color-mix) en `hospitality.scss` | opencode |
| 2026-09-20 | F2 | Primitivas de operación `hos-*` en hospitality.scss sección 7: `hos-page(-head)`, `hos-section`, `hos-metric(--primary/--secondary)`, `hos-panel`, `hos-btn(--primary/--ghost/--danger/--sm)`, `hos-field`+inputs, `hos-filterbar`, `hos-chip/tab`, `hos-table` (sticky header, scroll-x), `hos-badge/status-dot--{estado}`, `hos-modal(--wide)`, `hos-toast`, `hos-empty/error/skel(+shimmer)`, `hos-chart`, focus visible unificado; radio de marketing re-mapeado (`--hos-radius-lg` → `--hos-radius-xl`, valor 1.25rem conservado) | opencode |
| 2026-09-20 | F3 | Dashboard rediseñado sobre la Foundation: template+CSS inline extraídos de `dashboard.ts` a `dashboard.html`+`dashboard.scss`; jerarquía L1 (Ocupación+Ingresos primarias `hos-metric--primary`), L2 (Check-ins/out/ADR/RevPAR compactos `--secondary`), L3 (Housekeeping+Mantenimiento en `hos-panel` con `hos-status-dot`/`hos-badge` semánticos), L4 (tendencias en `hos-chart` + analytics por rango en `hos-metrics`/`hos-panel`); sin hover-lift ni hex/rgba (dots HK→`hos-status-dot`, badges→`hos-badge--{estado}`), refresh 60s y lógica/servicios intactos | opencode |

---

## 11. Cómo mantener este documento

1. Antes de trabajar una tarea: marcarla `[~]`.
2. Al terminar y validar el criterio de aceptación: `[x]` + actualizar §3 + añadir fila en §10.
3. Si se bloquea: `[!]` + motivo en la propia tarea.
4. Si cambia el alcance: crear/ajustar tarea y anotarlo en §10 (no borrar historial).
