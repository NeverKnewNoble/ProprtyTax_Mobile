export type Sender = "system" | "user";

export type MsgType = "invoice" | "statement" | "payment" | "request";

export type ChatMessage = {
  id: number;
  sender: Sender;
  type: MsgType;
  property: string;
  amount?: string;
  dueDate?: string;
  statementType?: string;
  period?: string;
  date: string;
  time: string;
};
