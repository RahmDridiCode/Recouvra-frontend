export interface AgentStats {
  agent: { id: string; name: string; email: string };
  clients: number;
  totalInvoices: number;
  paid: number;
  unpaid: number;
  overdue: number;
  totalPayments: number;
  recoveredAmount: number;
  recoveryActions: number;
}

export interface MonthStats {
  year: number;
  month: number;
  invoices: number;
  invoiceAmount: number;
  paid: number;
  unpaid: number;
  overdue: number;
  payments: number;
  paymentAmount: number;
}

export interface Stats {
  totalInvoices: number;
  paid: number;
  unpaid: number;
  overdue: number;
  totalClients: number;
  totalPayments: number;
  totalRecoveredAmount: number;
  amountStillUnpaid: number;
  totalRecoveryActions: number;
  statsPerAgent: AgentStats[];
  statsPerMonth: MonthStats[];
}

