import { api } from "@/utils/config/api_client";
import { GetPaymentsResult, InvoicePayment, PaymentEntryRef } from "@/types/paymentEntry";

export type { GetPaymentsResult, InvoicePayment, PaymentEntryRef };

export async function fetchPaymentsForInvoices(
  invoice_names: string[]
): Promise<GetPaymentsResult> {
  try {
    const response = await api.post(
      "/api/v2/method/property_collection.utils.get_payments_for_invoices",
      { invoice_names: JSON.stringify(invoice_names) }
    );

    const payload = response.data?.data ?? response.data;

    if (Array.isArray(payload)) {
      return { success: true, payments: payload };
    }

    return {
      success: false,
      message: "No payment data returned",
    };
  } catch (err: any) {
    console.log("fetchPaymentsForInvoices error:", err.message);
    return { success: false, message: err.message ?? "Network error" };
  }
}
