import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedQuery, PaginatedResult } from './hotel.service';

export interface Reservation {
    id: string;
    reservationNumber: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfNights: number;
    numberOfGuests: number;
    hasExtraBed: boolean;
    specialRequests?: string;
    status: 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled' | 'NoShow';
    checkedInAt?: string;
    checkedOutAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
    source: string;
    bookingReference?: string;
    roomRate: number;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    isFullyPaid: boolean;
    taxRate: number;
    hotelId: string;
    hotelName: string;
    roomId: string;
    roomNumber: string;
    roomTypeName: string;
    guestId: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    createdAt: string;
}

export interface ReservationsFilter {
    hotelId?: string;
    status?: string;
    from?: string;
    to?: string;
    search?: string;
}

export interface CreateReservationRequest {
    hotelId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfGuests: number;
    hasExtraBed: boolean;
    specialRequests?: string;
    source?: string;
    bookingReference?: string;
    guestFirstName: string;
    guestLastName?: string;
    guestEmail?: string;
    guestPhone?: string;
    guestDocumentType?: string;
    guestDocumentNumber?: string;
    guestNationality?: string;
    guestCity?: string;
    guestCountry?: string;
    roomRate?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private reservationsUrl = environment.reservationsApiUrl;

    constructor(private http: HttpClient) {}

    getReservations(query: PaginatedQuery, filter: ReservationsFilter): Observable<PaginatedResult<Reservation>> {
        let params = new HttpParams()
            .set('pageNumber', query.pageNumber.toString())
            .set('pageSize', query.pageSize.toString());

        if (filter.hotelId) params = params.set('hotelId', filter.hotelId);
        if (filter.status) params = params.set('status', filter.status);
        if (filter.from) params = params.set('from', filter.from);
        if (filter.to) params = params.set('to', filter.to);
        if (filter.search) params = params.set('search', filter.search);

        return this.http.get<PaginatedResult<Reservation>>(this.reservationsUrl, { params });
    }

    getReservationById(id: string): Observable<Reservation> {
        return this.http.get<Reservation>(`${this.reservationsUrl}/${id}`);
    }

    getGuestReservations(guestId: string, hotelId?: string): Observable<Reservation[]> {
        let params = new HttpParams();
        if (hotelId) params = params.set('hotelId', hotelId);
        return this.http.get<Reservation[]>(`${this.reservationsUrl}/guest/${guestId}`, { params });
    }

    createReservation(data: CreateReservationRequest): Observable<Reservation> {
        return this.http.post<Reservation>(this.reservationsUrl, data);
    }

    confirm(id: string): Observable<Reservation> {
        return this.http.patch<Reservation>(`${this.reservationsUrl}/${id}/confirm`, {});
    }

    checkIn(id: string): Observable<Reservation> {
        return this.http.patch<Reservation>(`${this.reservationsUrl}/${id}/check-in`, {});
    }

    checkOut(id: string): Observable<Reservation> {
        return this.http.patch<Reservation>(`${this.reservationsUrl}/${id}/check-out`, {});
    }

    cancel(id: string, reason?: string): Observable<Reservation> {
        return this.http.patch<Reservation>(`${this.reservationsUrl}/${id}/cancel`, { reason });
    }
}