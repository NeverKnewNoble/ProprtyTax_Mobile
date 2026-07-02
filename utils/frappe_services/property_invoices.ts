import { api } from "@/utils/config/api_client";
import { GetInvoicesResult, InvoiceMessageDetails, InvoiceMessageResult } from "@/types/invoices";

export type { GetInvoicesResult, InvoiceMessageDetails, InvoiceMessageResult };

export async function fetchPropertyInvoices(
  property_id: string
): Promise<GetInvoicesResult> {
  try {
    const response = await api.post(
      "/api/v2/method/property_collection.api.property_invoices.get_sales_invoices_by_property",
      { property_id }
    );

    const payload = response.data?.data ?? response.data;

    if (payload?.success && Array.isArray(payload.invoices)) {
      return {
        success: true,
        invoices: payload.invoices,
        message: payload.message ?? "",
      };
    }

    return {
      success: false,
      message: payload?.message ?? "Failed to fetch invoices",
    };
  } catch (err: any) {
    console.log("fetchPropertyInvoices error:", err.message);
    return { success: false, message: err.message ?? "Network error" };
  }
}

export async function fetchInvoiceMessage(
  property_id: string
): Promise<InvoiceMessageResult> {
  try {
    const response = await api.get(
      "/api/v2/method/property_collection.api.property_invoices.render_invoice_message",
      { params: { property_id } }
    );

    const payload = response.data?.data ?? response.data;

    if (payload?.success && payload.invoice_details) {
      return { success: true, invoice_details: payload.invoice_details };
    }

    return {
      success: false,
      message: payload?.message ?? "Failed to fetch invoice message",
    };
  } catch (err: any) {
    console.log("fetchInvoiceMessage error:", err.message);
    return { success: false, message: err.message ?? "Network error" };
  }
}
