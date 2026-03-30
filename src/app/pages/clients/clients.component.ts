import { Component, OnInit, computed, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Client, ClientCreate } from '../../interfaces/client.interface';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  private clientService = inject(ClientService);
  private userService = inject(UserService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  clients: Client[] = [];
  agents: User[] = [];
  showForm = false;
  editingClient: Client | null = null;
  form: ClientCreate = { name: '', email: '', phone: '', address: '', assignedTo: '' };
  error = '';
  success = '';

  role = this.auth.userRole;
  isAdmin = computed(() => this.role() === 'admin');
  isReadOnly = computed(() => this.role() === 'manager' || this.role() === 'agent');

  constructor() {}

  ngOnInit(): void {
    this.loadClients();
    if (this.isAdmin()) {
      this.userService.getAll().subscribe({
        next: (users) => this.agents = users.filter(u => u.role === 'agent'),
        error: () => {}
      });
    }
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (data) => { this.clients = data; this.cdr.markForCheck(); },
      error: (err) => { this.error = err.error?.message || 'Erreur chargement'; this.cdr.markForCheck(); }
    });
  }

  openCreate(): void {
    this.editingClient = null;
    this.form = { name: '', email: '', phone: '', address: '', assignedTo: '' };
    this.showForm = true;
    this.error = '';
    this.success = '';
  }

  openEdit(client: Client): void {
    this.editingClient = client;
    const assignedId = typeof client.assignedTo === 'object' && client.assignedTo ? client.assignedTo._id : (client.assignedTo || '');
    this.form = {
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || '',
      assignedTo: assignedId as string
    };
    this.showForm = true;
    this.error = '';
    this.success = '';
  }

  onSubmit(): void {
    this.error = '';
    const payload = { ...this.form };
    if (!payload.assignedTo) delete payload.assignedTo;

    if (this.editingClient) {
      this.clientService.update(this.editingClient._id, payload).subscribe({
        next: () => { this.success = 'Client modifié'; this.showForm = false; this.loadClients(); },
        error: (err) => this.error = err.error?.message || 'Erreur modification'
      });
    } else {
      this.clientService.create(payload).subscribe({
        next: () => { this.success = 'Client créé'; this.showForm = false; this.loadClients(); },
        error: (err) => this.error = err.error?.message || 'Erreur création'
      });
    }
  }

  deleteClient(client: Client): void {
    if (confirm(`Supprimer le client ${client.name} ?`)) {
      this.clientService.delete(client._id).subscribe({
        next: () => { this.success = 'Client supprimé'; this.loadClients(); },
        error: (err) => this.error = err.error?.message || 'Erreur suppression'
      });
    }
  }

  cancel(): void { this.showForm = false; }

  getAssignedName(client: Client): string {
    if (!client.assignedTo) return '-';
    if (typeof client.assignedTo === 'object') return client.assignedTo.name;
    return client.assignedTo;
  }
}

