export interface RecoveryAction {
  _id: string;
  invoice: { _id: string; client?: any; amount?: number; dueDate?: string; status?: string } | string;
  actionType: 'email' | 'sms';
  actionBy?: { _id: string; name: string } | string;
  description?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecoveryActionCreate {
  invoice: string;
  actionType: 'email' | 'sms';
  description?: string;
}

