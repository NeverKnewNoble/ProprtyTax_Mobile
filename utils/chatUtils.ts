import { ChatMessage } from "../types/chat";

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function todayDate(): string {
  const d = new Date();
  return `${MONTH_LABELS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function nowTime(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function groupByDate(msgs: ChatMessage[]): Map<string, ChatMessage[]> {
  const map = new Map<string, ChatMessage[]>();
  for (const msg of msgs) {
    if (!map.has(msg.date)) map.set(msg.date, []);
    map.get(msg.date)!.push(msg);
  }
  return map;
}
