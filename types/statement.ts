export type StatementType = "Statement" | "Billing";

export type PeriodMode = "single" | "range";

export type MonthYear = { month: number; year: number };

export type SubmitPayload = {
  property: string;
  statementType: StatementType;
  period: string;
};
