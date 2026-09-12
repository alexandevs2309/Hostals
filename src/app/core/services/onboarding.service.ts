import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface OnboardingStatus {
  hotelId: string;
  hotelName: string;
  currency: string;
  taxRate?: number | null;
  hasRoomTypes: boolean;
  roomTypeCount: number;
  roomCount: number;
  hasRatePlan: boolean;
  ratePlanCount: number;
  hasChannel: boolean;
  channelCount: number;
  allComplete: boolean;
  completedSteps: number;
  totalSteps: number;
}

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private url = environment.onboardingApiUrl;

  constructor(private http: HttpClient) {}

  getStatus(hotelId: string): Observable<OnboardingStatus> {
    return this.http.get<OnboardingStatus>(`${this.url}/status`, { params: new HttpParams().set('hotelId', hotelId) });
  }
}