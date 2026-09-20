import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WebsiteSection {
  id: string;
  name: string;
  sectionType: string;
  bodyJson: string;
  sortOrder: number;
}

export interface WebsitePageDto {
  id: string;
  path: string;
  title: string;
  metaDescription?: string;
  sortOrder: number;
  isHome: boolean;
  showInMenu: boolean;
  sections: WebsiteSection[];
}

export interface WebsiteDto {
  id: string;
  hotelId: string;
  hotelName: string;
  name: string;
  slug: string;
  theme: string;
  isPublished: boolean;
  isCustomDomainVerified: boolean;
  customDomain?: string;
  cnameTarget?: string;
  createdAt: string;
  updatedAt?: string;
  pages: WebsitePageDto[];
}

export interface CreateWebsiteRequest {
  hotelId: string;
  name: string;
  slug?: string;
  customDomain?: string;
  theme?: string;
}

export interface UpdateWebsiteSectionRequest {
  sectionId?: string;
  name: string;
  sectionType: string;
  bodyJson: string;
  sortOrder: number;
}

export interface UpdateWebsitePageRequest {
  pageId?: string;
  path: string;
  title: string;
  metaDescription?: string;
  sortOrder: number;
  isHome: boolean;
  showInMenu: boolean;
  sections: UpdateWebsiteSectionRequest[];
}

export interface UpdateWebsiteRequest {
  id: string;
  name: string;
  slug?: string;
  customDomain?: string;
  theme?: string;
  pages?: UpdateWebsitePageRequest[];
}

export interface PublicSiteSectionDto {
  id: string;
  name: string;
  sectionType: string;
  bodyJson: string;
  sortOrder: number;
}

export interface PublicRoomDto {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  maxOccupancy: number;
  imageUrl?: string;
  amenities: string[];
  totalRooms: number;
  availableRooms: number;
}

export interface PublicSitePageDto {
  id: string;
  path: string;
  title: string;
  metaDescription?: string;
  isHome: boolean;
  sections: PublicSiteSectionDto[];
}

export interface PublicSiteDto {
  id: string;
  slug: string;
  name: string;
  customDomain?: string;
  theme: string;
  isPublished: boolean;
  hotelId: string;
  hotelName: string;
  rooms: PublicRoomDto[];
  pages: PublicSitePageDto[];
}

@Injectable({
  providedIn: 'root'
})
export class WebsiteService {
  private websitesUrl = `${environment.hotelsApiUrl.replace(/\/hotels$/, '')}/websites`;

  constructor(private http: HttpClient) {}

  getWebsites(hotelId: string): Observable<WebsiteDto[]> {
    let params = new HttpParams().set('hotelId', hotelId);
    return this.http.get<WebsiteDto[]>(this.websitesUrl, { params });
  }

  getWebsite(id: string): Observable<WebsiteDto> {
    return this.http.get<WebsiteDto>(`${this.websitesUrl}/${id}`);
  }

  getWebsiteBySlug(slug: string): Observable<WebsiteDto> {
    return this.http.get<WebsiteDto>(`${this.websitesUrl}/by-slug/${slug}`);
  }

  getPublicSite(slug: string): Observable<PublicSiteDto> {
    return this.http.get<PublicSiteDto>(`${environment.apiUrl}/v1/public/sites/${slug}`);
  }

  createWebsite(request: CreateWebsiteRequest): Observable<WebsiteDto> {
    return this.http.post<WebsiteDto>(this.websitesUrl, request);
  }

  updateWebsite(request: UpdateWebsiteRequest): Observable<WebsiteDto> {
    return this.http.put<WebsiteDto>(`${this.websitesUrl}/${request.id}`, request);
  }

  deleteWebsite(id: string): Observable<void> {
    return this.http.delete<void>(`${this.websitesUrl}/${id}`);
  }

  publishWebsite(id: string, publish: boolean): Observable<WebsiteDto> {
    return this.http.patch<WebsiteDto>(`${this.websitesUrl}/${id}/publish`, { publish });
  }
}
