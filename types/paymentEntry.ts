export type PaymentEntryRef = {
  name: string;
  voucher_type: string;
  posting_date: string | null;
  mode_of_payment: string | null;
};

export type InvoicePayment = {
  invoice_name: string;
  amount: number;
  entry: PaymentEntryRef;
};

export type GetPaymentsResult =
  | { success: true; payments: InvoicePayment[] }
  | { success: false; message: string };
