import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RecoveryActionService } from '../../services/recovery-action.service';
import { InvoiceService } from '../../services/invoice.service';
import { RecoveryAction, RecoveryActionCreate } from '../../interfaces/recovery-action.interface';
import { Invoice } from '../../interfaces/invoice.interface';

@Component({
  selector: 'app-recovery-actions',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './recovery-actions.component.html',
  styleUrl: './recovery-actions.component.css'
})
export class RecoveryActionsComponent implements OnInit {
  private recoveryService = inject(RecoveryActionService);
  private invoiceService = inject(InvoiceService);
  private cdr = inject(ChangeDetectorRef);

  actions: RecoveryAction[] = [];
  invoices: Invoice[] = [];
  showForm = false;
  form: RecoveryActionCreate = { invoice: '', actionType: 'email', description: '' };
  error = '';
  success = '';
  previewUrl = '';

  constructor() {}

  ngOnInit(): void {
    this.loadActions();
    this.invoiceService.getAll().subscribe({
      next: (data) => {
        this.invoices = data.filter(i => i.status === 'unpaid' || i.status === 'overdue');
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  loadActions(): void {
    this.recoveryService.getAll().subscribe({
      next: (data) => { this.actions = data; this.cdr.markForCheck(); },
      error: (err) => { this.error = err.error?.message || 'Erreur chargement'; this.cdr.markForCheck(); }
    });
  }

  openCreate(): void {
    this.form = { invoice: '', actionType: 'email', description: '' };
    this.showForm = true;
    this.error = '';
    this.success = '';
    this.previewUrl = '';
  }

  onSubmit(): void {
    this.error = '';
    this.recoveryService.create(this.form).subscribe({
      next: (res) => {
        let msg = 'Action de recouvrement créée avec succès.';
        const n = res.notification;
        if (n) {
          if (n.success) {
            if (n.simulated) {
              msg += ` SMS simulé (Twilio non configuré) — destinataire : ${n.to}`;
            } else if (n.previewUrl) {
              msg += ` Email envoyé (Ethereal test). Prévisualisation : ${n.previewUrl}`;
              this.previewUrl = n.previewUrl;
            } else {
              msg += ' Notification envoyée avec succès.';
            }
          } else {
            msg += ` Notification non envoyée : ${n.error || 'erreur inconnue'}`;
          }
        }
        this.success = msg;
        this.showForm = false;
        this.loadActions();
      },
      error: (err) => this.error = err.error?.message || 'Erreur création'
    });
  }

  cancel(): void { this.showForm = false; }

  getInvoiceLabel(inv: Invoice): string {
    const clientName = typeof inv.client === 'object' ? inv.client.name : 'Client';
    return `${clientName} - ${inv.amount} € (${inv.status})`;
  }

  getActionInvoiceInfo(action: RecoveryAction): string {
    if (!action.invoice) return '-';
    if (typeof action.invoice === 'object') {
      const inv = action.invoice;
      const clientName = inv.client && typeof inv.client === 'object' ? inv.client.name : '';
      return `${clientName} - ${inv.amount ?? ''} €`;
    }
    return String(action.invoice);
  }

  getActionByName(action: RecoveryAction): string {
    if (!action.actionBy) return '-';
    if (typeof action.actionBy === 'object') return action.actionBy.name;
    return String(action.actionBy);
  }
}

