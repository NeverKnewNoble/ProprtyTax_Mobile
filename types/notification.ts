export type NotifType = "invoice" | "payment" | "statement" | "reminder";

export type Notification = {
  id: number;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
};
