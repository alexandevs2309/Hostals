import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedQuery, PaginatedResult } from './hotel.service';

export interface RoomType {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  amenities: string[];
  isActive: boolean;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  description?: string;
  price: number;
  maxOccupancy: number;
  status: string;
  isClean: boolean;
  isMaintenanceRequired: boolean;
  roomTypeId: string;
  roomTypeName: string;
  hotelId: string;
  hotelName: string;
  createdAt: string;
  updatedAt?: string;
  maintenanceNotes?: string;
}

export interface CreateRoomRequest {
  roomNumber: string;
  floor: number;
  description?: string;
  price: number;
  maxOccupancy: number;
  roomTypeId: string;
  hotelId: string;
}

export interface UpdateRoomRequest {
  id: string;
  roomNumber: string;
  floor: number;
  description?: string;
  price: number;
  maxOccupancy: number;
  roomTypeId: string;
  hotelId: string;
}

export interface UpdateRoomStatusRequest {
  status: string;
  isClean: boolean;
  isMaintenanceRequired: boolean;
  notes?: string;
}

export interface RequestMaintenanceRequest {
  description: string;
  priority: string;
}

export interface AvailableRoomsQuery {
  hotelId: string;
  checkIn: string;
  checkOut: string;
  roomTypeId?: string;
}

export interface SearchRoomsQuery {
  hotelId: string;
  roomNumber?: string;
  status?: string;
  floor?: number;
  roomTypeId?: string;
}

export interface RoomHistoryEvent {
  date: string;
  status: string;
  guestName?: string;
  price?: number;
}

export interface RoomStats {
  roomId: string;
  averageDailyRate: number;
  totalNights: number;
  totalRevenue: number;
  occupancyRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomsUrl = environment.roomsApiUrl;

  constructor(private http: HttpClient) {}

  // Obtener habitaciones con paginación
  getRooms(query: PaginatedQuery): Observable<PaginatedResult<Room>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber.toString())
      .set('pageSize', query.pageSize.toString());

    if (query.sortBy) {
      params = params.set('sortBy', query.sortBy);
    }

    if (query.sortDirection) {
      params = params.set('sortDirection', query.sortDirection);
    }

    if (query.search) {
      params = params.set('search', query.search);
    }

    return this.http.get<PaginatedResult<Room>>(this.roomsUrl, { params });
  }

  // Obtener habitación por ID
  getRoomById(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.roomsUrl}/${id}`);
  }

  // Obtener habitaciones por hotel
  getHotelRooms(hotelId: string): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.roomsUrl}/hotel/${hotelId}`);
  }

  // Crear nueva habitación
  createRoom(roomData: CreateRoomRequest): Observable<Room> {
    return this.http.post<Room>(this.roomsUrl, roomData);
  }

  // Actualizar habitación
  updateRoom(roomData: UpdateRoomRequest): Observable<Room> {
    return this.http.put<Room>(`${this.roomsUrl}/${roomData.id}`, roomData);
  }

  // Actualizar estado de habitación
  updateRoomStatus(id: string, statusData: UpdateRoomStatusRequest): Observable<Room> {
    return this.http.patch<Room>(`${this.roomsUrl}/${id}/status`, statusData);
  }

  // Obtener habitaciones disponibles por hotel y rango de fechas
  getAvailableRooms(query: AvailableRoomsQuery): Observable<Room[]> {
    let params = new HttpParams()
      .set('hotelId', query.hotelId)
      .set('checkIn', query.checkIn)
      .set('checkOut', query.checkOut);

    if (query.roomTypeId) {
      params = params.set('roomTypeId', query.roomTypeId);
    }

    return this.http.get<Room[]>(`${this.roomsUrl}/available`, { params });
  }

  // Marcar habitación como sucia (necesita limpieza)
  markRoomAsDirty(roomId: string, reason?: string): Observable<Room> {
    return this.http.post<Room>(`${this.roomsUrl}/${roomId}/mark-dirty`, reason ?? null);
  }

  // Marcar habitación como limpia
  markRoomAsClean(roomId: string): Observable<Room> {
    return this.http.post<Room>(`${this.roomsUrl}/${roomId}/mark-clean`, null);
  }

  // Solicitar mantenimiento
  requestMaintenance(roomId: string, maintenanceData: RequestMaintenanceRequest): Observable<Room> {
    return this.http.post<Room>(`${this.roomsUrl}/${roomId}/request-maintenance`, maintenanceData);
  }

  // Completar mantenimiento
  completeMaintenance(roomId: string): Observable<Room> {
    return this.http.post<Room>(`${this.roomsUrl}/${roomId}/complete-maintenance`, null);
  }

  // Obtener historial de habitación
  getRoomHistory(id: string, from?: string, to?: string): Observable<RoomHistoryEvent[]> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<RoomHistoryEvent[]>(`${this.roomsUrl}/${id}/history`, { params });
  }

  // Obtener estadísticas de habitaciones de un hotel
  getRoomStats(hotelId: string): Observable<RoomStats> {
    return this.http.get<RoomStats>(`${this.roomsUrl}/stats/${hotelId}`);
  }

  // Buscar habitaciones por hotel con filtros
  searchRooms(query: SearchRoomsQuery): Observable<Room[]> {
    let params = new HttpParams().set('hotelId', query.hotelId);

    if (query.roomNumber) params = params.set('roomNumber', query.roomNumber);
    if (query.status) params = params.set('status', query.status);
    if (query.floor != null) params = params.set('floor', query.floor.toString());
    if (query.roomTypeId) params = params.set('roomTypeId', query.roomTypeId);

    return this.http.get<Room[]>(`${this.roomsUrl}/search`, { params });
  }
}