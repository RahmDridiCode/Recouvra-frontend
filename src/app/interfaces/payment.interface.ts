export interface Payment {
  _id: string;
  invoice: { _id: string; client?: any; amount?: number; status?: string } | string;
  amount: number;
  date: string;
  method: 'cash' | 'bank transfer' | 'cheque';
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentCreate {
  invoice: string;
  amount: number;
  method: 'cash' | 'bank transfer' | 'cheque';
}

export interface PaymentUpdate {
  invoice?: string;
  amount?: number;
  method?: 'cash' | 'bank transfer' | 'cheque';
}

