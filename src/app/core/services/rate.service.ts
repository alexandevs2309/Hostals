import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RoomRate {
  roomTypeId: string;
  roomTypeName: string;
  date: string;
  basePrice: number;
  overridePrice?: number | null;
  effectivePrice: number;
  isOverride: boolean;
  ratePlanId?: string | null;
  ratePlanName?: string | null;
}

export interface RatePlan {
  id: string;
  name: string;
  multiplier: number;
  minStay: number;
  refundability: number;
  cancellationDeadlineHours: number;
  isDefault: boolean;
  usageCount: number;
  refundabilityLabel: string;
}

export interface UpsertRatePlanCommand {
  hotelId: string;
  name: string;
  multiplier: number;
  minStay: number;
  refundability: number;
  cancellationDeadlineHours: number;
  isDefault: boolean;
}

export interface SetRateRangeCommand {
  hotelId: string;
  roomTypeId: string;
  from: string;
  to: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class RateService {
  private ratesUrl = environment.ratesApiUrl;
  private plansUrl = environment.ratePlansApiUrl;

  constructor(private http: HttpClient) {}

  getRates(hotelId: string, roomTypeId: string | null, from: string, to: string): Observable<RoomRate[]> {
    let params = new HttpParams()
      .set('hotelId', hotelId)
      .set('from', from)
      .set('to', to);
    if (roomTypeId) params = params.set('roomTypeId', roomTypeId);
    return this.http.get<RoomRate[]>(this.ratesUrl, { params });
  }

  setRateRange(command: SetRateRangeCommand): Observable<void> {
    return this.http.put<void>(this.ratesUrl, command);
  }

  clearRateRange(hotelId: string, roomTypeId: string, from: string, to: string): Observable<void> {
    let params = new HttpParams()
      .set('hotelId', hotelId)
      .set('roomTypeId', roomTypeId)
      .set('from', from)
      .set('to', to);
    return this.http.delete<void>(this.ratesUrl, { params });
  }

  // ── Planes de tarifas (1B) ─────────────────────────────
  getRatePlans(hotelId: string): Observable<RatePlan[]> {
    return this.http.get<RatePlan[]>(`${this.plansUrl}`, { params: new HttpParams().set('hotelId', hotelId) });
  }

  createRatePlan(command: UpsertRatePlanCommand): Observable<RatePlan> {
    return this.http.post<RatePlan>(`${this.plansUrl}`, command);
  }

  updateRatePlan(id: string, command: UpsertRatePlanCommand): Observable<RatePlan> {
    return this.http.put<RatePlan>(`${this.plansUrl}/${id}`, command);
  }

  deleteRatePlan(id: string, hotelId: string): Observable<void> {
    return this.http.delete<void>(`${this.plansUrl}/${id}`, { params: new HttpParams().set('hotelId', hotelId) });
  }

  assignRatePlan(id: string, hotelId: string, roomTypeIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.plansUrl}/${id}/assign`, { roomTypeIds }, { params: new HttpParams().set('hotelId', hotelId) });
  }
}