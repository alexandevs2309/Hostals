import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PaginatedQuery, PaginatedResult } from './hotel.service';

export interface FinanceSummary {
    totalRevenue: number;
    collected: number;
    outstanding: number;
    averageDailyRate: number;
    occupancyRate: number;
    completedStays: number;
    openInvoices: number;
    overdueInvoices: number;
    methods: { method: string; displayName: string; amount: number; count: number }[];
}

export interface Payment {
    id: string;
    reservationId: string;
    reservationNumber: string;
    roomNumber: string;
    guestName: string;
    amount: number;
    paymentMethod: string;
    paymentMethodDisplay: string;
    status: string;
    referenceNumber?: string;
    processedBy?: string;
    paymentDate: string;
    isRefund: boolean;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    status: string;
    statusDescription: string;
    customerName: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    reservationNumber: string;
    reservationId?: string;
    hotelId: string;
    hotelName: string;
    daysOverdue: number;
}

export interface InvoiceLine {
    description: string;
    unitPrice: number;
    quantity: number;
    total: number;
    taxCode?: string;
    category: string;
}

export interface InvoiceDetail extends Invoice {
    lineItems: InvoiceLine[];
    notes?: string;
    paymentTerms?: string;
    customerEmail?: string;
}

export interface CreatePaymentRequest {
    reservationId: string;
    amount: number;
    paymentMethod: string;
    cardType?: string;
    lastFourDigits?: string;
    referenceNumber?: string;
}

export interface CreateInvoiceRequest {
    reservationId: string;
    notes?: string;
    paymentTerms?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FinanceService {
    private financeUrl = environment.financeApiUrl;

    constructor(private http: HttpClient) {}

    getSummary(hotelId?: string, from?: string, to?: string): Observable<FinanceSummary> {
        let params = new HttpParams();
        if (hotelId) params = params.set('hotelId', hotelId);
        if (from) params = params.set('from', from);
        if (to) params = params.set('to', to);
        return this.http.get<FinanceSummary>(`${this.financeUrl}/summary`, { params });
    }

    getPayments(query: PaginatedQuery, filter: { hotelId?: string; status?: string; search?: string }): Observable<PaginatedResult<Payment>> {
        let params = new HttpParams()
            .set('pageNumber', query.pageNumber.toString())
            .set('pageSize', query.pageSize.toString());
        if (filter.hotelId) params = params.set('hotelId', filter.hotelId);
        if (filter.status) params = params.set('status', filter.status);
        if (filter.search) params = params.set('search', filter.search);
        return this.http.get<PaginatedResult<Payment>>(`${this.financeUrl}/payments`, { params });
    }

    getInvoices(query: PaginatedQuery, filter: { hotelId?: string; status?: string; search?: string }): Observable<PaginatedResult<Invoice>> {
        let params = new HttpParams()
            .set('pageNumber', query.pageNumber.toString())
            .set('pageSize', query.pageSize.toString());
        if (filter.hotelId) params = params.set('hotelId', filter.hotelId);
        if (filter.status) params = params.set('status', filter.status);
        if (filter.search) params = params.set('search', filter.search);
        return this.http.get<PaginatedResult<Invoice>>(`${this.financeUrl}/invoices`, { params });
    }

    getInvoiceById(id: string): Observable<InvoiceDetail> {
        return this.http.get<InvoiceDetail>(`${this.financeUrl}/invoices/${id}`);
    }

    createPayment(data: CreatePaymentRequest): Observable<Payment> {
        return this.http.post<Payment>(`${this.financeUrl}/payments`, data);
    }

    createInvoice(data: CreateInvoiceRequest): Observable<Invoice> {
        return this.http.post<Invoice>(`${this.financeUrl}/invoices`, data);
    }

    issueInvoice(id: string): Observable<Invoice> {
        return this.http.patch<Invoice>(`${this.financeUrl}/invoices/${id}/issue`, {});
    }

    cancelInvoice(id: string, reason?: string): Observable<Invoice> {
        return this.http.patch<Invoice>(`${this.financeUrl}/invoices/${id}/cancel`, { reason });
    }

    registerInvoicePayment(id: string, amount: number, method: string): Observable<Invoice> {
        return this.http.post<Invoice>(`${this.financeUrl}/invoices/${id}/payment`, { amount, paymentMethod: method });
    }
}