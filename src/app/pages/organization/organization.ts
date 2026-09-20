import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import {
  OrganizationService,
  OrganizationSummary,
  OrganizationMemberDto,
  UserProperty,
  InviteMemberCommand,
  UpdateMemberCommand
} from '@/app/core/services/organization.service';

const ORG_ROLES = ['Owner', 'Admin', 'Member'];
const PROPERTY_ROLES = ['Owner', 'Admin', 'Manager', 'Receptionist', 'Housekeeping', 'Maintenance', 'User'];

interface InviteForm {
  email: string;
  firstName: string;
  lastName: string;
  organizationRole: string;
  assignments: { propertyId: string; propertyRole: string }[];
}

interface EditForm {
  id: string;
  email: string;
  organizationRole: string;
  isActive: boolean;
  assignments: { propertyId: string; propertyRole: string }[];
}

@Component({
  selector: 'app-organization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organization.html',
  styleUrl: './organization.scss'
})
export class OrganizationPage implements OnInit {
  private organizationApi = inject(OrganizationService);
  private confirmation = inject(ConfirmationService);

  readonly orgRoles = ORG_ROLES;
  readonly propertyRoles = PROPERTY_ROLES;

  loading = signal(true);
  error = signal<string | null>(null);

  summary = signal<OrganizationSummary | null>(null);
  properties = signal<UserProperty[]>([]);
  members = signal<OrganizationMemberDto[]>([]);
  isAdmin = signal(false);

  showInvite = signal(false);
  inviteForm = signal<InviteForm>({ email: '', firstName: '', lastName: '', organizationRole: 'Member', assignments: [] });
  inviteResult = signal<{ email: string; temporaryPassword: string } | null>(null);
  inviteMsg = signal<{ ok: boolean; text: string } | null>(null);

  editing = signal<EditForm | null>(null);
  editMsg = signal<{ ok: boolean; text: string } | null>(null);

  private cachedMe: OrganizationSummary | null = null;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.organizationApi.getMyOrganization().subscribe({
      next: (org) => {
        this.summary.set(org);
        this.properties.set(org.properties);
        this.cachedMe = org;
        this.isAdmin.set(org.myOrganizationRole === 'Owner' || org.myOrganizationRole === 'Admin');
        if (this.isAdmin()) this.loadMembers();
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la información de la organización.');
        this.loading.set(false);
      }
    });
  }

  loadMembers(): void {
    this.organizationApi.getMembers().subscribe({
      next: (members) => this.members.set(members),
      error: () => this.error.set('No se pudieron cargar los miembros.')
    });
  }

  openInvite(): void {
    const props = this.properties()
      .filter((p) => p.propertyId !== this.cachedMe?.organizationId)
      .map((p) => ({ propertyId: p.propertyId, propertyRole: 'User' as string }));
    this.inviteForm.set({ email: '', firstName: '', lastName: '', organizationRole: 'Member', assignments: props });
    this.inviteResult.set(null);
    this.inviteMsg.set(null);
    this.showInvite.set(true);
  }

  submitInvite(): void {
    const f = this.inviteForm();
    const command: InviteMemberCommand = {
      email: f.email.trim(),
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      organizationRole: f.organizationRole,
      properties: f.assignments
    };
    this.organizationApi.inviteMember(command).subscribe({
      next: (res) => {
        this.inviteResult.set({ email: res.member.email, temporaryPassword: res.temporaryPassword });
        this.inviteMsg.set({ ok: true, text: 'Miembro invitado correctamente.' });
        this.showInvite.set(false);
        this.loadMembers();
      },
      error: (err) => {
        const text = err?.error ?? 'No se pudo invitar al miembro.';
        this.inviteMsg.set({ ok: false, text });
      }
    });
  }

  startEdit(m: OrganizationMemberDto): void {
    this.editMsg.set(null);
    this.editing.set({
      id: m.userId,
      email: m.email,
      organizationRole: m.organizationRole,
      isActive: m.isActive,
      assignments: m.properties.map((p) => ({ propertyId: p.propertyId, propertyRole: p.propertyRole }))
    });
  }

  submitEdit(): void {
    const e = this.editing();
    if (!e) return;
    const command: UpdateMemberCommand = {
      organizationRole: e.organizationRole,
      isActive: e.isActive,
      properties: e.assignments
    };
    this.organizationApi.updateMember(e.id, command).subscribe({
      next: () => {
        this.editing.set(null);
        this.editMsg.set({ ok: true, text: 'Miembro actualizado.' });
        this.loadMembers();
      },
      error: (err) => {
        this.editMsg.set({ ok: false, text: err?.error ?? 'No se pudo actualizar el miembro.' });
      }
    });
  }

  removeMember(m: OrganizationMemberDto): void {
    this.confirmation.confirm({
      message: `¿Eliminar a ${m.fullName} de la organización?`,
      header: 'Eliminar miembro',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.organizationApi.removeMember(m.userId).subscribe({
          next: () => this.loadMembers(),
          error: (err) => this.editMsg.set({ ok: false, text: err?.error ?? 'No se pudo eliminar el miembro.' })
        });
      }
    });
  }

  cleanEdits(): void {
    this.editing.set(null);
    this.inviteMsg.set(null);
    this.editMsg.set(null);
  }

  propName(propertyId: string): string {
    return this.properties().find((p) => p.propertyId === propertyId)?.name ?? propertyId;
  }

  assignmentFor(propertyId: string): { propertyId: string; propertyRole: string } | null {
    return this.editing()?.assignments.find((a) => a.propertyId === propertyId) ?? null;
  }

  toggleAssignment(propertyId: string, event: Event): void {
    const e = this.editing();
    if (!e) return;
    const checked = (event.target as HTMLInputElement).checked;
    const found = e.assignments.find((a) => a.propertyId === propertyId);
    if (checked && !found) {
      e.assignments.push({ propertyId, propertyRole: 'User' });
    } else if (!checked && found) {
      e.assignments = e.assignments.filter((a) => a.propertyId !== propertyId);
    }
    this.editing.set(e);
  }
}