import { Invoice } from "@/types/property";

export type GetInvoicesResult =
  | { success: true; invoices: Invoice[]; message: string }
  | { success: false; message: string };

export type InvoiceMessageDetails = {
  property_name: string;
  property_id: string;
  amount_due: number;
  due_date: string | null;
  invoice_number: string;
  customer_name: string;
  posting_date: string;
  outstanding_amount: number;
};

export type InvoiceMessageResult =
  | { success: true; invoice_details: InvoiceMessageDetails }
  | { success: false; message: string };
