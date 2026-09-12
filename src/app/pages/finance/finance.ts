import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, firstValueFrom } from 'rxjs';
import { HotelService } from '@/app/core/services/hotel.service';
import { ReservationService, Reservation } from '@/app/core/services/reservation.service';
import { FinanceService, FinanceSummary, Invoice, InvoiceDetail, Payment } from '@/app/core/services/finance.service';

const PAYMENT_STATUS_LABEL: Record<string, string> = {
    Completed: 'Completado',
    Pending: 'Pendiente',
    Failed: 'Fallido',
    Refunded: 'Reembolsado'
};

const INVOICE_STATUS_LABEL: Record<string, string> = {
    Draft: 'Borrador',
    Issued: 'Emitida',
    Sent: 'Enviada',
    Paid: 'Pagada',
    Overdue: 'Vencida',
    Cancelled: 'Cancelada'
};

const METHOD_LABEL: Record<string, string> = {
    Cash: 'Efectivo',
    CreditCard: 'Tarjeta de crédito',
    DebitCard: 'Tarjeta de débito',
    Transfer: 'Transferencia',
    Check: 'Cheque'
};

@Component({
    selector: 'app-finance',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './finance.html',
    styleUrl: './finance.scss'
})
export class FinancePage implements OnInit {
    private financeApi = inject(FinanceService);
    private hotelsApi = inject(HotelService);
    private reservationsApi = inject(ReservationService);

    hotelId = signal<string | null>(null);
    hotelName = signal('');
    loading = signal(true);
    error = signal<string | null>(null);

    tab = signal<'payments' | 'invoices'>('payments');

    summary = signal<FinanceSummary | null>(null);

    payments = signal<Payment[]>([]);
    paymentsTotal = signal(0);
    invoices = signal<Invoice[]>([]);
    invoicesTotal = signal(0);
    page = signal(1);
    pageSize = 40;

    filterStatus = signal('Todos');
    search = signal('');
    busy = signal(false);
    msg = signal('');
    msgError = signal(false);

    showPayment = signal(false);
    showInvoiceFromReservation = signal(false);
    showDetail = signal(false);
    invoiceDetail = signal<InvoiceDetail | null>(null);
    detailLoading = signal(false);
    showPayInvoice = signal(false);

    reservations = signal<Reservation[]>([]);

    form = {
        reservationId: '',
        amount: 0,
        paymentMethod: 'Cash',
        cardType: 'Visa',
        lastFourDigits: '',
        referenceNumber: '',
        notes: '',
        paymentTerms: '30 días'
    };

    payInvoice = {
        amount: 0,
        paymentMethod: 'Cash'
    };

    statusOptionsPayment = ['Todos', 'Completed', 'Pending', 'Failed', 'Refunded'];
    statusOptionsInvoice = ['Todos', 'Draft', 'Issued', 'Sent', 'Paid', 'Overdue'];

    pageInfoPayments = computed(() => Math.max(1, Math.ceil(this.paymentsTotal() / this.pageSize)));
    pageInfoInvoices = computed(() => Math.max(1, Math.ceil(this.invoicesTotal() / this.pageSize)));

    payables = computed(() =>
        this.reservations().filter((r) => (r.status === 'Confirmed' || r.status === 'CheckedIn') && r.balanceDue > 0));

    ngOnInit(): void {
        this.resolveHotel();
    }

    private resolveHotel(): void {
        const stored = localStorage.getItem('auth_hotel_id');
        const onHotel = (hotel: { id: string; name: string }): void => {
            this.hotelId.set(hotel.id);
            this.hotelName.set(hotel.name);
            this.loadAll();
        };

        if (stored) {
            this.hotelsApi.getHotelById(stored).subscribe({
                next: onHotel,
                error: () => this.fail('No se pudo cargar la propiedad. Vuelve a iniciar sesión.')
            });
            return;
        }

        this.hotelsApi.getHotels({ pageNumber: 1, pageSize: 1 }).subscribe({
            next: (page) => {
                const hotel = page.items[0];
                if (hotel) onHotel(hotel);
                else this.fail('No hay ninguna propiedad configurada todavía.');
            },
            error: () => this.fail('No se pudo cargar la propiedad.')
        });
    }

    private loadAll(): void {
        const id = this.hotelId();
        if (!id) return;
        this.loading.set(true);
        this.error.set(null);
        forkJoin({
            summary: this.financeApi.getSummary(id)
        }).subscribe({
            next: ({ summary }) => {
                this.summary.set(summary);
                this.loading.set(false);
                this.loadPayments();
                this.loadInvoices();
            },
            error: () => {
                this.loading.set(false);
                this.fail('No se pudieron cargar los datos financieros.');
            }
        });
    }

    private loadPayments(): void {
        const id = this.hotelId();
        if (!id) return;
        this.financeApi.getPayments(
            { pageNumber: this.page(), pageSize: this.pageSize },
            { hotelId: id, status: undefined, search: undefined }
        ).subscribe({
            next: (page) => {
                this.payments.set(page.items);
                this.paymentsTotal.set(page.totalCount);
            },
            error: () => {}
        });
    }

    private loadInvoices(): void {
        const id = this.hotelId();
        if (!id) return;
        this.financeApi.getInvoices(
            { pageNumber: this.page(), pageSize: this.pageSize },
            { hotelId: id, status: undefined, search: undefined }
        ).subscribe({
            next: (page) => {
                this.invoices.set(page.items);
                this.invoicesTotal.set(page.totalCount);
            },
            error: () => {}
        });
    }

    private fail(message: string): void {
        this.error.set(message);
        this.loading.set(false);
    }

    retry(): void {
        const id = this.hotelId();
        if (id) this.loadAll();
        else this.resolveHotel();
    }

    setTab(t: 'payments' | 'invoices'): void {
        this.tab.set(t);
        this.page.set(1);
        this.filterStatus.set('Todos');
        this.search.set('');
    }

    label(s: string): string {
        return PAYMENT_STATUS_LABEL[s] ?? INVOICE_STATUS_LABEL[s] ?? s;
    }

    payStatusLabel(s: string): string {
        return PAYMENT_STATUS_LABEL[s] ?? s;
    }

    invStatusLabel(s: string): string {
        return INVOICE_STATUS_LABEL[s] ?? s;
    }

    methodDisplay(m: string): string {
        return METHOD_LABEL[m] ?? m;
    }

    fmtDate(d?: string): string {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    fmtMoney(n: number): string {
        return '$' + (n ?? 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    private act(title: string, fn: () => Promise<unknown>): void {
        this.busy.set(true);
        this.msg.set('');
        fn().then(() => {
            this.msg.set(title);
            this.msgError.set(false);
            this.loadAll();
        }).catch((e) => {
            this.msg.set(e?.error ?? 'La operación falló. Intenta de nuevo.');
            this.msgError.set(true);
            this.loadAll();
        }).finally(() => this.busy.set(false));
    }

    // ── Modales ────────────────────────────────────────────
    loadReservationsForPicker(kind: 'payment' | 'invoice'): void {
        const id = this.hotelId();
        if (!id) return;
        this.reservationsApi.getReservations({ pageNumber: 1, pageSize: 100 }, { hotelId: id }).subscribe({
            next: (page) => {
                this.reservations.set(page.items);
                if (kind === 'payment') {
                    this.form = { reservationId: '', amount: 0, paymentMethod: 'Cash', cardType: 'Visa', lastFourDigits: '', referenceNumber: '', notes: '', paymentTerms: '30 días' };
                    this.showPayment.set(true);
                } else {
                    this.form.reservationId = '';
                    this.showInvoiceFromReservation.set(true);
                }
            },
            error: () => {}
        });
    }

    onReservationPicked(): void {
        const r = this.reservations().find((x) => x.id === this.form.reservationId);
        if (r) this.form.amount = r.balanceDue > 0 ? r.balanceDue : r.totalAmount;
    }

    canCreatePayment(): boolean {
        return !!(this.form.reservationId && this.form.amount > 0);
    }

    submitPayment(): void {
        if (!this.canCreatePayment()) return;
        this.showPayment.set(false);
        this.act('Pago registrado correctamente.', () => firstValueFrom(this.financeApi.createPayment({
            reservationId: this.form.reservationId,
            amount: Number(this.form.amount),
            paymentMethod: this.form.paymentMethod,
            cardType: this.form.paymentMethod.includes('Card') ? this.form.cardType : undefined,
            lastFourDigits: this.form.lastFourDigits.trim() || undefined,
            referenceNumber: this.form.referenceNumber.trim() || undefined
        })));
    }

    canCreateInvoice(): boolean {
        return !!this.form.reservationId;
    }

    submitInvoice(): void {
        if (!this.canCreateInvoice()) return;
        this.showInvoiceFromReservation.set(false);
        this.act('Factura creada correctamente.', () => firstValueFrom(this.financeApi.createInvoice({
            reservationId: this.form.reservationId,
            notes: this.form.notes.trim() || undefined,
            paymentTerms: this.form.paymentTerms.trim() || undefined
        })));
    }

    issueInvoice(i: Invoice): void {
        this.act('Factura emitida.', () => firstValueFrom(this.financeApi.issueInvoice(i.id)));
    }

    cancelInvoice(i: Invoice): void {
        this.act('Factura cancelada.', () => firstValueFrom(this.financeApi.cancelInvoice(i.id)));
    }

    viewInvoice(i: { id: string }): void {
        this.invoiceDetail.set(null);
        this.showDetail.set(true);
        this.detailLoading.set(true);
        this.financeApi.getInvoiceById(i.id).subscribe({
            next: (d) => {
                this.invoiceDetail.set(d);
                this.detailLoading.set(false);
            },
            error: () => {
                this.detailLoading.set(false);
            }
        });
    }

    openPayInvoice(): void {
        const d = this.invoiceDetail();
        if (!d) return;
        this.payInvoice = { amount: d.balanceDue > 0 ? d.balanceDue : d.totalAmount, paymentMethod: 'Cash' };
        this.showPayInvoice.set(true);
    }

    submitInvoicePayment(): void {
        const d = this.invoiceDetail();
        if (!d || this.payInvoice.amount <= 0) return;
        this.showPayInvoice.set(false);
        this.busy.set(true);
        this.msg.set('');
        this.financeApi.registerInvoicePayment(d.id, Number(this.payInvoice.amount), this.payInvoice.paymentMethod).subscribe({
            next: () => {
                this.msg.set('Pago de factura registrado.');
                this.msgError.set(false);
                this.busy.set(false);
                this.viewInvoice(d);
                this.loadAll();
            },
            error: (e) => {
                this.msg.set(e?.error ?? 'La operación falló. Intenta de nuevo.');
                this.msgError.set(true);
                this.busy.set(false);
            }
        });
    }

    goPage(delta: number): void {
        const next = Math.max(1, Math.min(this.tab() === 'payments' ? this.pageInfoPayments() : this.pageInfoInvoices(), this.page() + delta));
        if (next === this.page()) return;
        this.page.set(next);
        if (this.tab() === 'payments') this.loadPayments();
        else this.loadInvoices();
    }

    reservationRef(id: string): string {
        return this.reservations().find((r) => r.id === id)?.reservationNumber ?? '';
    }
}