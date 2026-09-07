import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Hotel {
  id: string;
  name: string;
  description?: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  starRating: number;
  totalRooms: number;
  availableRooms: number;
  isActive: boolean;
  timeZone: string;
  city: string;
  country: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateHotelRequest {
  name: string;
  description?: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  starRating: number;
  totalRooms: number;
  timeZone: string;
  city: string;
  country: string;
}

export interface UpdateHotelRequest {
  id: string;
  name: string;
  description?: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  starRating: number;
  totalRooms: number;
  isActive: boolean;
  timeZone: string;
  city: string;
  country: string;
}

export interface PaginatedQuery {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: string;
  search?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private hotelsUrl = environment.hotelsApiUrl;

  constructor(private http: HttpClient) {}

  // Obtener hoteles con paginación
  getHotels(query: PaginatedQuery): Observable<PaginatedResult<Hotel>> {
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

    return this.http.get<PaginatedResult<Hotel>>(this.hotelsUrl, { params });
  }

  // Obtener hotel por ID
  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.hotelsUrl}/${id}`);
  }

  // Crear nuevo hotel
  createHotel(hotelData: CreateHotelRequest): Observable<Hotel> {
    return this.http.post<Hotel>(this.hotelsUrl, hotelData);
  }

  // Actualizar hotel
  updateHotel(hotelData: UpdateHotelRequest): Observable<Hotel> {
    return this.http.put<Hotel>(`${this.hotelsUrl}/${hotelData.id}`, hotelData);
  }

  // Eliminar hotel
  deleteHotel(id: string): Observable<any> {
    return this.http.delete(`${this.hotelsUrl}/${id}`);
  }

  // Cambiar estado del hotel
  toggleHotelStatus(id: string, isActive: boolean): Observable<any> {
    return this.http.patch(`${this.hotelsUrl}/${id}/status`, { isActive });
  }

  // Obtener estadísticas del hotel
  getHotelStats(id: string): Observable<any> {
    return this.http.get(`${this.hotelsUrl}/${id}/stats`);
  }

  // Obtener tipos de habitación del hotel
  getHotelRoomTypes(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.hotelsUrl}/${id}/room-types`);
  }

  // Obtener nombres de hoteles para dropdowns
  getHotelNames(): Observable<any[]> {
    return this.http.get<any[]>(`${this.hotelsUrl}/names`);
  }
}