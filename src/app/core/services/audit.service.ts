import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuditLogItem {
  id: string;
  userId?: string | null;
  userName?: string | null;
  action: string;
  module?: string | null;
  entity?: string | null;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export interface AuditLogPage {
  items: AuditLogItem[];
  total: number;
}

export interface AuditLogQuery {
  action?: string;
  search?: string;
  from?: Date | null;
  to?: Date | null;
  pageNumber: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly baseUrl = environment.auditApiUrl;

  constructor(private http: HttpClient) {}

  getLogs(query: AuditLogQuery): Observable<AuditLogPage> {
    let params = new HttpParams()
      .set('pageNumber', String(query.pageNumber))
      .set('pageSize', String(query.pageSize));

    if (query.action) params = params.set('action', query.action);
    if (query.search) params = params.set('search', query.search);
    if (query.from) params = params.set('from', query.from.toISOString());
    if (query.to) params = params.set('to', query.to.toISOString());

    return this.http.get<AuditLogPage>(this.baseUrl, { params });
  }
}