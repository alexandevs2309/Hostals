import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UserProperty {
  propertyId: string;
  name: string;
  propertyRole: string;
  currency: string;
}

export interface OrganizationPropertyDto {
  propertyId: string;
  name: string;
  propertyRole: string;
  currency: string;
}

export interface OrganizationSummary {
  organizationId: string;
  name: string;
  businessName?: string;
  taxId?: string;
  plan: string;
  defaultCurrency: string;
  timeZone: string;
  myOrganizationRole: string;
  memberCount: number;
  properties: OrganizationPropertyDto[];
}

export interface OrganizationMemberPropertiesDto {
  propertyId: string;
  propertyName: string;
  propertyRole: string;
}

export interface OrganizationMemberDto {
  userId: string;
  email: string;
  fullName: string;
  organizationRole: string;
  isActive: boolean;
  properties: OrganizationMemberPropertiesDto[];
}

export interface InviteMemberCommand {
  email: string;
  firstName: string;
  lastName: string;
  organizationRole: string;
  properties: { propertyId: string; propertyRole: string }[];
}

export interface InviteMemberResult {
  member: OrganizationMemberDto;
  temporaryPassword: string;
}

export interface UpdateMemberCommand {
  organizationRole: string;
  isActive: boolean;
  properties: { propertyId: string; propertyRole: string }[];
}

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly orgUrl = environment.organizationApiUrl;

  constructor(private readonly http: HttpClient) {}

  getMyOrganization(): Observable<OrganizationSummary> {
    return this.http.get<OrganizationSummary>(this.orgUrl);
  }

  getMyProperties(): Observable<UserProperty[]> {
    return this.http.get<UserProperty[]>(`${this.orgUrl}/properties`);
  }

  getMembers(): Observable<OrganizationMemberDto[]> {
    return this.http.get<OrganizationMemberDto[]>(`${this.orgUrl}/members`);
  }

  inviteMember(command: InviteMemberCommand): Observable<InviteMemberResult> {
    return this.http.post<InviteMemberResult>(`${this.orgUrl}/members`, command);
  }

  updateMember(userId: string, command: UpdateMemberCommand): Observable<OrganizationMemberDto> {
    return this.http.put<OrganizationMemberDto>(`${this.orgUrl}/members/${userId}`, command);
  }

  removeMember(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.orgUrl}/members/${userId}`);
  }
}