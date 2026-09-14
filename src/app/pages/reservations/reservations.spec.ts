import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ReservationsPage } from './reservations';
import { ReservationService, Reservation } from '@/app/core/services/reservation.service';
import { HotelService, Hotel, RoomTypeDto, PaginatedResult } from '@/app/core/services/hotel.service';
import { RoomService, Room } from '@/app/core/services/room.service';

describe('ReservationsPage', () => {
    const hotelId = 'hotel-1';

    const reservations: Reservation[] = [
        {
            id: 'rv1', reservationNumber: 'RSV-1001', checkInDate: '2026-10-01', checkOutDate: '2026-10-03',
            numberOfNights: 2, numberOfGuests: 2, hasExtraBed: false, status: 'Confirmed',
            source: 'Directo', roomRate: 100, totalAmount: 200, amountPaid: 0, balanceDue: 200,
            isFullyPaid: false, taxRate: 0.18, hotelId, hotelName: 'Repro',
            roomId: 'r1', roomNumber: '101', roomTypeName: 'Doble',
            guestId: 'g1', guestName: 'Ana Pérez', guestEmail: 'ana@test.dev', guestPhone: '8091112222',
            createdAt: '2026-09-20T10:00:00Z'
        },
        {
            id: 'rv2', reservationNumber: 'RSV-1002', checkInDate: '2026-10-02', checkOutDate: '2026-10-05',
            numberOfNights: 3, numberOfGuests: 2, hasExtraBed: false, status: 'CheckedIn',
            source: 'Booking.com', roomRate: 90, totalAmount: 270, amountPaid: 270, balanceDue: 0,
            isFullyPaid: true, taxRate: 0.18, hotelId, hotelName: 'Repro',
            roomId: 'r2', roomNumber: '202', roomTypeName: 'Suite',
            guestId: 'g2', guestName: 'Luis Gómez', guestEmail: 'luis@test.dev', guestPhone: '8093334444',
            createdAt: '2026-09-21T10:00:00Z'
        },
        {
            id: 'rv3', reservationNumber: 'RSV-1003', checkInDate: '2026-10-04', checkOutDate: '2026-10-06',
            numberOfNights: 2, numberOfGuests: 1, hasExtraBed: false, status: 'Pending',
            source: 'Directo', roomRate: 80, totalAmount: 160, amountPaid: 0, balanceDue: 160,
            isFullyPaid: false, taxRate: 0.18, hotelId, hotelName: 'Repro',
            roomId: 'r3', roomNumber: '303', roomTypeName: 'Doble',
            guestId: 'g3', guestName: 'Carla Ruiz', guestEmail: 'carla@test.dev', guestPhone: '8095556666',
            createdAt: '2026-09-22T10:00:00Z'
        }
    ];

    function setup(): { component: ReservationsPage; resApi: jasmine.SpyObj<ReservationService> } {
        const resApi = jasmine.createSpyObj<ReservationService>(
            'ReservationService',
            ['getReservations', 'confirm', 'checkIn', 'checkOut', 'cancel', 'createReservation']
        );
        resApi.getReservations.and.returnValue(of({ items: reservations, totalCount: 3 } as unknown as PaginatedResult<Reservation>));
        resApi.confirm.and.returnValue(of(reservations[0]));
        resApi.checkIn.and.returnValue(of(reservations[1]));
        resApi.checkOut.and.returnValue(of(reservations[1]));
        resApi.cancel.and.returnValue(of(reservations[2]));

        const hotelApi = jasmine.createSpyObj<HotelService>('HotelService', ['getHotels', 'getHotelById', 'getHotelRoomTypes']);
        hotelApi.getHotelById.and.returnValue(of({ id: hotelId, name: 'Repro' } as unknown as Hotel));
        hotelApi.getHotelRoomTypes.and.returnValue(of([] as RoomTypeDto[]));

        const roomApi = jasmine.createSpyObj<RoomService>('RoomService', ['getAvailableRooms', 'getHotelRooms']);
        roomApi.getAvailableRooms.and.returnValue(of([] as Room[]));

        TestBed.configureTestingModule({
            imports: [ReservationsPage],
            providers: [
                { provide: ReservationService, useValue: resApi },
                { provide: HotelService, useValue: hotelApi },
                { provide: RoomService, useValue: roomApi }
            ]
        });

        localStorage.setItem('auth_hotel_id', hotelId);
        const fixture = TestBed.createComponent(ReservationsPage);
        fixture.detectChanges();
        return { component: fixture.componentInstance, resApi };
    }

    beforeEach(() => {
        localStorage.removeItem('auth_hotel_id');
    });

    it('al cargar pinta reservas y total', async () => {
        const { component } = setup();
        await TB_SETTLE();
        expect(component.hotelId()).toBe(hotelId);
        expect(component.reservations()).toHaveSize(3);
        expect(component.totalCount()).toBe(3);
        expect(component.loading()).toBeFalse();
    });

    it('counts agrupa por estado', async () => {
        const { component } = setup();
        await TB_SETTLE();
        expect(component.counts()).toEqual({ confirmed: 1, checkedIn: 1, pending: 1, cancelled: 0, checkedOut: 0, noShow: 0 });
    });

    it('filtered filtra por estado y búsqueda', async () => {
        const { component } = setup();
        await TB_SETTLE();

        component.setFilter('Confirmed');
        expect(component.filtered().map((r) => r.id)).toEqual(['rv1']);

        component.setFilter('Todos');
        component.search.set('ana');
        expect(component.filtered().map((r) => r.id)).toEqual(['rv1']);
    });

    it('traduce estados y formatea fechas/moneda', async () => {
        const { component } = setup();
        expect(component.statusLabel('CheckedIn')).toBe('En casa');
        expect(component.statusLabel('NoShow')).toBe('No-show');
        expect(component.statusLabel('Otro')).toBe('Otro');
        expect(component.fmtMoney(200)).toContain('200');
        expect(component.fmtDate('')).toBe('—');
    });

    it('goPage navega dentro de límites y recarga', async () => {
        const { component } = setup();
        await TB_SETTLE();
        component.goPage(1);
        expect(component.page()).toBe(1);
        component.goPage(-1);
        expect(component.page()).toBe(1);
    });

    it('openCancel + submitCancel cancela la reserva con motivo', async () => {
        const { component, resApi } = setup();
        await TB_SETTLE();

        component.openCancel(reservations[2]);
        expect(component.showCancel()).toBeTrue();

        component.cancelReason.set('Cliente canceló');
        component.submitCancel();
        await TB_SETTLE();

        expect(resApi.cancel).toHaveBeenCalledWith('rv3', 'Cliente canceló');
        expect(component.msg()).toBe('Reserva cancelada.');
        expect(component.msgError()).toBeFalse();
    });

    it('canCreate exige hotel, fechas válidas, habitación y huésped', async () => {
        const { component } = setup();
        await TB_SETTLE();
        expect(component.canCreate()).toBeFalse();

        component.form.checkIn = '2026-11-01';
        component.form.checkOut = '2026-11-02';
        component.form.roomId = 'r1';
        component.form.guestFirstName = 'Ana';
        component.form.checkOut = '2026-11-02';
        expect(component.canCreate()).toBeTrue();

        component.form.guestFirstName = '';
        expect(component.canCreate()).toBeFalse();
    });
});

async function TB_SETTLE(): Promise<void> {
    await new Promise((r) => setTimeout(r, 0));
}