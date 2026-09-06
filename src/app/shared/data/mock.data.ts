import { BookingRow, ChartPoint, FaqItem, HousekeepingRoom, HotelMetrics, MaintenanceTicket, ModuleInfo, NavItem, Plan, Testimonial } from '@/app/shared/models/hotel.model';

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