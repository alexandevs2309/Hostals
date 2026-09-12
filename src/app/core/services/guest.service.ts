import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedQuery, PaginatedResult } from './hotel.service';

export interface Guest {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    documentType: string;
    documentNumber: string;
    nationality: string;
    city?: string;
    country?: string;
    specialRequests?: string;
    loyaltyPoints: number;
    loyaltyTier: string;
    isVIP: boolean;
    totalStays: number;
    totalSpent: number;
    lastStayDate?: string;
    activeReservations: number;
    createdAt: string;
}

export interface GuestReservation {
    id: string;
    reservationNumber: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfNights: number;
    status: string;
    totalAmount: number;
    roomNumber: string;
    roomTypeName: string;
}

export interface CreateGuestRequest {
    firstName: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    documentType?: string;
    documentNumber?: string;
    nationality?: string;
    city?: string;
    country?: string;
    address?: string;
    specialRequests?: string;
    preferences?: string;
}

export interface GuestFilter {
    hotelId?: string;
    search?: string;
}

@Injectable({
    providedIn: 'root'
})
export class GuestService {
    private guestsUrl = environment.guestsApiUrl;

    constructor(private http: HttpClient) {}

    getGuests(query: PaginatedQuery, filter: GuestFilter): Observable<PaginatedResult<Guest>> {
        let params = new HttpParams()
            .set('pageNumber', query.pageNumber.toString())
            .set('pageSize', query.pageSize.toString());
        if (filter.hotelId) params = params.set('hotelId', filter.hotelId);
        if (filter.search) params = params.set('search', filter.search);
        return this.http.get<PaginatedResult<Guest>>(this.guestsUrl, { params });
    }

    getGuest(id: string): Observable<Guest> {
        return this.http.get<Guest>(`${this.guestsUrl}/${id}`);
    }

    getGuestReservations(id: string): Observable<GuestReservation[]> {
        return this.http.get<GuestReservation[]>(`${this.guestsUrl}/${id}/reservations`);
    }

    createGuest(data: CreateGuestRequest): Observable<Guest> {
        return this.http.post<Guest>(this.guestsUrl, data);
    }

    updateGuest(id: string, data: CreateGuestRequest): Observable<Guest> {
        return this.http.put<Guest>(`${this.guestsUrl}/${id}`, { id, ...data });
    }
}