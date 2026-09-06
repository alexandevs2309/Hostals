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