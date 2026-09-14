import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface TriggerEventInfo {
  name: string;
  description: string;
}

export interface AutomationRule {
  id: string;
  hotelId: string;
  name: string;
  triggerEvent: string;
  channel: string;
  template: string;
  isEnabled: boolean;
}

export interface UpsertAutomationRuleCommand {
  hotelId: string;
  name: string;
  triggerEvent: string;
  channel: string;
  template: string;
  isEnabled: boolean;
}

export interface GuestMessage {
  id: string;
  hotelId: string;
  ruleId?: string;
  reservationId?: string;
  recipient: string;
  channel: string;
  subject: string;
  body?: string;
  isSent: boolean;
  sentAt?: string;
  channelReference?: string;
  error?: string;
}

export interface SendMessageCommand {
  hotelId: string;
  reservationId: string;
  channel: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AutomationService {
  private workflowsUrl = environment.automationApiUrl;
  private messagesUrl = environment.messagesApiUrl;

  constructor(private http: HttpClient) {}

  getTriggers(): Observable<TriggerEventInfo[]> {
    return this.http.get<TriggerEventInfo[]>(`${this.workflowsUrl}/triggers`);
  }

  getChannels(): Observable<string[]> {
    return this.http.get<string[]>(`${this.workflowsUrl}/channels`);
  }

  getRules(hotelId: string): Observable<AutomationRule[]> {
    return this.http.get<AutomationRule[]>(this.workflowsUrl, { params: new HttpParams().set('hotelId', hotelId) });
  }

  createRule(command: UpsertAutomationRuleCommand): Observable<AutomationRule> {
    return this.http.post<AutomationRule>(this.workflowsUrl, command);
  }

  updateRule(id: string, command: UpsertAutomationRuleCommand): Observable<AutomationRule> {
    return this.http.put<AutomationRule>(`${this.workflowsUrl}/${id}`, command);
  }

  toggleRule(id: string): Observable<void> {
    return this.http.put<void>(`${this.workflowsUrl}/${id}/toggle`, {});
  }

  deleteRule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.workflowsUrl}/${id}`);
  }

  getMessages(hotelId: string, reservationId?: string, limit = 100): Observable<GuestMessage[]> {
    let params = new HttpParams().set('hotelId', hotelId).set('limit', limit.toString());
    if (reservationId) params = params.set('reservationId', reservationId);
    return this.http.get<GuestMessage[]>(this.messagesUrl, { params });
  }

  sendManual(command: SendMessageCommand): Observable<GuestMessage> {
    return this.http.post<GuestMessage>(`${this.messagesUrl}/send`, command);
  }
}