import { BookingRow, ChartPoint, FaqItem, HousekeepingRoom, HotelMetrics, MaintenanceTicket, ModuleContent, ModuleInfo, NavItem, Plan, Testimonial } from '@/app/shared/models/hotel.model';

/*
 * TODO (Backend Integration) — Métricas del hotel activo
 * ─────────────────────────────────────────────────────────────────
 * Estos valores son datos de ejemplo (demo).
 * En producción serán reemplazados por el endpoint:
 *   GET /api/v1/hotels/:hotelId/metrics
 *
 * Actualizar en tiempo real vía WebSocket o polling:
 *   GET /api/v1/hotels/:hotelId/metrics/live
 * ─────────────────────────────────────────────────────────────────
 */
export const HOTEL_METRICS: HotelMetrics = {
    rooms: 142,
    occupancy: 82.4,
    revenue: 18420,
    checkIns: 34,
    availableRooms: 24,
    adr: 198,
    revpar: 163
};

export const HOTEL_NAMES: string[] = [
    'Hotel Aurora', 'Casa Palma', 'Ocean Suites', 'Villa Norte', 'Grand Caribe', 'Blue Bay',
    'Sunset Resort', 'Hotel Mirador', 'Las Olas Villas', 'Pacific Grand', 'Casa del Mar', 'Hotel Cima'
];

export const NAV_ITEMS: NavItem[] = [
    { label: 'Producto', route: '/features' },
    {
        label: 'Soluciones',
        children: [
            { label: 'Hoteles', route: '/solutions/hotels' },
            { label: 'Resorts', route: '/solutions/resorts' },
            { label: 'Villas', route: '/solutions/villas' },
            { label: 'Multi-propiedad', route: '/solutions/multi-property' }
        ]
    },
    {
        label: 'Módulos',
        children: [
            { label: 'Reservaciones', route: '/modules/reservations' },
            { label: 'Habitaciones', route: '/modules/rooms' },
            { label: 'Huéspedes', route: '/modules/guests' },
            { label: 'Housekeeping', route: '/modules/housekeeping' },
            { label: 'Mantenimiento', route: '/modules/maintenance' },
            { label: 'Finanzas', route: '/modules/finance' },
            { label: 'Analytics', route: '/modules/analytics' }
        ]
    },
    { label: 'Operación', route: '/#operacion', fragment: 'operacion' },
    { label: 'Precios', route: '/pricing' },
    { label: 'Recursos', route: '/blog' }
];

export const MODULES: ModuleInfo[] = [
    {
        id: 'reservations',
        icon: 'pi pi-calendar',
        title: 'Reservaciones & PMS',
        description: 'Calendario, disponibilidad, tarifas, check-in, check-out y folios centralizados.',
        route: '/modules/reservations',
        category: 'operations'
    },
    {
        id: 'rooms',
        icon: 'pi pi-building',
        title: 'Habitaciones',
        description: 'Inventario, tipos de habitación, tarifas dinámicas y estado en tiempo real.',
        route: '/modules/rooms',
        category: 'operations'
    },
    {
        id: 'guests',
        icon: 'pi pi-user',
        title: 'Huéspedes',
        description: 'Perfil, historial, preferencias y una vista 360° de cada huésped.',
        route: '/modules/guests',
        category: 'guests'
    },
    {
        id: 'housekeeping',
        icon: 'pi pi-box',
        title: 'Housekeeping',
        description: 'Asignación de habitaciones y tareas a las cámaras con estados en vivo.',
        route: '/modules/housekeeping',
        category: 'operations'
    },
    {
        id: 'maintenance',
        icon: 'pi pi-wrench',
        title: 'Mantenimiento',
        description: 'Incidencias, prioridades, responsables y cumplimiento de SLA.',
        route: '/modules/maintenance',
        category: 'operations'
    },
    {
        id: 'finance',
        icon: 'pi pi-dollar',
        title: 'Finanzas',
        description: 'Ingresos, gastos, cierres de caja y métricas de rentabilidad.',
        route: '/modules/finance',
        category: 'finance'
    },
    {
        id: 'analytics',
        icon: 'pi pi-chart-line',
        title: 'Analytics',
        description: 'KPIs, tendencias, reportes e inteligencia operativa.',
        route: '/modules/analytics',
        category: 'insights'
    },
    {
        id: 'automations',
        icon: 'pi pi-bolt',
        title: 'Automatizaciones',
        description: 'Workflows y tareas automáticas: llegadas, limpiezas y mensajes.',
        route: '/modules/guests',
        category: 'operations'
    },
    {
        id: 'integrations',
        icon: 'pi pi-sitemap',
        title: 'Integraciones',
        description: 'Conexión con el ecosistema tecnológico del hotel.',
        route: '/integrations',
        category: 'insights'
    }
];

/*
 * TODO (Backend Integration) — Testimonios de clientes
 * ─────────────────────────────────────────────────────────────────
 * Testimonios de ejemplo (demo) con datos ficticios.
 * En producción serán reemplazados por el endpoint:
 *   GET /api/v1/content/testimonials
 * ─────────────────────────────────────────────────────────────────
 */
export const TESTIMONIALS: Testimonial[] = [
    {
        quote: 'Hospitality OS nos permitió conectar recepción, housekeeping y gerencia en una sola operación. Dejamos de usar cinco herramientas distintas.',
        name: 'Laura Méndez',
        role: 'Gerente General',
        avatarColor: 'primary'
    },
    {
        quote: 'La operación dejó de depender de hojas de cálculo y mensajes de WhatsApp. Todo vive en un solo lugar y el equipo lo adoptó en horas.',
        name: 'Ricardo Salas',
        role: 'Director de Operaciones',
        avatarColor: 'alt'
    },
    {
        quote: 'El check-in pasó de minutos a segundos. Las cámaras siempre saben qué habitación sigue y recepción ve el estado en vivo.',
        name: 'Valentina Ríos',
        role: 'Jefa de Recepción',
        avatarColor: 'alt'
    },
    {
        quote: 'Los reportes de finanzas se generan solos. Cerramos el mes en un día. Antes nos llevaba una semana completa.',
        name: 'Andrés Celi',
        role: 'CFO',
        avatarColor: 'primary'
    }
];

/*
 * TODO (Backend Integration) — Planes de precios
 * ─────────────────────────────────────────────────────────────────
 * Estos datos son valores de ejemplo (demo).
 * En producción serán reemplazados por la respuesta del endpoint:
 *   GET /api/v1/pricing/plans
 *
 * Campos que el backend deberá devolver por plan:
 *   name, description, price (USD, string), period, cta,
 *   features: string[], popular?: boolean, custom?: boolean
 *
 * El campo `price` de Enterprise puede ser null o "Custom";
 * el componente GosPricingGrid lo maneja con el bloque @else.
 * ─────────────────────────────────────────────────────────────────
 */
export const PLANS: Plan[] = [
    {
        name: 'Essential',
        description: 'Para propiedades pequeñas e independientes',
        price: '49',
        period: '/mes',
        cta: 'Comenzar gratis',
        features: [
            'Hasta 30 habitaciones',
            'Reservaciones & PMS',
            'Gestión de habitaciones',
            'Perfiles de huéspedes',
            'Calendario de disponibilidad',
            'Soporte por email'
        ]
    },
    {
        name: 'Professional',
        description: 'Para hoteles en crecimiento',
        price: '149',
        period: '/mes',
        cta: 'Solicitar demo',
        popular: true,
        features: [
            'Hasta 150 habitaciones',
            'Todo lo de Essential',
            'Housekeeping completo',
            'Mantenimiento con SLA',
            'Finanzas y cierres',
            'Analytics y reportes',
            'Automatizaciones',
            'Integraciones esenciales'
        ]
    },
    {
        name: 'Enterprise',
        description: 'Para grupos y cadenas multi-propiedad',
        price: 'Custom',
        period: '',
        cta: 'Hablar con ventas',
        custom: true,
        features: [
            'Habitaciones ilimitadas',
            'Multi-propiedad',
            'Roles y permisos avanzados',
            'SSO / SAML',
            'API e integraciones ilimitadas',
            'Gerente de cuenta dedicado',
            'Onboarding con equipo profesional'
        ]
    }
];

/*
 * TODO (Backend Integration) — Preguntas frecuentes
 * ─────────────────────────────────────────────────────────────────
 * Estos FAQs son contenido de ejemplo (demo).
 * En producción serán reemplazados por el endpoint:
 *   GET /api/v1/content/faqs
 *
 * Cada item debe devolver: question: string, answer: string
 * ─────────────────────────────────────────────────────────────────
 */
export const FAQS: FaqItem[] = [
    {
        question: '¿Qué es Hospitality OS?',
        answer: 'Es la plataforma que centraliza la operación completa de un hotel: reservaciones, PMS, habitaciones, huéspedes, housekeeping, mantenimiento, finanzas, analytics e integraciones en un solo lugar.'
    },
    {
        question: '¿Puede manejar varias propiedades?',
        answer: 'Sí. El plan Enterprise incluye multi-propiedad: operas, comparas y consolidas cada hotel desde una única plataforma, con datos aislados por propiedad y reportes consolidados a nivel de grupo.'
    },
    {
        question: '¿Incluye housekeeping?',
        answer: 'Sí. Housekeeping es un módulo nativo: estados de habitación en tiempo real, asignación de cámaras, prioridades, inspecciones y sincronización automática con el front desk.'
    },
    {
        question: '¿Puedo gestionar huéspedes?',
        answer: 'Sí. Cada huésped tiene un perfil 360° con historial de estancias, preferencias, solicitudes, notas, gasto acumulado y última visita, listo para personalizar la experiencia.'
    },
    {
        question: '¿Tiene analytics?',
        answer: 'Sí. Occupancy, ADR, RevPAR, ingresos, tendencias y reportes comparativos, con números en tiempo real para que la gerencia decida con datos.'
    },
    {
        question: '¿Puede integrarse con otros sistemas?',
        answer: 'Sí. Conectamos con canales de distribución, pasarelas de pago, cerraduras electrónicas, telemetría de habitaciones y tu stack tecnológico a través de API e integraciones nativas.'
    },
    {
        question: '¿Qué incluye cada plan?',
        answer: 'Essential está pensado para propiedades pequeñas; Professional suma housekeeping, mantenimiento, finanzas, analytics y automatizaciones; Enterprise añade multi-propiedad, SSO, API y soporte dedicado.'
    },
    {
        question: '¿Cómo funciona el onboarding?',
        answer: 'Trabajamos contigo por fases: configuración de propiedades y habitaciones, carga de reservas y datos históricos, capacitación de cada equipo (recepción, cámaras, gerencia) y arranque asistido en tu primera semana.'
    }
];

/*
 * TODO (Backend Integration) — Reservaciones del hotel activo
 * ─────────────────────────────────────────────────────────────────
 * Datos de ejemplo (demo).
 * En producción:
 *   GET /api/v1/hotels/:hotelId/bookings?status=today&limit=10
 * ─────────────────────────────────────────────────────────────────
 */
export const BOOKINGS: BookingRow[] = [
    { guest: 'María Soler', room: '301', checkIn: '12 may', checkOut: '15 may', status: 'check-in', amount: 630 },
    { guest: 'Jorge Tapia', room: '214', checkIn: '12 may', checkOut: '16 may', status: 'confirmada', amount: 840 },
    { guest: 'Ana Vidal', room: '105', checkIn: '13 may', checkOut: '14 may', status: 'confirmada', amount: 210 },
    { guest: 'Luis Peralta', room: '408', checkIn: '13 may', checkOut: '17 may', status: 'pendiente', amount: 1120 },
    { guest: 'Carla Duarte', room: '118', checkIn: '14 may', checkOut: '14 may', status: 'check-out', amount: 190 }
];

/*
 * TODO (Backend Integration) — Estado de habitaciones (Housekeeping)
 * ─────────────────────────────────────────────────────────────────
 * Datos de ejemplo (demo).
 * En producción:
 *   GET /api/v1/hotels/:hotelId/housekeeping/rooms
 * ─────────────────────────────────────────────────────────────────
 */
export const HOUSEKEEPING_ROOMS: HousekeepingRoom[] = [
    { room: '101', status: 'limpia', housekeeper: 'Lidia R.', priority: 'baja' },
    { room: '102', status: 'pendiente', housekeeper: 'Lidia R.', priority: 'alta' },
    { room: '103', status: 'inspeccion', housekeeper: 'Marta P.', priority: 'media' },
    { room: '104', status: 'mantenimiento', housekeeper: '—', priority: 'alta' },
    { room: '105', status: 'limpia', housekeeper: 'Marta P.', priority: 'baja' },
    { room: '106', status: 'pendiente', housekeeper: 'Lidia R.', priority: 'media' },
    { room: '107', status: 'lista', housekeeper: 'Sofía G.', priority: 'baja' } as unknown as HousekeepingRoom,
    { room: '108', status: 'limpia', housekeeper: 'Sofía G.', priority: 'baja' }
];

/*
 * TODO (Backend Integration) — Tickets de mantenimiento
 * ─────────────────────────────────────────────────────────────────
 * Datos de ejemplo (demo).
 * En producción:
 *   GET /api/v1/hotels/:hotelId/maintenance/tickets?status=open
 * ─────────────────────────────────────────────────────────────────
 */
export const MAINTENANCE_TICKETS: MaintenanceTicket[] = [
    { room: '104', issue: 'Aire acondicionado no enfría', priority: 'critica', assignee: 'Prex', sla: '2h', status: 'abierto' },
    { room: '207', issue: 'Ducha gotea', priority: 'alta', assignee: 'Germán', sla: '6h', status: 'progreso' },
    { room: '312', issue: 'TV sin señal', priority: 'media', assignee: 'Miguel', sla: '24h', status: 'abierto' },
    { room: '109', issue: 'Cambio de foco', priority: 'baja', assignee: 'Miguel', sla: '48h', status: 'resuelto' },
    { room: '415', issue: 'Persiana atascada', priority: 'media', assignee: 'Germán', sla: '24h', status: 'progreso' }
];

/*
 * TODO (Backend Integration) — Tendencia de ocupación semanal
 * ─────────────────────────────────────────────────────────────────
 * Datos de ejemplo (demo).
 * En producción:
 *   GET /api/v1/hotels/:hotelId/analytics/occupancy?period=week
 * ─────────────────────────────────────────────────────────────────
 */
export const OCCUPANCY_TREND: ChartPoint[] = [
    { label: 'L', value: 62 },
    { label: 'M', value: 71 },
    { label: 'X', value: 68 },
    { label: 'J', value: 78 },
    { label: 'V', value: 84 },
    { label: 'S', value: 90 },
    { label: 'D', value: 82 }
];

/*
 * TODO (Backend Integration) — Tendencia de ingresos mensuales
 * ─────────────────────────────────────────────────────────────────
 * Datos de ejemplo (demo).
 * En producción:
 *   GET /api/v1/hotels/:hotelId/analytics/revenue?period=year
 * ─────────────────────────────────────────────────────────────────
 */
export const REVENUE_TREND: ChartPoint[] = [
    { label: 'Ene', value: 11.2 },
    { label: 'Feb', value: 12.8 },
    { label: 'Mar', value: 14.1 },
    { label: 'Abr', value: 13.4 },
    { label: 'May', value: 16.9 },
    { label: 'Jun', value: 18.4 },
    { label: 'Jul', value: 20.1 },
    { label: 'Ago', value: 22.6 }
];

export const SIDEBAR_NAV: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-th-large', route: '/app' },
    { label: 'Reservaciones', icon: 'pi pi-calendar', route: '/app/reservations' },
    { label: 'Habitaciones', icon: 'pi pi-building', route: '/app/rooms' },
    { label: 'Huéspedes', icon: 'pi pi-user', route: '/app/guests' },
    { label: 'Housekeeping', icon: 'pi pi-box', route: '/app/housekeeping' },
    { label: 'Mantenimiento', icon: 'pi pi-wrench', route: '/app/maintenance' },
    { label: 'Finanzas', icon: 'pi pi-dollar', route: '/app/finance' },
    { label: 'Analytics', icon: 'pi pi-chart-line', route: '/app/analytics' },
    { label: 'Configuración', icon: 'pi pi-cog', route: '/app/settings' }
];

/*
 * TODO (Backend Integration) — Contenido de módulos del PMS
 * ─────────────────────────────────────────────────────────────────
 * Payload de pixel de cada módulo.
 * En producción es servido por el endpoint:
 *   GET /api/v1/modules/:moduleId
 *
 * Estructura esperada por el componente:
 *   id, icon, label, color, description, features[], progress,
 *   kpis: { label, value, delta, tone }[],
 *   previewItems: { title, subtitle, meta, status, tone }[]
 * ─────────────────────────────────────────────────────────────────
 */
export const MODULE_CONTENT: Record<string, ModuleContent> = {
    reservations: {
        id: 'reservations',
        icon: 'pi pi-calendar',
        label: 'Reservaciones & PMS',
        color: '#14b8a6',
        description: 'Calendario de disponibilidad, tarifas, check-in, check-out y folios centralizados.',
        features: ['Calendario de disponibilidad en tiempo real', 'Check-in y check-out en 1 clic', 'Folios por huésped', 'Tarifas dinámicas por canal', 'Sincronización con channel manager'],
        progress: 45,
        kpis: [
            { label: 'Reservas hoy', value: '34', delta: '+8 hoy', tone: 'teal' },
            { label: 'Ocupación', value: '82.4%', delta: '+3.1 pts', tone: 'teal' },
            { label: 'ADR', value: '$198', delta: '+$12', tone: 'teal' },
            { label: 'Ingresos hoy', value: '$18,420', delta: '+$2,104', tone: 'teal' }
        ],
        previewItems: [
            { title: 'María Soler', subtitle: 'Hab 301 · 12–15 may', meta: '$630', status: 'Check-in', tone: 'teal' },
            { title: 'Jorge Tapia', subtitle: 'Hab 214 · 12–16 may', meta: '$840', status: 'Confirmada', tone: 'green' },
            { title: 'Ana Vidal', subtitle: 'Hab 105 · 13–14 may', meta: '$210', status: 'Confirmada', tone: 'green' },
            { title: 'Luis Peralta', subtitle: 'Hab 408 · 13–17 may', meta: '$1,120', status: 'Pendiente', tone: 'amber' },
            { title: 'Carla Duarte', subtitle: 'Hab 118 · 14–14 may', meta: '$190', status: 'Check-out', tone: 'slate' }
        ]
    },
    rooms: {
        id: 'rooms',
        icon: 'pi pi-building',
        label: 'Habitaciones',
        color: '#6366f1',
        description: 'Inventario de habitaciones, tipos, categorías y estado en tiempo real.',
        features: ['Plano de piso interactivo', 'Tipos y categorías configurables', 'Estado en tiempo real', 'Bloqueos por mantenimiento', 'Tarifas centralizadas'],
        progress: 38,
        kpis: [
            { label: 'Habitaciones', value: '142', delta: '8 tipos', tone: 'indigo' },
            { label: 'Disponibles hoy', value: '24', delta: '17%', tone: 'indigo' },
            { label: 'En limpieza', value: '8', delta: '3 en curso', tone: 'amber' },
            { label: 'Mantenimiento', value: '4', delta: '2 críticos', tone: 'red' }
        ],
        previewItems: [
            { title: '101 · Superior', subtitle: 'Piso 1', meta: 'Limpia', status: 'Lista', tone: 'green' },
            { title: '102 · Superior', subtitle: 'Piso 1', meta: 'Cámara Lidia R.', status: 'Pendiente', tone: 'amber' },
            { title: '103 · Deluxe', subtitle: 'Piso 1', meta: 'Inspección', status: 'Inspección', tone: 'indigo' },
            { title: '104 · Deluxe', subtitle: 'Piso 1', meta: 'Aire acondicionado', status: 'Mantenimiento', tone: 'red' },
            { title: '105 · Deluxe', subtitle: 'Piso 1', meta: 'Vista al mar', status: 'Ocupada', tone: 'slate' }
        ]
    },
    guests: {
        id: 'guests',
        icon: 'pi pi-user',
        label: 'Huéspedes',
        color: '#f59e0b',
        description: 'Perfil 360° de cada huésped con historial, preferencias y gasto acumulado.',
        features: ['Perfil completo con historial', 'Preferencias y solicitudes', 'Gasto acumulado (LTV)', 'Segmentación y etiquetas', 'Programa de fidelización'],
        progress: 32,
        kpis: [
            { label: 'Huéspedes en casa', value: '286', delta: '+12 hoy', tone: 'amber' },
            { label: 'Llegadas hoy', value: '34', delta: '+6', tone: 'teal' },
            { label: 'Salidas hoy', value: '21', delta: '-3', tone: 'slate' },
            { label: 'LTV promedio', value: '$1,240', delta: '+4%', tone: 'amber' }
        ],
        previewItems: [
            { title: 'Laura Méndez', subtitle: 'Suite 402 · 12–15 may', meta: '6 estancias', status: 'Frecuente', tone: 'amber' },
            { title: 'Andrés Celi', subtitle: 'Hab 305 · 12–14 may', meta: '3 estancias', status: 'VIP', tone: 'teal' },
            { title: 'Valentina Ríos', subtitle: 'Hab 208 · 13–16 may', meta: '1 estancia', status: 'Nuevo', tone: 'indigo' },
            { title: 'Ricardo Salas', subtitle: 'Suite 501 · 10–16 may', meta: '9 estancias', status: 'Frecuente', tone: 'amber' },
            { title: 'Carla Duarte', subtitle: 'Hab 118 · 14–14 may', meta: '2 estancias', status: 'Check-out', tone: 'slate' }
        ]
    },
    housekeeping: {
        id: 'housekeeping',
        icon: 'pi pi-box',
        label: 'Housekeeping',
        color: '#22c55e',
        description: 'Asignación de habitaciones, prioridades, inspecciones y estados en vivo.',
        features: ['Panel de turno para cámaras', 'Prioridades automáticas', 'Inspecciones digitales', 'Sincronización con recepción', 'Métricas de productividad'],
        progress: 28,
        kpis: [
            { label: 'Pendientes', value: '12', delta: '3 alta prioridad', tone: 'amber' },
            { label: 'En progreso', value: '8', delta: '2 cámaras', tone: 'green' },
            { label: 'En inspección', value: '5', delta: '+2 hoy', tone: 'indigo' },
            { label: 'Listas', value: '24', delta: '72% del inventario', tone: 'green' }
        ],
        previewItems: [
            { title: '101', subtitle: 'Cámara Lidia R.', meta: 'Lista', status: 'Limpia', tone: 'green' },
            { title: '102', subtitle: 'Cámara Lidia R.', meta: 'Prioridad alta', status: 'Pendiente', tone: 'amber' },
            { title: '103', subtitle: 'Cámara Marta P.', meta: 'Prioridad media', status: 'Inspección', tone: 'indigo' },
            { title: '104', subtitle: 'Mantenimiento', meta: 'A/C', status: 'Bloqueada', tone: 'red' },
            { title: '105', subtitle: 'Cámara Marta P.', meta: 'Lista', status: 'Limpia', tone: 'green' }
        ]
    },
    maintenance: {
        id: 'maintenance',
        icon: 'pi pi-wrench',
        label: 'Mantenimiento',
        color: '#ef4444',
        description: 'Tickets de incidencias, prioridades, responsables y cumplimiento de SLA.',
        features: ['Tickets desde cualquier módulo', 'Prioridades y SLA', 'Asignación por especialidad', 'Historial por activo', 'Alertas de vencimiento'],
        progress: 25,
        kpis: [
            { label: 'Tickets abiertos', value: '6', delta: '1 crítico', tone: 'red' },
            { label: 'En progreso', value: '2', delta: '2 técnicos', tone: 'amber' },
            { label: 'Resueltos hoy', value: '3', delta: '94% SLA', tone: 'green' },
            { label: 'Tiempo medio', value: '4.2h', delta: '-38 min', tone: 'teal' }
        ],
        previewItems: [
            { title: 'Hab 104 · Aire acondicionado', subtitle: 'Técnico Prex', meta: 'SLA 2h', status: 'Crítico', tone: 'red' },
            { title: 'Hab 207 · Ducha gotea', subtitle: 'Germán', meta: 'SLA 6h', status: 'En progreso', tone: 'amber' },
            { title: 'Hab 312 · TV sin señal', subtitle: 'Miguel', meta: 'SLA 24h', status: 'Abierto', tone: 'amber' },
            { title: 'Hab 109 · Cambio de foco', subtitle: 'Miguel', meta: 'SLA 48h', status: 'Resuelto', tone: 'green' },
            { title: 'Hab 415 · Persiana atascada', subtitle: 'Germán', meta: 'SLA 24h', status: 'En progreso', tone: 'amber' }
        ]
    },
    finance: {
        id: 'finance',
        icon: 'pi pi-dollar',
        label: 'Finanzas',
        color: '#0ea5e9',
        description: 'Ingresos, gastos, cierres de caja y reportes de rentabilidad.',
        features: ['Folios y facturación', 'Cierres de caja auditables', 'Ingresos por área', 'Reportes exportables', 'Conciliación automática'],
        progress: 20,
        kpis: [
            { label: 'Ingresos hoy', value: '$18,420', delta: '+12%', tone: 'teal' },
            { label: 'Depósitos', value: '$6,120', delta: '+$890', tone: 'teal' },
            { label: 'Egresos', value: '$4,180', delta: '-2%', tone: 'slate' },
            { label: 'Cierre de caja', value: 'OK', delta: '16:45', tone: 'green' }
        ],
        previewItems: [
            { title: 'Folio #2841 · María Soler', subtitle: 'Check-in 12 may', meta: '+$630', status: 'Abierto', tone: 'teal' },
            { title: 'Folio #2840 · Jorge Tapia', subtitle: 'Check-in 12 may', meta: '+$840', status: 'Abierto', tone: 'teal' },
            { title: 'Pago · Stripe', subtitle: 'Anticipo Jorge Tapia', meta: '+$420', status: 'Aplicado', tone: 'green' },
            { title: 'Gasto · Lavandería', subtitle: 'Proveedor local', meta: '-$180', status: 'Conciliado', tone: 'slate' },
            { title: 'Folio #2821 · Carla Duarte', subtitle: 'Check-out 14 may', meta: '+$190', status: 'Cerrado', tone: 'green' }
        ]
    },
    analytics: {
        id: 'analytics',
        icon: 'pi pi-chart-line',
        label: 'Analytics',
        color: '#8b5cf6',
        description: 'Occupancy, ADR, RevPAR, revenue y tendencias en tiempo real.',
        features: ['KPIs en tiempo real', 'Tendencias comparativas', 'Comparativas entre propiedades', 'Reportes automáticos', 'Exportación para gerencia'],
        progress: 35,
        kpis: [
            { label: 'Occupancy', value: '82.4%', delta: '+3.1 pts', tone: 'indigo' },
            { label: 'ADR', value: '$198', delta: '+$12', tone: 'indigo' },
            { label: 'RevPAR', value: '$163', delta: '+$15', tone: 'indigo' },
            { label: 'Booking window', value: '21 días', delta: '+4 días', tone: 'teal' }
        ],
        previewItems: [
            { title: 'Occupancy semanal', subtitle: 'Lun 62% → Dom 82%', meta: '+20 pts', status: 'Al alza', tone: 'green' },
            { title: 'Ingresos del mes', subtitle: 'Agosto 2026', meta: '$212k', status: '+8%', tone: 'teal' },
            { title: 'Origen de reservas', subtitle: 'OTAs 46% · Directo 38%', meta: '—', status: 'Directo al alza', tone: 'indigo' },
            { title: 'No-show rate', subtitle: 'Últimos 30 días', meta: '6.1%', status: 'Bajo', tone: 'green' },
            { title: 'Guest satisfaction', subtitle: 'Encuesta post-estancia', meta: '4.6 / 5', status: 'Excelente', tone: 'amber' }
        ]
    },
    settings: {
        id: 'settings',
        icon: 'pi pi-cog',
        label: 'Configuración',
        color: '#64748b',
        description: 'Configuración de la propiedad, usuarios, roles y preferencias.',
        features: ['Gestión de usuarios y roles', 'Configuración de la propiedad', 'Integraciones', 'Notificaciones', 'Seguridad y accesos'],
        progress: 15,
        kpis: [
            { label: 'Usuarios', value: '12', delta: '5 roles', tone: 'slate' },
            { label: 'Integraciones', value: '3', delta: '2 activas', tone: 'teal' },
            { label: 'Habitaciones config.', value: '142', delta: '8 tipos', tone: 'slate' },
            { label: 'Estado de la API', value: 'Activa', delta: '100% uptime', tone: 'green' }
        ],
        previewItems: [
            { title: 'Hotel Aurora', subtitle: 'Propiedad principal', meta: '142 hab.', status: 'Activa', tone: 'green' },
            { title: 'María · Propietario', subtitle: 'Acceso total', meta: 'Propietario', status: 'Activo', tone: 'teal' },
            { title: 'Channel Manager', subtitle: 'Booking.com · Expedia', meta: 'v2.1', status: 'Conectado', tone: 'green' },
            { title: 'Pasarela de pago', subtitle: 'Stripe', meta: 'Producción', status: 'Activa', tone: 'amber' },
            { title: 'API keys', subtitle: 'Última rotación', meta: 'hace 30 días', status: 'Segura', tone: 'slate' }
        ]
    }
};