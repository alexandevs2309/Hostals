import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Channel {
  id: string;
  name: string;
  channelType: string;
  commissionRate: number;
  isActive: boolean;
  channelTypeLabel: string;
  credentialsJson?: string;
}

export interface UpsertChannelCommand {
  hotelId: string;
  name: string;
  channelType: string;
  commissionRate: number;
  isActive: boolean;
}

export interface ChannelMapping {
  id: string;
  channelId: string;
  channelName: string;
  roomTypeId: string;
  roomTypeName: string;
  channelRoomCode: string;
  channelRatePlanCode?: string;
  isActive: boolean;
}

export interface UpsertChannelMappingCommand {
  channelId: string;
  roomTypeId: string;
  channelRoomCode: string;
  channelRatePlanCode?: string;
  isActive: boolean;
}

export interface PushResult {
  success: boolean;
  message: string;
  itemsPushed: number;
}

export interface BookingPull {
  externalBookingId: string;
  channelRoomCode: string;
  channelRatePlanCode: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
  currency: string;
  rawData: Record<string, any>;
}

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private url = environment.channelsApiUrl;

  constructor(private http: HttpClient) {}

  getChannels(hotelId: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(this.url, { params: new HttpParams().set('hotelId', hotelId) });
  }

  createChannel(command: UpsertChannelCommand): Observable<Channel> {
    return this.http.post<Channel>(this.url, command);
  }

  updateChannel(id: string, command: UpsertChannelCommand): Observable<Channel> {
    return this.http.put<Channel>(`${this.url}/${id}`, command);
  }

  deleteChannel(id: string, hotelId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`, { params: new HttpParams().set('hotelId', hotelId) });
  }

  // Channel Manager
  testConnection(channelId: string): Observable<{ success: boolean }> {
    return this.http.get<{ success: boolean }>(`${this.url}/${channelId}/test-connection`);
  }

  fetchRoomTypeMaps(channelId: string): Observable<Record<string, { channelRoomCode: string; channelRatePlanCode: string }>> {
    return this.http.get<Record<string, { channelRoomCode: string; channelRatePlanCode: string }>>(`${this.url}/${channelId}/room-type-maps`);
  }

  createMappings(channelId: string): Observable<PushResult> {
    return this.http.post<PushResult>(`${this.url}/${channelId}/create-mappings`, {});
  }

  pushAvailability(channelId: string, from: string, to: string): Observable<PushResult> {
    return this.http.post<PushResult>(`${this.url}/${channelId}/push-availability`, { from, to });
  }

  pushRates(channelId: string, from: string, to: string): Observable<PushResult> {
    return this.http.post<PushResult>(`${this.url}/${channelId}/push-rates`, { from, to });
  }

  pullBookings(channelId: string, from: string, to: string): Observable<BookingPull[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<BookingPull[]>(`${this.url}/${channelId}/pull-bookings`, { params });
  }

  getMappings(channelId: string): Observable<ChannelMapping[]> {
    return this.http.get<ChannelMapping[]>(`${this.url}/${channelId}/mappings`);
  }

  upsertMapping(command: UpsertChannelMappingCommand): Observable<ChannelMapping> {
    return this.http.post<ChannelMapping>(`${this.url}/${command.channelId}/mappings`, command);
  }

  deleteMapping(mappingId: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/mappings/${mappingId}`);
  }

  getCredentials(channelId: string): Observable<{ channelId: string; credentialsJson: string }> {
    return this.http.get<{ channelId: string; credentialsJson: string }>(`${this.url}/${channelId}/credentials`);
  }

  updateCredentials(channelId: string, credentialsJson: string): Observable<void> {
    return this.http.put<void>(`${this.url}/${channelId}/credentials`, { credentialsJson });
  }
}