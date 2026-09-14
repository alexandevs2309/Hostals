import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WidgetRoomType {
  roomTypeId: string;
  name: string;
  description?: string;
  capacity: number;
  basePrice: number;
  pricePerNight: number;
  amenities?: string;
  imageUrl?: string;
}

export interface WidgetConfig {
  hotelId: string;
  hotelName: string;
  currency: string;
  roomTypes: WidgetRoomType[];
}

export interface WidgetNight {
  date: string;
  availableUnits: number;
  price: number;
}

export interface WidgetRoomAvailability {
  roomTypeId: string;
  name: string;
  capacity: number;
  pricePerNight: number;
  availableNights: number;
  nights: WidgetNight[];
}

export interface WidgetAvailability {
  hotelId: string;
  from: string;
  to: string;
  currency: string;
  roomTypes: WidgetRoomAvailability[];
}

@Injectable({ providedIn: 'root' })
export class WidgetService {
  private url = environment.widgetApiUrl;

  constructor(private http: HttpClient) {}

  getConfig(hotelId: string): Observable<WidgetConfig> {
    return this.http.get<WidgetConfig>(`${this.url}/config`, { params: new HttpParams().set('hotelId', hotelId) });
  }

  getAvailability(hotelId: string, from: string, to: string): Observable<WidgetAvailability> {
    return this.http.get<WidgetAvailability>(`${this.url}/availability`, { params: new HttpParams().set('hotelId', hotelId).set('from', from).set('to', to) });
  }
}

export interface GatewayInfo {
  name: string;
  displayName: string;
}

export interface GatewayChargeResult {
  success: boolean;
  message: string;
  authorizationCode?: string;
  reference?: string;
  gateway: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private url = environment.paymentsApiUrl;

  constructor(private http: HttpClient) {}

  getGateways(): Observable<GatewayInfo[]> {
    return this.http.get<GatewayInfo[]>(`${this.url}/gateways`);
  }

  charge(gateway: string, amount: number, currency = 'MXN', description?: string): Observable<GatewayChargeResult> {
    return this.http.post<GatewayChargeResult>(`${this.url}/charge`, {
      gateway,
      amount,
      currency,
      cardToken: 'tok-mock-ui',
      description
    });
  }
}