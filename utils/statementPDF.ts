import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { StatementData } from "@/types/statement";

function fmtAmount(n: number): string {
  return `GHS ${n.toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function generateStatementHTML(data: StatementData): string {
  const invoiceRows = data.rows
    .map((row) => {
      const paymentsHTML =
        row.payments.length > 0
          ? row.payments
              .map(
                (p) => `
              <tr class="payment-row">
                <td colspan="3" class="payment-cell">
                  <span class="check">✓</span>
                  ${p.date}${p.method ? ` &middot; ${p.method}` : ""}
                </td>
                <td class="payment-amount">${fmtAmount(p.amount)}</td>
                <td colspan="2"></td>
              </tr>`
              )
              .join("")
          : `<tr class="payment-row">
               <td colspan="6" class="no-payment">No payments recorded</td>
             </tr>`;

      return `
        <tr class="invoice-row">
          <td>${row.invoiceNumber}</td>
          <td>${row.billingYear || "—"}</td>
          <td class="amount">${fmtAmount(row.grandTotal)}</td>
          <td class="amount ${row.outstanding > 0 ? "unpaid-amount" : "paid-amount"}">
            ${fmtAmount(row.outstanding)}
          </td>
          <td>${row.dueDate}</td>
          <td class="center">
            <span class="badge ${row.outstanding === 0 ? "badge-paid" : "badge-unpaid"}">
              ${row.outstanding === 0 ? "Paid" : "Unpaid"}
            </span>
          </td>
        </tr>
        ${paymentsHTML}`;
    })
    .join("");

  return `
  <div class="summary">
    <div class="summary-card">
      <div class="s-label">TOTAL BILLED</div>
      <div class="s-value" style="color:#0F172A">${fmtAmount(data.totalBilled)}</div>
    </div>
    <div class="summary-card">
      <div class="s-label">TOTAL PAID</div>
      <div class="s-value" style="color:#15803D">${fmtAmount(data.totalPaid)}</div>
    </div>
    <div class="summary-card">
      <div class="s-label">OUTSTANDING</div>
      <div class="s-value" style="color:${data.totalOutstanding > 0 ? "#B45309" : "#15803D"}">${fmtAmount(data.totalOutstanding)}</div>
    </div>
  </div>

  <p class="section-title">Invoices</p>

  <table>
    <thead>
      <tr>
        <th>Invoice</th>
        <th>Tax Year</th>
        <th style="text-align:right">Billed</th>
        <th style="text-align:right">Outstanding</th>
        <th>Due Date</th>
        <th style="text-align:center">Status</th>
      </tr>
    </thead>
    <tbody>
      ${
        invoiceRows ||
        `<tr><td colspan="6" style="text-align:center;padding:28px;color:#CBD5E1;">No invoices found for this period</td></tr>`
      }
    </tbody>
  </table>`;
}

function generateBillingHTML(data: StatementData): string {
  const billingRows = (data.billingRows ?? [])
    .map(
      (row) => `
      <tr class="invoice-row">
        <td>
          <div style="font-weight:700;color:#0F172A">${fmtAmount(row.amount)}</div>
          <div style="font-size:11px;color:#0F172A;margin-top:2px">${row.paymentDate}${row.method ? ` · ${row.method}` : ""}</div>
        </td>
        <td style="color:#0F172A;font-size:12px">${row.invoiceName}</td>
        <td style="text-align:center;color:#0F172A;font-size:12px">${row.billingYear || "—"}</td>
        <td class="center">
          <span class="badge badge-paid">Paid</span>
        </td>
      </tr>`
    )
    .join("");

  return `
  <div class="summary">
    <div class="summary-card">
      <div class="s-label">PAYMENTS MADE</div>
      <div class="s-value" style="color:#0F172A">${data.totalPayments ?? 0}</div>
    </div>
    <div class="summary-card">
      <div class="s-label">TOTAL PAID</div>
      <div class="s-value" style="color:#15803D">${fmtAmount(data.totalPaid)}</div>
    </div>
  </div>

  <p class="section-title">Payment Transactions</p>

  <table>
    <thead>
      <tr>
        <th>Amount &amp; Date</th>
        <th>Invoice</th>
        <th style="text-align:center">Tax Year</th>
        <th style="text-align:center">Status</th>
      </tr>
    </thead>
    <tbody>
      ${
        billingRows ||
        `<tr><td colspan="4" style="text-align:center;padding:28px;color:#0F172A;">No payments found for this period</td></tr>`
      }
    </tbody>
  </table>`;
}

function generateHTML(data: StatementData): string {
  const generatedOn = new Date().toLocaleDateString("en-GH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const bodyContent =
    data.statementType === "Statement"
      ? generateStatementHTML(data)
      : generateBillingHTML(data);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${data.property} — ${data.statementType}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, Helvetica, Arial, sans-serif; color: #0F172A; padding: 40px; background: #fff; }

    /* ── Header ── */
    .header { background: #fff; color: #0F172A; padding: 32px 36px; border-radius: 16px; margin-bottom: 28px; border: 1.5px solid #CBD5E1; }
    .header .label { font-size: 10px; font-weight: 700; letter-spacing: 3px; color: #0F172A; margin-bottom: 10px; }
    .header h1 { font-size: 26px; font-weight: 800; margin-bottom: 4px; color: #0F172A; }
    .header .period { font-size: 14px; color: #0F172A; margin-bottom: 12px; }
    .type-badge { display: inline-block; background: #E2E8F0; color: #0F172A; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; }

    /* ── Summary ── */
    .summary { display: flex; gap: 14px; margin-bottom: 28px; }
    .summary-card { flex: 1; background: white; border-radius: 14px; padding: 18px 14px; text-align: center; border: 1.5px solid #CBD5E1; }
    .summary-card .s-label { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #0F172A; margin-bottom: 8px; }
    .summary-card .s-value { font-size: 15px; font-weight: 800; }

    /* ── Section title ── */
    .section-title { font-size: 10px; font-weight: 700; letter-spacing: 3px; color: #0F172A; text-transform: uppercase; margin-bottom: 12px; }

    /* ── Table ── */
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 14px; overflow: hidden; border: 1.5px solid #CBD5E1; margin-bottom: 28px; }
    thead tr { background: #E2E8F0; }
    th { font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #0F172A; text-transform: uppercase; padding: 13px 14px; text-align: left; border-bottom: 1.5px solid #CBD5E1; }
    .invoice-row td { padding: 14px; font-size: 13px; font-weight: 600; color: #0F172A; border-top: 1px solid #CBD5E1; }
    .payment-row td { background: #F8FAFC; border-top: 1px solid #E2E8F0; }
    .payment-cell { padding: 7px 14px 7px 28px; font-size: 11px; color: #0F172A; }
    .payment-amount { padding: 7px 14px; font-size: 11px; font-weight: 700; color: #15803D; text-align: right; }
    .no-payment { padding: 8px 14px 8px 28px; font-size: 11px; color: #64748B; }
    .check { color: #15803D; font-weight: 700; margin-right: 6px; }
    .amount { text-align: right; }
    .paid-amount { color: #15803D; text-align: right; }
    .unpaid-amount { color: #B45309; text-align: right; }
    .center { text-align: center; }

    /* ── Badges ── */
    .badge { padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; }
    .badge-paid { background: #BBF7D0; color: #14532D; }
    .badge-unpaid { background: #FDE68A; color: #78350F; }

    /* ── Footer ── */
    .footer { text-align: center; font-size: 11px; color: #0F172A; padding-top: 16px; border-top: 1.5px solid #CBD5E1; }
    .footer strong { color: #0F172A; }
  </style>
</head>
<body>

  <div class="header">
    <div class="label">PROPERTY TAX STATEMENT</div>
    <h1>${data.property}</h1>
    <div class="period">${data.period}</div>
    <span class="type-badge">${data.statementType.toUpperCase()}</span>
  </div>

  ${bodyContent}

  <div class="footer">
    Generated by <strong>Property Tax Collect</strong> &nbsp;·&nbsp; ${generatedOn}
  </div>

</body>
</html>`;
}

export async function downloadStatement(data: StatementData): Promise<void> {
  const html = generateHTML(data);
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    dialogTitle: `${data.property} — ${data.statementType}`,
    UTI: "com.adobe.pdf",
  });
}
