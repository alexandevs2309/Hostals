import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HotelService, NoHotelConfiguredError, RoomTypeDto } from '@/app/core/services/hotel.service';
import {
  ChannelService,
  Channel,
  ChannelMapping,
  PushResult,
  BookingPull,
  BookingImport
} from '@/app/core/services/channel.service';
import {
  WidgetService,
  PaymentsService,
  GatewayInfo,
  WidgetConfig
} from '@/app/core/services/widget.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-channels',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './channels.html',
  styleUrl: './channels.scss'
})
export class ChannelsPage implements OnInit {
  private hotelsApi = inject(HotelService);
  private channelApi = inject(ChannelService);
  private widgetApi = inject(WidgetService);
  private paymentsApi = inject(PaymentsService);

  hotelId = signal<string | null>(null);
  hotelName = signal('');
  loading = signal(true);
  error = signal<string | null>(null);

  channels = signal<Channel[]>([]);
  roomTypes = signal<RoomTypeDto[]>([]);
  expanded = signal<string | null>(null);
  activeTab = signal<Record<string, string>>({});

  credentials = signal<Record<string, string | undefined>>({});
  credMsg = signal<Record<string, { ok: boolean; text: string }>>({});

  connection = signal<Record<string, { ok: boolean; text: string }>>({});
  mappings = signal<Record<string, ChannelMapping[] | undefined>>({});
  pushMsg = signal<Record<string, { ok: boolean; text: string }>>({});
  pull = signal<Record<string, BookingPull[] | undefined>>({});
  importResult = signal<Record<string, BookingImport[] | undefined>>({});

  pushDates = signal<Record<string, { from: string; to: string }>>({});
  newMapping = signal<Record<string, { roomTypeId: string; channelRoomCode: string; channelRatePlanCode: string }>>({});

  widgetConfig = signal<WidgetConfig | null>(null);
  gateways = signal<GatewayInfo[]>([]);
  widgetScriptUrl = signal('');
  payMsg = signal<{ ok: boolean; text: string } | null>(null);
  payGateways = signal<Record<string, { ok: boolean; text: string }>>({});

  snippet = signal('');

  constructor() {
    this.widgetScriptUrl.set(`${environment.widgetApiUrl}/script?hotelId=PLACEHOLDER`);
  }

  private isoAdd(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  ngOnInit(): void {
    this.resolveHotel();
    this.paymentsApi.getGateways().subscribe({ next: (g) => this.gateways.set(g), error: () => this.gateways.set([]) });
  }

  private resolveHotel(): void {
    this.hotelsApi.resolveActiveHotel().subscribe({
      next: (hotel) => {
        this.hotelId.set(hotel.id);
        this.hotelName.set(hotel.name);
        this.load();
      },
      error: (err) => this.fail(err instanceof NoHotelConfiguredError
        ? 'No hay ninguna propiedad configurada todavía.'
        : 'No se pudo cargar la propiedad.')
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

    this.channelApi.getChannels(id).subscribe({
      next: (channels) => {
        this.channels.set(channels);
        this.loading.set(false);
        for (const c of channels) {
          this.loadCredentials(c);
          if (!this.pushDates()[c.id]) this.pushDates.update((m) => ({ ...m, [c.id]: { from: this.isoAdd(1), to: this.isoAdd(8) } }));
        }
      },
      error: () => this.fail('No se pudieron cargar los canales.')
    });

    this.hotelsApi.getHotelRoomTypes(id).subscribe({
      next: (types) => this.roomTypes.set(types),
      error: () => this.roomTypes.set([])
    });
  }

  retry(): void {
    this.error.set(null);
    this.load();
  }

  tab(channelId: string): string {
    return this.activeTab()[channelId] ?? 'credenciales';
  }

  setTab(channelId: string, tab: string): void {
    this.activeTab.update((m) => ({ ...m, [channelId]: tab }));
    if (tab === 'widget') {
      setTimeout(() => this.embedWidget(), 0);
    }
  }

  embedWidget(): void {
    const mount = document.getElementById('auron-widget-mount');
    if (!mount) return;
    const scriptUrl = this.widgetScriptUrl();
    mount.setAttribute('data-auron-widget', '');
    mount.innerHTML = '';
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    mount.appendChild(script);
  }

  toggle(channel: Channel): void {
    const cur = this.expanded();
    this.expanded.set(cur === channel.id ? null : channel.id);
    if (cur !== channel.id) {
      this.loadCredentials(channel);
      this.loadMappings(channel);
      this.reloadWidget();
      const pushDates = this.pushDates()[channel.id] ?? { from: this.isoAdd(1), to: this.isoAdd(8) };
      this.pushDates.update((m) => ({ ...m, [channel.id]: pushDates }));
      this.newMapping.update((m) => ({ ...m, [channel.id]: { roomTypeId: '', channelRoomCode: '', channelRatePlanCode: '' } }));
    }
  }

  loadCredentials(channel: Channel): void {
    this.channelApi.getCredentials(channel.id).subscribe({
      next: (c) => this.credentials.update((m) => ({ ...m, [channel.id]: c.credentialsJson ?? '' })),
      error: () => this.credentials.update((m) => ({ ...m, [channel.id]: '' }))
    });
  }

  setCredentials(channelId: string, value: string): void {
    this.credentials.update((m) => ({ ...m, [channelId]: value }));
  }

  setPushDate(channelId: string, field: 'from' | 'to', value: string): void {
    this.pushDates.update((m) => ({ ...m, [channelId]: { ...(m[channelId] ?? { from: '', to: '' }), [field]: value } }));
  }

  setNewMapping(channelId: string, field: 'roomTypeId' | 'channelRoomCode' | 'channelRatePlanCode', value: string): void {
    this.newMapping.update((m) => ({ ...m, [channelId]: { ...(m[channelId] ?? { roomTypeId: '', channelRoomCode: '', channelRatePlanCode: '' }), [field]: value } }));
  }

  saveCredentials(channel: Channel): void {
    const raw = this.credentials()[channel.id] ?? '';
    if (raw.trim()) {
      try {
        JSON.parse(raw);
      } catch {
        this.credMsg.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'El JSON de credenciales no es válido.' } }));
        return;
      }
    }
    this.channelApi.updateCredentials(channel.id, raw).subscribe({
      next: () => this.credMsg.update((m) => ({ ...m, [channel.id]: { ok: true, text: 'Credenciales guardadas.' } })),
      error: () => this.credMsg.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'No se pudieron guardar.' } }))
    });
  }

  test(channel: Channel): void {
    this.channelApi.testConnection(channel.id).subscribe({
      next: (r) => this.connection.update((m) => ({ ...m, [channel.id]: { ok: r.success, text: r.success ? 'Conexión exitosa' : 'Sin conexión' } })),
      error: () => this.connection.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'Error al probar' } }))
    });
  }

  loadMappings(channel: Channel): void {
    this.channelApi.getMappings(channel.id).subscribe({
      next: (list) => this.mappings.update((m) => ({ ...m, [channel.id]: list })),
      error: () => this.mappings.update((m) => ({ ...m, [channel.id]: [] }))
    });
  }

  autoMappings(channel: Channel): void {
    this.channelApi.createMappings(channel.id).subscribe({
      next: (r) => {
        this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: r.success, text: r.message } }));
        this.loadMappings(channel);
      },
      error: () => {
        this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'No se pudieron crear mapeos.' } }));
      }
    });
  }

  upsertMapping(channel: Channel): void {
    const f = this.newMapping()[channel.id] ?? { roomTypeId: '', channelRoomCode: '', channelRatePlanCode: '' };
    if (!f.roomTypeId || !f.channelRoomCode) {
      this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'Selecciona categoría y código del canal.' } }));
      return;
    }
    this.channelApi.upsertMapping({
      channelId: channel.id,
      roomTypeId: f.roomTypeId,
      channelRoomCode: f.channelRoomCode,
      channelRatePlanCode: f.channelRatePlanCode || undefined,
      isActive: true
    }).subscribe({
      next: () => {
        this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: true, text: 'Mapeo guardado.' } }));
        this.newMapping.update((m) => ({ ...m, [channel.id]: { roomTypeId: '', channelRoomCode: '', channelRatePlanCode: '' } }));
        this.loadMappings(channel);
      },
      error: () => this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'No se pudo guardar el mapeo.' } }))
    });
  }

  deleteMapping(channel: Channel, mapping: ChannelMapping): void {
    this.channelApi.deleteMapping(mapping.id).subscribe({
      next: () => this.loadMappings(channel),
      error: () => this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'No se pudo eliminar el mapeo.' } }))
    });
  }

  pushAvailability(channel: Channel): void {
    const d = this.pushDates()[channel.id] ?? { from: '', to: '' };
    this.channelApi.pushAvailability(channel.id, d.from, d.to).subscribe({
      next: (r: PushResult) => this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: r.success, text: `${r.message} (${r.itemsPushed} envíos)` } })),
      error: () => this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'Error al enviar disponibilidad.' } }))
    });
  }

  pushRates(channel: Channel): void {
    const d = this.pushDates()[channel.id] ?? { from: '', to: '' };
    this.channelApi.pushRates(channel.id, d.from, d.to).subscribe({
      next: (r: PushResult) => this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: r.success, text: `${r.message} (${r.itemsPushed} envíos)` } })),
      error: () => this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'Error al enviar tarifas.' } }))
    });
  }

  pullBookings(channel: Channel): void {
    const d = this.pushDates()[channel.id] ?? { from: '', to: '' };
    this.channelApi.pullBookings(channel.id, d.from, d.to).subscribe({
      next: (list) => this.pull.update((m) => ({ ...m, [channel.id]: list })),
      error: () => this.pull.update((m) => ({ ...m, [channel.id]: [] }))
    });
  }

  importBookings(channel: Channel): void {
    const d = this.pushDates()[channel.id] ?? { from: '', to: '' };
    this.channelApi.importBookings(channel.id, d.from, d.to).subscribe({
      next: (list) => {
        this.importResult.update((m) => ({ ...m, [channel.id]: list }));
        const total = list.length;
        const ok = list.filter((r) => r.status === 'Imported').length;
        const skipped = list.filter((r) => r.status === 'Skipped').length;
        this.pushMsg.update((m) => ({
          ...m,
          [channel.id]: { ok: true, text: `Importación completada: ${ok} creadas, ${skipped} ya existentes.` }
        }));
      },
      error: () => this.pushMsg.update((m) => ({ ...m, [channel.id]: { ok: false, text: 'Error al importar reservas del canal.' } }))
    });
  }

  reloadWidget(): void {
    const id = this.hotelId();
    if (!id) return;
    this.widgetScriptUrl.set(`${environment.widgetApiUrl}/script?hotelId=${id}`);
    this.snippet.set(`<div data-auron-widget></div>\n<script src="${this.widgetScriptUrl()}" async></script>`);
    this.widgetApi.getConfig(id).subscribe({
      next: (c) => this.widgetConfig.set(c),
      error: () => this.widgetConfig.set(null)
    });
  }

  chargeSim(gatewayName: string): void {
    const total = 100;
    this.paymentsApi.charge(gatewayName, total).subscribe({
      next: (r) => this.payGateways.update((m) => ({ ...m, [gatewayName]: { ok: r.success, text: `${r.message}${r.success ? ` · Auth ${r.authorizationCode}` : ''}` } })),
      error: () => this.payGateways.update((m) => ({ ...m, [gatewayName]: { ok: false, text: 'Error de pasarela' } }))
    });
  }
}