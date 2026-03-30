export interface Invoice {
  _id: string;
  client: { _id: string; name: string; email?: string; phone?: string } | string;
  amount: number;
  dueDate: string;
  status: 'unpaid' | 'paid' | 'overdue';
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceCreate {
  client: string;
  amount: number;
  dueDate: string;
  status?: 'unpaid' | 'paid' | 'overdue';
}

export interface InvoiceUpdate {
  client?: string;
  amount?: number;
  dueDate?: string;
  status?: 'unpaid' | 'paid' | 'overdue';
}

