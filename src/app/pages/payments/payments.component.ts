import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { InvoiceService } from '../../services/invoice.service';
import { Payment, PaymentCreate, PaymentUpdate } from '../../interfaces/payment.interface';
import { Invoice } from '../../interfaces/invoice.interface';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private invoiceService = inject(InvoiceService);
  private cdr = inject(ChangeDetectorRef);

  payments: Payment[] = [];
  invoices: Invoice[] = [];
  allInvoices: Invoice[] = [];

  // Create form
  showCreateForm = false;
  createForm: PaymentCreate = { invoice: '', amount: 0, method: 'cash' };

  // Edit form
  showEditForm = false;
  editingPayment: Payment | null = null;
  editForm: PaymentUpdate = { amount: 0, method: 'cash' };

  error = '';
  success = '';

  constructor() {}

  ngOnInit(): void {
    this.loadPayments();
    this.loadInvoices();
  }

  loadPayments(): void {
    this.paymentService.getAll().subscribe({
      next: (data) => { this.payments = data; this.cdr.markForCheck(); },
      error: (err) => { this.error = err.error?.message || 'Erreur chargement'; this.cdr.markForCheck(); }
    });
  }

  loadInvoices(): void {
    this.invoiceService.getAll().subscribe({
      next: (data) => {
        this.allInvoices = data;
        this.invoices = data.filter(i => i.status !== 'paid');
        this.cdr.markForCheck();
      },
      error: () => {}
    });
  }

  // ── CREATE ──────────────────────────────────────────────
  openCreate(): void {
    this.createForm = { invoice: '', amount: 0, method: 'cash' };
    this.showCreateForm = true;
    this.showEditForm = false;
    this.error = '';
    this.success = '';
  }

  onInvoiceSelect(): void {
    const selected = this.invoices.find(i => i._id === this.createForm.invoice);
    if (selected) this.createForm.amount = selected.amount;
  }

  onCreate(): void {
    this.error = '';
    this.paymentService.create(this.createForm).subscribe({
      next: () => {
        this.success = 'Paiement créé avec succès';
        this.showCreateForm = false;
        this.loadPayments();
        this.loadInvoices();
      },
      error: (err) => { this.error = err.error?.message || 'Erreur création'; this.cdr.markForCheck(); }
    });
  }

  // ── EDIT ────────────────────────────────────────────────
  openEdit(payment: Payment): void {
    this.editingPayment = payment;
    this.editForm = {
      amount: payment.amount,
      method: payment.method
    };
    this.showEditForm = true;
    this.showCreateForm = false;
    this.error = '';
    this.success = '';
  }

  onUpdate(): void {
    if (!this.editingPayment) return;
    this.error = '';
    this.paymentService.update(this.editingPayment._id, this.editForm).subscribe({
      next: () => {
        this.success = 'Paiement modifié avec succès';
        this.showEditForm = false;
        this.editingPayment = null;
        this.loadPayments();
        this.loadInvoices();
      },
      error: (err) => { this.error = err.error?.message || 'Erreur modification'; this.cdr.markForCheck(); }
    });
  }

  // ── SHARED ──────────────────────────────────────────────
  cancel(): void {
    this.showCreateForm = false;
    this.showEditForm = false;
    this.editingPayment = null;
  }

  getClientName(payment: Payment): string {
    if (!payment.invoice || typeof payment.invoice !== 'object') return '-';
    const inv = payment.invoice;
    if (inv.client && typeof inv.client === 'object') return inv.client.name || '-';
    return '-';
  }

  getInvoiceInfo(payment: Payment): string {
    if (!payment.invoice) return '-';
    if (typeof payment.invoice === 'object') {
      const inv = payment.invoice;
      return `${inv.amount ?? ''} € (${inv.status ?? ''})`;
    }
    return String(payment.invoice);
  }

  getInvoiceLabel(inv: Invoice): string {
    const clientName = typeof inv.client === 'object' ? inv.client.name : 'Client';
    return `${clientName} — ${inv.amount} € (${inv.status})`;
  }
}
