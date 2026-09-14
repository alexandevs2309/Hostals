import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService } from '@/app/core/services/hotel.service';
import { ReservationService, Reservation } from '@/app/core/services/reservation.service';
import {
  AutomationService,
  TriggerEventInfo,
  AutomationRule,
  GuestMessage
} from '@/app/core/services/automation.service';

@Component({
  selector: 'app-workflows',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflows.html',
  styleUrl: './workflows.scss'
})
export class WorkflowsPage implements OnInit {
  private hotelsApi = inject(HotelService);
  private automationApi = inject(AutomationService);
  private reservationsApi = inject(ReservationService);

  readonly placeholders = '{Hotel} {Huesped} {Folio} {Habitacion} {TipoHabitacion} {Llegada} {Salida} {Noches} {Total}';

  hotelId = signal<string | null>(null);
  hotelName = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  activeSection = signal<'rules' | 'messages'>('rules');

  triggers = signal<TriggerEventInfo[]>([]);
  channels = signal<string[]>([]);
  rules = signal<AutomationRule[]>([]);
  messages = signal<GuestMessage[]>([]);
  reservations = signal<Reservation[]>([]);

  editingId = signal<string | null>(null);
  form = signal<{ name: string; triggerEvent: string; channel: string; template: string; isEnabled: boolean }>({
    name: '',
    triggerEvent: '',
    channel: 'WhatsApp',
    template: '',
    isEnabled: true
  });
  formMsg = signal<{ ok: boolean; text: string } | null>(null);

  manual = signal<{ reservationId: string; channel: string; message: string }>({
    reservationId: '',
    channel: 'WhatsApp',
    message: ''
  });
  manualMsg = signal<{ ok: boolean; text: string } | null>(null);

  constructor() {}

  ngOnInit(): void {
    this.resolveHotel();
  }

  private resolveHotel(): void {
    const stored = localStorage.getItem('auth_hotel_id');
    const onHotel = (hotel: { id: string; name: string }): void => {
      this.hotelId.set(hotel.id);
      this.hotelName.set(hotel.name);
      this.load();
    };

    if (stored) {
      this.hotelsApi.getHotelById(stored).subscribe({
        next: onHotel,
        error: () => this.fail('No se pudo cargar la propiedad.')
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

  private fail(text: string): void {
    this.error.set(text);
    this.loading.set(false);
  }

  private load(): void {
    const id = this.hotelId();
    if (!id) return;
    this.loading.set(true);
    this.error.set(null);

    this.automationApi.getTriggers().subscribe({
      next: (t) => {
        this.triggers.set(t);
        if (!this.form().triggerEvent && t.length > 0) {
          this.form.update((f) => ({ ...f, triggerEvent: t[0].name }));
        }
      },
      error: () => this.triggers.set([])
    });

    this.automationApi.getChannels().subscribe({
      next: (c) => this.channels.set(c),
      error: () => this.channels.set(['WhatsApp', 'Sms', 'Email'])
    });

    this.automationApi.getRules(id).subscribe({
      next: (rules) => {
        this.rules.set(rules);
        this.loading.set(false);
      },
      error: () => this.fail('No se pudieron cargar las reglas de automatización.')
    });

    this.loadMessages();
    this.loadReservations();
  }

  retry(): void {
    this.error.set(null);
    this.load();
  }

  switchSection(section: 'rules' | 'messages'): void {
    this.activeSection.set(section);
  }

  loadMessages(): void {
    const id = this.hotelId();
    if (!id) return;
    this.automationApi.getMessages(id).subscribe({
      next: (list) => this.messages.set(list),
      error: () => this.messages.set([])
    });
  }

  private loadReservations(): void {
    const id = this.hotelId();
    if (!id) return;
    this.reservationsApi.getReservations({ pageNumber: 1, pageSize: 20 }, { hotelId: id }).subscribe({
      next: (page) => this.reservations.set(page.items),
      error: () => this.reservations.set([])
    });
  }

  triggerLabel(name: string): string {
    const t = this.triggers().find((x) => x.name === name);
    return t ? `${t.name} — ${t.description}` : name;
  }

  channelIcon(channel: string): string {
    if (channel === 'WhatsApp') return 'pi pi-comments';
    if (channel === 'Sms') return 'pi pi-comment';
    return 'pi pi-envelope';
  }

  setFormField(field: 'name' | 'triggerEvent' | 'channel' | 'template' | 'isEnabled', value: string | boolean): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  startNew(): void {
    this.editingId.set(null);
    this.formMsg.set(null);
    this.form.set({
      name: '',
      triggerEvent: this.triggers()[0]?.name ?? 'ReservationCreated',
      channel: 'WhatsApp',
      template: '',
      isEnabled: true
    });
  }

  edit(rule: AutomationRule): void {
    this.editingId.set(rule.id);
    this.formMsg.set(null);
    this.form.set({
      name: rule.name,
      triggerEvent: rule.triggerEvent,
      channel: rule.channel,
      template: rule.template,
      isEnabled: rule.isEnabled
    });
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.formMsg.set(null);
  }

  save(): void {
    const id = this.hotelId();
    const f = this.form();
    if (!id) return;
    if (!f.name.trim() || !f.triggerEvent || !f.template.trim()) {
      this.formMsg.set({ ok: false, text: 'Completa nombre, evento y plantilla.' });
      return;
    }

    const command = { hotelId: id, name: f.name.trim(), triggerEvent: f.triggerEvent, channel: f.channel, template: f.template.trim(), isEnabled: f.isEnabled };
    const op = this.editingId()
      ? this.automationApi.updateRule(this.editingId()!, command)
      : this.automationApi.createRule(command);

    op.subscribe({
      next: () => {
        this.formMsg.set({ ok: true, text: this.editingId() ? 'Regla actualizada.' : 'Regla creada.' });
        this.reloadRules();
        this.startNew();
      },
      error: () => this.formMsg.set({ ok: false, text: 'No se pudo guardar la regla.' })
    });
  }

  toggle(rule: AutomationRule): void {
    this.automationApi.toggleRule(rule.id).subscribe({
      next: () => this.reloadRules(),
      error: () => this.formMsg.set({ ok: false, text: 'No se pudo cambiar el estado.' })
    });
  }

  deleteRule(rule: AutomationRule): void {
    if (!confirm(`¿Eliminar la regla "${rule.name}"? Los mensajes ya enviados se conservan.`)) return;
    this.automationApi.deleteRule(rule.id).subscribe({
      next: () => this.reloadRules(),
      error: () => this.formMsg.set({ ok: false, text: 'No se pudo eliminar la regla.' })
    });
  }

  reloadRules(): void {
    const id = this.hotelId();
    if (!id) return;
    this.automationApi.getRules(id).subscribe({
      next: (rules) => this.rules.set(rules),
      error: () => this.rules.set([])
    });
  }

  reservationLabel(r: Reservation): string {
    return `${r.reservationNumber} · ${r.guestName} (${r.roomNumber})`;
  }

  setManualField(field: 'reservationId' | 'channel' | 'message', value: string): void {
    this.manual.update((m) => ({ ...m, [field]: value }));
  }

  sendManual(): void {
    const id = this.hotelId();
    const m = this.manual();
    if (!id) return;
    if (!m.reservationId || !m.message.trim()) {
      this.manualMsg.set({ ok: false, text: 'Elige una reserva y escribe el mensaje.' });
      return;
    }

    this.automationApi.sendManual({ hotelId: id, reservationId: m.reservationId, channel: m.channel, message: m.message.trim() }).subscribe({
      next: () => {
        this.manualMsg.set({ ok: true, text: 'Mensaje enviado.' });
        this.manual.update((mm) => ({ ...mm, message: '' }));
        this.loadMessages();
      },
      error: () => this.manualMsg.set({ ok: false, text: 'No se pudo enviar el mensaje.' })
    });
  }
}