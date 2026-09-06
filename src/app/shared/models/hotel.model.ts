export interface HotelMetrics {
    rooms: number;
    occupancy: number;
    revenue: number;
    checkIns: number;
    availableRooms: number;
    adr: number;
    revpar: number;
}

export interface NavItem {
    label: string;
    icon?: string;
    route?: string;
    fragment?: string;
    children?: NavItem[];
}

export interface ModuleInfo {
    id: string;
    icon: string;
    title: string;
    description: string;
    route: string;
    category: 'operations' | 'guests' | 'finance' | 'insights';
}

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    avatarColor?: 'primary' | 'alt';
}

export interface Plan {
    name: string;
    description: string;
    price: string;
    period: string;
    features: string[];
    cta: string;
    popular?: boolean;
    custom?: boolean;
}

export interface FaqItem {
    question: string;
    answer: string;
}

export interface BookingRow {
    guest: string;
    room: string;
    checkIn: string;
    checkOut: string;
    status: 'confirmada' | 'check-in' | 'pendiente' | 'check-out';
    amount: number;
}

export interface HousekeepingRoom {
    room: string;
    status: 'limpia' | 'pendiente' | 'inspeccion' | 'mantenimiento';
    housekeeper: string;
    priority: 'alta' | 'media' | 'baja';
}

export interface MaintenanceTicket {
    room: string;
    issue: string;
    priority: 'critica' | 'alta' | 'media' | 'baja';
    assignee: string;
    sla: string;
    status: 'abierto' | 'progreso' | 'resuelto';
}

export interface ChartPoint {
    label: string;
    value: number;
}

/** Tono de un pill/delta en los previews de módulos */
export type PreviewTone = 'teal' | 'green' | 'amber' | 'red' | 'indigo' | 'slate';

export interface ModuleKpi {
    label: string;
    value: string;
    delta: string;
    tone: PreviewTone;
}

export interface ModulePreviewItem {
    title: string;
    subtitle: string;
    meta: string;
    status: string;
    tone: PreviewTone;
}

/**
 * Contenido de un módulo del PMS.
 * Es el payload de `GET /api/v1/modules/:moduleId` (ahora servido por el
 * interceptor mock; cuando exista el backend, solo se reemplaza la respuesta).
 */
export interface ModuleContent {
    id: string;
    icon: string;
    label: string;
    color: string;
    description: string;
    features: string[];
    progress: number;
    kpis: ModuleKpi[];
    previewItems: ModulePreviewItem[];
}