export interface CalendarRoom {
    id: string;
    roomNumber: string;
}

export interface CalendarDay {
    iso: string;
    day: number;
    weekday: string;
}

export interface CalendarBlock {
    reservationId: string;
    roomId: string;
    roomNumber: string;
    guestName: string;
    status: string;
    checkIn: string;
    checkOut: string;
    nights: number;
    start: number;
    end: number;
    conflict: boolean;
}

export const ACTIVE_STATUSES = ['Confirmed', 'CheckedIn', 'Pending'] as const;

export function toDateOnly(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
}

export function addDays(d: Date, days: number): Date {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
}

export function buildDays(start: Date, length: number): CalendarDay[] {
    const out: CalendarDay[] = [];
    const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (let i = 0; i < length; i++) {
        const d = addDays(start, i);
        out.push({ iso: toDateOnly(d), day: d.getDate(), weekday: WEEKDAYS[d.getDay()] });
    }
    return out;
}

function dayIndex(days: CalendarDay[], iso: string): number {
    return days.findIndex((d) => d.iso === iso);
}

/**
 * Construye los bloques que cada reserva ocupa sobre el grid habitaciones × noches.
 * - start/end se recortan a la ventana visible (para reservas que entran/salen del rango).
 * - conflict = true si otra reserva activa solapa la misma habitación/noche.
 */
export function fillBlocks(
    rooms: CalendarRoom[],
    days: CalendarDay[],
    reservations: Array<{ id: string; roomId: string; roomNumber: string; guestName: string; status: string; checkInDate: string; checkOutDate: string; numberOfNights: number }>
): { blocks: CalendarBlock[]; conflicts: Set<string> } {
    const byRoom = new Map(rooms.map((r) => [r.id, r]));

    const blocks: CalendarBlock[] = reservations
        .map((r) => {
            const start = dayIndex(days, r.checkInDate);
            const nights = Math.max(1, r.numberOfNights || Math.round((+new Date(r.checkOutDate) - +new Date(r.checkInDate)) / 86400000));
            if (start < 0 && dayIndex(days, r.checkOutDate) < 0) return null;
            const from = Math.max(0, start < 0 ? 0 : start);
            const to = Math.min(days.length, (start < 0 ? 0 : start) + nights);
            if (to <= from) return null;
            return {
                reservationId: r.id,
                roomId: r.roomId,
                roomNumber: byRoom.get(r.roomId)?.roomNumber ?? r.roomNumber,
                guestName: r.guestName,
                status: r.status,
                checkIn: r.checkInDate,
                checkOut: r.checkOutDate,
                nights,
                start: from,
                end: to,
                conflict: false
            } as CalendarBlock;
        })
        .filter((b): b is CalendarBlock => b !== null);

    const conflicts = new Set<string>();
    const active = blocks.filter((b) => (ACTIVE_STATUSES as readonly string[]).includes(b.status));
    for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
            const a = active[i];
            const b = active[j];
            if (a.roomId !== b.roomId) continue;
            if (a.start < b.end && b.start < a.end) {
                conflicts.add(a.reservationId);
                conflicts.add(b.reservationId);
            }
        }
    }

    blocks.forEach((b) => {
        if (conflicts.has(b.reservationId)) b.conflict = true;
    });

    return { blocks, conflicts };
}