/**
 * Configuración de la API del producto.
 *
 * Base URL de la API v1. Mientras no exista backend real, el
 * `MockApiInterceptor` responde estas rutas con datos de ejemplo
 * (mock.data.ts) simulando latencia de red. Para conectar un backend
 * real solo hay que cambiar `API_BASE` (o apagar el interceptor).
 */
export const API_BASE = '/api/v1';

export const API = {
    /** Contenido/preview de un módulo del PMS. */
    module: (moduleId: string) => `${API_BASE}/modules/${moduleId}`,

    /** Métricas globales del hotel activo. */
    metrics: (hotelId = 'demo') => `${API_BASE}/hotels/${hotelId}/metrics`,
    /** Reservaciones del hotel (hoy). */
    bookings: (hotelId = 'demo') => `${API_BASE}/hotels/${hotelId}/bookings`,
    /** Estado de habitaciones para housekeeping. */
    housekeepingRooms: (hotelId = 'demo') => `${API_BASE}/hotels/${hotelId}/housekeeping/rooms`,
    /** Tickets de mantenimiento abiertos. */
    maintenanceTickets: (hotelId = 'demo') => `${API_BASE}/hotels/${hotelId}/maintenance/tickets`,
    /** Tendencia de ocupación semanal. */
    occupancyTrend: (hotelId = 'demo') => `${API_BASE}/hotels/${hotelId}/analytics/occupancy`,
    /** Tendencia de ingresos mensuales. */
    revenueTrend: (hotelId = 'demo') => `${API_BASE}/hotels/${hotelId}/analytics/revenue`
};