// Formateo monetario y numérico consistente.
// La moneda activa se resuelve desde el hotel (se persiste al resolver la propiedad:
// clave `auth_hotel_currency`, escrita por HotelService.resolveActiveHotel()).

export function activeCurrency(): string {
    return localStorage.getItem('auth_hotel_currency') || 'USD';
}

export function formatMoney(value: number, currency?: string): string {
    const code = currency || activeCurrency();
    try {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: code,
            maximumFractionDigits: 2
        }).format(Number(value) || 0);
    } catch {
        return '$' + (Number(value) || 0).toLocaleString('en-US');
    }
}

export function formatNumber(value: number): string {
    return (Number(value) || 0).toLocaleString('es-MX', { maximumFractionDigits: 2 });
}