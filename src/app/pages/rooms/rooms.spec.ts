import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RoomsPage } from './rooms';
import { RoomService, Room } from '@/app/core/services/room.service';
import { HotelService, Hotel, RoomTypeDto } from '@/app/core/services/hotel.service';
import { DashboardService, MaintenanceTicketDto } from '@/app/core/services/dashboard.service';

describe('RoomsPage', () => {
    const hotelId = 'hotel-1';

    const rooms: Room[] = [
        {
            id: 'r1', roomNumber: '101', floor: 1, price: 100, maxOccupancy: 2,
            status: 'Available', isClean: true, isMaintenanceRequired: false,
            roomTypeId: 't1', roomTypeName: 'Doble', hotelId, hotelName: 'Repro',
            createdAt: new Date().toISOString()
        },
        {
            id: 'r2', roomNumber: '202', floor: 2, price: 120, maxOccupancy: 2,
            status: 'Occupied', isClean: false, isMaintenanceRequired: false,
            roomTypeId: 't2', roomTypeName: 'Suite', hotelId, hotelName: 'Repro',
            createdAt: new Date().toISOString()
        },
        {
            id: 'r3', roomNumber: '303', floor: 3, price: 80, maxOccupancy: 2,
            status: 'Maintenance', isClean: false, isMaintenanceRequired: true,
            roomTypeId: 't1', roomTypeName: 'Doble', hotelId, hotelName: 'Repro',
            createdAt: new Date().toISOString()
        }
    ];

    const roomTypes: RoomTypeDto[] = [
        { id: 't1', name: 'Doble', basePrice: 100, maxOccupancy: 2 },
        { id: 't2', name: 'Suite', basePrice: 120, maxOccupancy: 2 }
    ];

    function setup(): { component: RoomsPage; roomApi: jasmine.SpyObj<RoomService> } {
        const roomApi = jasmine.createSpyObj<RoomService>(
            'RoomService',
            ['getHotelRooms', 'updateRoomStatus', 'markRoomAsDirty', 'markRoomAsClean', 'completeMaintenance', 'requestMaintenance', 'createRoom', 'getAvailableRooms']
        );
        roomApi.getHotelRooms.and.returnValue(of(rooms));

        const hotelApi = jasmine.createSpyObj<HotelService>('HotelService', ['getHotels', 'getHotelById', 'getHotelRoomTypes']);
        hotelApi.getHotelById.and.returnValue(of({ id: hotelId, name: 'Repro' } as unknown as Hotel));
        hotelApi.getHotelRoomTypes.and.returnValue(of(roomTypes));

        const dashApi = jasmine.createSpyObj<DashboardService>('DashboardService', ['getMaintenanceTickets']);
        dashApi.getMaintenanceTickets.and.returnValue(of([] as MaintenanceTicketDto[]));

        TestBed.configureTestingModule({
            imports: [RoomsPage],
            providers: [
                { provide: RoomService, useValue: roomApi },
                { provide: HotelService, useValue: hotelApi },
                { provide: DashboardService, useValue: dashApi }
            ]
        });

        localStorage.setItem('auth_hotel_id', hotelId);
        const fixture = TestBed.createComponent(RoomsPage);
        fixture.detectChanges();
        return { component: fixture.componentInstance, roomApi };
    }

    beforeEach(() => {
        localStorage.removeItem('auth_hotel_id');
    });

    it('al cargar resuelve el hotel y pinta las habitaciones', async () => {
        const { component } = setup();
        await TB_SETTLE();
        expect(component.hotelId()).toBe(hotelId);
        expect(component.hotelName()).toBe('Repro');
        expect(component.rooms()).toHaveSize(3);
        expect(component.loading()).toBeFalse();
    });

    it('stats calcula totales, ocupación y media de precio', async () => {
        const { component } = setup();
        await TB_SETTLE();
        const s = component.stats();
        expect(s.total).toBe(3);
        expect(s.available).toBe(1);
        expect(s.occupied).toBe(1);
        expect(s.maintenance).toBe(1);
        expect(s.dirty).toBe(2);
        expect(s.clean).toBe(1);
        expect(s.avgPrice).toBe(100);
        expect(s.occupancyRate).toBeCloseTo(16.7, 1);
    });

    it('filtered aplica filtro por estado y búsqueda', async () => {
        const { component } = setup();
        await TB_SETTLE();

        component.setFilter('Available');
        expect(component.filtered().map((r) => r.id)).toEqual(['r1']);

        component.setFilter('Todos');
        component.search.set('2');
        expect(component.filtered().map((r) => r.id)).toEqual(['r2']);

        component.search.set('doble');
        expect(component.filtered().map((r) => r.id)).toEqual(['r1', 'r3']);
    });

    it('statusLabel y statusClass traducen estados', async () => {
        const { component } = setup();
        expect(component.statusLabel('Available')).toBe('Disponible');
        expect(component.statusLabel('Maintenance')).toBe('Mantenimiento');
        expect(component.statusLabel('Desconocido')).toBe('Desconocido');
        expect(component.statusClass('Available')).toBe('badge--available');
    });

    it('setAvailable llama a la API de estado', async () => {
        const { component, roomApi } = setup();
        await TB_SETTLE();

        component.setAvailable(rooms[0]);
        expect(roomApi.updateRoomStatus).toHaveBeenCalledWith('r1', {
            status: 'Available',
            isClean: true,
            isMaintenanceRequired: false
        });
    });
});

async function TB_SETTLE(): Promise<void> {
    await new Promise((r) => setTimeout(r, 0));
}