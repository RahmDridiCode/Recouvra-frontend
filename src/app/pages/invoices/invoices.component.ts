import { Component, OnInit, computed, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';
import { ClientService } from '../../services/client.service';
import { AuthService } from '../../services/auth.service';
import { Invoice, InvoiceCreate } from '../../interfaces/invoice.interface';
import { Client } from '../../interfaces/client.interface';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './invoices.component.html',
  styleUrl: './invoices.component.css'
})
export class InvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private clientService = inject(ClientService);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  invoices: Invoice[] = [];
  clients: Client[] = [];
  showForm = false;
  editingInvoice: Invoice | null = null;
  form: InvoiceCreate = { client: '', amount: 0, dueDate: '', status: 'unpaid' };
  error = '';
  success = '';

  role = this.auth.userRole;
  isAdmin = computed(() => this.role() === 'admin');
  isManager = computed(() => this.role() === 'manager');
  isAgent = computed(() => this.role() === 'agent');
  canCreate = computed(() => true);
  canEdit = computed(() => this.isAdmin() || this.isManager());
  canDelete = computed(() => this.isAdmin());

  constructor() {}

  ngOnInit(): void {
    this.loadInvoices();
    this.clientService.getAll().subscribe({
      next: (data) => { this.clients = data; this.cdr.markForCheck(); },
      error: () => {}
    });
  }

  loadInvoices(): void {
    this.invoiceService.getAll().subscribe({
      next: (data) => { this.invoices = data; this.cdr.markForCheck(); },
      error: (err) => { this.error = err.error?.message || 'Erreur chargement'; this.cdr.markForCheck(); }
    });
  }

  openCreate(): void {
    this.editingInvoice = null;
    this.form = { client: '', amount: 0, dueDate: '', status: 'unpaid' };
    this.showForm = true;
    this.error = '';
    this.success = '';
  }

  openEdit(inv: Invoice): void {
    this.editingInvoice = inv;
    const clientId = typeof inv.client === 'object' ? inv.client._id : inv.client;
    this.form = {
      client: clientId,
      amount: inv.amount,
      dueDate: inv.dueDate ? inv.dueDate.substring(0, 10) : '',
      status: inv.status
    };
    this.showForm = true;
    this.error = '';
    this.success = '';
  }

  onSubmit(): void {
    this.error = '';
    if (this.editingInvoice) {
      this.invoiceService.update(this.editingInvoice._id, this.form).subscribe({
        next: () => { this.success = 'Facture modifiée'; this.showForm = false; this.loadInvoices(); },
        error: (err) => this.error = err.error?.message || 'Erreur modification'
      });
    } else {
      this.invoiceService.create(this.form).subscribe({
        next: () => { this.success = 'Facture créée'; this.showForm = false; this.loadInvoices(); },
        error: (err) => this.error = err.error?.message || 'Erreur création'
      });
    }
  }

  deleteInvoice(inv: Invoice): void {
    if (confirm('Supprimer cette facture ?')) {
      this.invoiceService.delete(inv._id).subscribe({
        next: () => { this.success = 'Facture supprimée'; this.loadInvoices(); },
        error: (err) => this.error = err.error?.message || 'Erreur suppression'
      });
    }
  }

  cancel(): void { this.showForm = false; }

  getClientName(inv: Invoice): string {
    if (!inv.client) return '-';
    if (typeof inv.client === 'object') return inv.client.name;
    return inv.client;
  }
}

