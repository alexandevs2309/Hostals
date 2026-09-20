import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { RoomTypesPage } from './room-types';
import { HotelService, Hotel, RoomTypeDto } from '@/app/core/services/hotel.service';

describe('RoomTypesPage', () => {
    const hotelId = 'hotel-1';

    const roomTypes: RoomTypeDto[] = [
        { id: 't1', name: 'Estándar', description: 'Vista a la ciudad', basePrice: 100, maxOccupancy: 2 },
        { id: 't2', name: 'Suite', basePrice: 180, maxOccupancy: 3 }
    ];

    function setup(): { component: RoomTypesPage; hotelApi: jasmine.SpyObj<HotelService>; confirm: ConfirmationService } {
        const hotelApi = jasmine.createSpyObj<HotelService>(
            'HotelService',
            ['getHotels', 'getHotelById', 'getHotelRoomTypes', 'resolveActiveHotel', 'createHotelRoomType', 'updateHotelRoomType', 'deleteHotelRoomType']
        );
        hotelApi.resolveActiveHotel.and.returnValue(of({ id: hotelId, name: 'Repro' } as unknown as Hotel));
        hotelApi.getHotelRoomTypes.and.returnValue(of(roomTypes));
        hotelApi.createHotelRoomType.and.returnValue(of(roomTypes[0]));
        hotelApi.updateHotelRoomType.and.returnValue(of(roomTypes[0]));
        hotelApi.deleteHotelRoomType.and.returnValue(of());

        const confirm = new ConfirmationService();

        TestBed.configureTestingModule({
            imports: [RoomTypesPage],
            providers: [
                { provide: HotelService, useValue: hotelApi },
                { provide: ConfirmationService, useValue: confirm }
            ]
        });

        const fixture = TestBed.createComponent(RoomTypesPage);
        fixture.detectChanges();
        return { component: fixture.componentInstance, hotelApi, confirm };
    }

    beforeEach(() => {
        localStorage.removeItem('auth_hotel_id');
    });

    it('al cargar resuelve el hotel y pinta los tipos', async () => {
        const { component } = setup();
        await TB_SETTLE();
        expect(component.hotelId()).toBe(hotelId);
        expect(component.hotelName()).toBe('Repro');
        expect(component.roomTypes()).toHaveSize(2);
        expect(component.loading()).toBeFalse();
    });

    it('openEdit precarga el formulario con los datos del tipo', async () => {
        const { component } = setup();
        await TB_SETTLE();
        component.openEdit(roomTypes[0]);
        expect(component.editing()).toEqual(roomTypes[0]);
        expect(component.form.name).toBe('Estándar');
        expect(component.form.basePrice).toBe(100);
        expect(component.form.capacity).toBe(2);
        expect(component.form.description).toBe('Vista a la ciudad');
    });

    it('submit en modo edición llama a updateHotelRoomType', async () => {
        const { component, hotelApi } = setup();
        await TB_SETTLE();
        component.openEdit(roomTypes[1]);
        component.form.name = 'Suite premium';
        component.submit();
        await TB_SETTLE();
        expect(hotelApi.updateHotelRoomType).toHaveBeenCalledWith(hotelId, 't2', jasmine.objectContaining({ name: 'Suite premium', basePrice: 180 }));
    });

    it('submit en modo creación llama a createHotelRoomType', async () => {
        const { component, hotelApi } = setup();
        await TB_SETTLE();
        component.openCreate();
        component.form.name = 'Familiar';
        component.form.basePrice = 140;
        component.form.capacity = 4;
        component.submit();
        await TB_SETTLE();
        expect(hotelApi.createHotelRoomType).toHaveBeenCalledWith(hotelId, jasmine.objectContaining({ name: 'Familiar', basePrice: 140, capacity: 4 }));
    });

    it('fmtMoney respeta el formato de moneda', async () => {
        const { component } = setup();
        expect(component.fmtMoney(180)).toContain('180');
    });
});

async function TB_SETTLE(): Promise<void> {
    await new Promise((r) => setTimeout(r, 0));
}