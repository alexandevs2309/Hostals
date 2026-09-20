import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, firstValueFrom } from 'rxjs';
import { HotelService, NoHotelConfiguredError } from '@/app/core/services/hotel.service';
import { ReservationService, Reservation } from '@/app/core/services/reservation.service';
import { FinanceService, FinanceSummary, Invoice, InvoiceDetail, NightAuditReport, Payment } from '@/app/core/services/finance.service';
import { formatMoney } from '@/app/shared/utils/money';

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
    showRefund = signal(false);
    refundTarget = signal<Payment | null>(null);

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

    refundForm = {
        amount: 0,
        reason: ''
    };

    showNightAudit = signal(false);
    nightAudit = signal<NightAuditReport | null>(null);
    nightAuditBusy = signal(false);

    showFolioPos = signal(false);
    posBusy = signal(false);
    folioPos = {
        description: '',
        unitPrice: 0,
        quantity: 1,
        category: 'Food'
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
        this.hotelsApi.resolveActiveHotel().subscribe({
            next: (hotel) => {
                this.hotelId.set(hotel.id);
                this.hotelName.set(hotel.name);
                this.loadAll();
            },
            error: (err) => this.fail(err instanceof NoHotelConfiguredError
                ? 'No hay ninguna propiedad configurada todavía.'
                : 'No se pudo cargar la propiedad. Vuelve a iniciar sesión.')
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
            { hotelId: id, status: this.filterStatus() === 'Todos' ? undefined : this.filterStatus(), search: this.search().trim() || undefined }
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
            { hotelId: id, status: this.filterStatus() === 'Todos' ? undefined : this.filterStatus(), search: this.search().trim() || undefined }
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
        this.reloadTab();
    }

    onStatusFilter(status: string): void {
        this.filterStatus.set(status);
        this.page.set(1);
        this.reloadTab();
    }

    onSearchChange(): void {
        this.page.set(1);
        this.reloadTab();
    }

    private reloadTab(): void {
        const id = this.hotelId();
        if (!id) return;
        if (this.tab() === 'payments') this.loadPayments();
        else this.loadInvoices();
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
        return formatMoney(n);
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

    sendInvoice(i: Invoice): void {
        this.act('Factura enviada al cliente.', () => firstValueFrom(this.financeApi.sendInvoice(i.id)));
    }

    openRefund(p: Payment): void {
        this.refundTarget.set(p);
        this.refundForm = { amount: p.amount, reason: '' };
        this.showRefund.set(true);
    }

    submitRefund(): void {
        const p = this.refundTarget();
        if (!p || this.refundForm.amount <= 0) return;
        this.showRefund.set(false);
        this.act('Pago reembolsado.', () => firstValueFrom(this.financeApi.refundPayment(
            p.id,
            Number(this.refundForm.amount),
            this.refundForm.reason.trim() || undefined
        )));
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

    // ── Night audit ───────────────────────────────────────
    runNightAudit(): void {
        const id = this.hotelId();
        if (!id || this.nightAuditBusy()) return;
        this.nightAuditBusy.set(true);
        this.nightAudit.set(null);
        this.showNightAudit.set(true);
        this.financeApi.runNightAudit({ hotelId: id }).subscribe({
            next: (report) => {
                this.nightAudit.set(report);
                this.nightAuditBusy.set(false);
                this.loadAll();
            },
            error: (e) => {
                this.msg.set(e?.error ?? 'No se pudo ejecutar el night audit.');
                this.msgError.set(true);
                this.nightAuditBusy.set(false);
                this.showNightAudit.set(false);
            }
        });
    }

    categoryLabel(c: string): string {
        return ({ Room: 'Habitación', Food: 'Alimentos', Beverage: 'Bebidas', Service: 'Servicio', Other: 'Otros' } as Record<string, string>)[c] ?? c;
    }

    // ── POS al folio ───────────────────────────────────────
    openFolioPos(): void {
        this.folioPos = { description: '', unitPrice: 0, quantity: 1, category: 'Food' };
        this.showFolioPos.set(true);
    }

    canAddFolioPos(): boolean {
        return !!this.folioPos.description.trim() && this.folioPos.unitPrice > 0 && this.folioPos.quantity > 0;
    }

    submitFolioPos(): void {
        const d = this.invoiceDetail();
        if (!d?.reservationId || !this.canAddFolioPos()) return;
        this.showFolioPos.set(false);
        this.posBusy.set(true);
        this.msg.set('');
        this.financeApi.addFolioItem(d.reservationId, {
            description: this.folioPos.description.trim(),
            unitPrice: Number(this.folioPos.unitPrice),
            quantity: Number(this.folioPos.quantity),
            category: this.folioPos.category
        }).subscribe({
            next: () => {
                this.msg.set('Cargo agregado al folio.');
                this.msgError.set(false);
                this.posBusy.set(false);
                this.viewInvoice(d);
                this.loadAll();
            },
            error: (e) => {
                this.msg.set(e?.error ?? 'La operación falló.');
                this.msgError.set(true);
                this.posBusy.set(false);
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