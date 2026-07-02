export type StatementType = "Statement" | "Billing";

export type PeriodMode = "single" | "range";

export type MonthYear = { month: number; year: number };

export type SubmitPayload = {
  property: string;
  propertyParcelId: string;
  statementType: StatementType;
  period: string;
  from_date: string; // YYYY-MM-DD
  to_date: string;   // YYYY-MM-DD
};

export type StatementPaymentRow = {
  date: string;
  amount: number;
  method: string;
};

export type StatementInvoiceRow = {
  invoiceNumber: string;
  billingYear: string;
  grandTotal: number;
  outstanding: number;
  dueDate: string;
  payments: StatementPaymentRow[];
};

// Used by "Billing" type — one row per payment transaction
export type BillingRow = {
  paymentName: string;
  paymentDate: string;
  invoiceName: string;
  billingYear: string;
  amount: number;
  method: string;
};

export type StatementData = {
  property: string;
  period: string;
  statementType: string;
  // Statement type
  rows: StatementInvoiceRow[];
  totalBilled: number;
  totalPaid: number;
  totalOutstanding: number;
  // Billing type
  billingRows?: BillingRow[];
  totalPayments?: number;
};
