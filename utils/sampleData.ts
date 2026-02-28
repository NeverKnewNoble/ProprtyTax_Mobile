import { Property, PropertyType, FoundProperty } from "../types/property";
import { QuickAction } from "../types/quickAction";
import { Transaction } from "../types/transaction";
import { SettingsGroup, ProfileRow } from "../types/settings";
import { ChatMessage } from "../types/chat";
import { Notification, NotifType } from "../types/notification";
import { ContactInfo } from "../types/support";
import { MobileNetwork } from "../types/payment";

// ── Properties ─────────────────────────────────────────────────────
export const properties: Property[] = [
  {
    id: 1,
    name: "Sunset Villa",
    address: "123 Beach Road, Miami, FL 33101",
    type: "Residential",
    balance: "₵2,450",
    due: "Due in 5 days",
    dueDate: "Mar 1, 2026",
    progress: 75,
    taxYear: "2026",
    parcelId: "04-3219-011-0010",
    history: [
      { period: "Q4 2025", amount: "₵2,450", date: "Dec 28, 2025" },
      { period: "Q3 2025", amount: "₵2,450", date: "Sep 30, 2025" },
      { period: "Q2 2025", amount: "₵2,450", date: "Jun 28, 2025" },
    ],
  },
  {
    id: 2,
    name: "Downtown Apt",
    address: "456 City Center Ave, New York, NY 10001",
    type: "Commercial",
    balance: "₵1,850",
    due: "Due in 12 days",
    dueDate: "Mar 8, 2026",
    progress: 45,
    taxYear: "2026",
    parcelId: "1-02345-0067-0001",
    history: [
      { period: "Q4 2025", amount: "₵1,850", date: "Dec 15, 2025" },
      { period: "Q3 2025", amount: "₵1,850", date: "Sep 20, 2025" },
    ],
  },
  {
    id: 3,
    name: "Mountain Cabin",
    address: "789 Hillside Drive, Aspen, CO 81611",
    type: "Vacation",
    balance: "₵3,200",
    due: "Paid",
    dueDate: "Feb 22, 2026",
    progress: 100,
    taxYear: "2026",
    parcelId: "239312210023",
    history: [
      { period: "Q1 2026", amount: "₵3,200", date: "Feb 22, 2026" },
      { period: "Q4 2025", amount: "₵3,200", date: "Nov 30, 2025" },
      { period: "Q3 2025", amount: "₵3,200", date: "Aug 25, 2025" },
    ],
  },
];

export const TYPE_STYLE: Record<PropertyType, { bg: string; text: string }> = {
  Residential: { bg: "#E6FAFA", text: "#00CEC8" },
  Commercial:  { bg: "#EEECFF", text: "#6C63FF" },
  Vacation:    { bg: "#FEF3C7", text: "#D97706" },
};

// ── Mock property for Add Property lookup ───────────────────────────
export const mockFoundProperty: FoundProperty = {
  name: "Oak Street House",
  address: "247 Oak Street, Austin, TX 78701",
  type: "Residential",
  parcelId: "TX-247-0081-001",
  taxYear: "2026",
  estimatedTax: "₵3,100",
  owner: "John Doe",
  assessedValue: "₵385,000",
};

// ── Quick Actions ───────────────────────────────────────────────────
export const quickActions: QuickAction[] = [
  { id: 1, name: "Pay Now",   icon: "card",                color: "#00CEC8", bg: "#E6FAFA" },
  { id: 2, name: "Statement", icon: "document-text",       color: "#6C63FF", bg: "#EEECFF" },
  { id: 3, name: "Support",   icon: "chatbubble-ellipses", color: "#F59E0B", bg: "#FEF3C7" },
  { id: 4, name: "Settings",  icon: "settings",            color: "#64748B", bg: "#F1F5F9" },
];

// ── Transactions (list view) ────────────────────────────────────────
export const transactions: Transaction[] = [
  { id: 1, property: "Mountain Cabin", amount: "-₵3,200", date: "Feb 22, 2026", type: "Payment",   icon: "card",          color: "#22C55E", bg: "#DCFCE7" },
  { id: 2, property: "Downtown Apt",   amount: "-₵1,850", date: "Feb 10, 2026", type: "Payment",   icon: "card",          color: "#22C55E", bg: "#DCFCE7" },
  { id: 3, property: "Downtown Apt",   amount: "—",       date: "Feb 8, 2026",  type: "Statement", icon: "document-text", color: "#6C63FF", bg: "#EEECFF" },
  { id: 4, property: "Sunset Villa",   amount: "-₵2,450", date: "Jan 30, 2026", type: "Payment",   icon: "card",          color: "#22C55E", bg: "#DCFCE7" },
  { id: 5, property: "Sunset Villa",   amount: "—",       date: "Jan 15, 2026", type: "Statement", icon: "document-text", color: "#6C63FF", bg: "#EEECFF" },
];

// ── Chat messages (transactions chat view) ──────────────────────────
export const baseMessages: ChatMessage[] = [
  {
    id: 1,
    sender: "system",
    type: "invoice",
    property: "Sunset Villa",
    amount: "₵2,450",
    dueDate: "Jan 30, 2026",
    date: "Jan 10, 2026",
    time: "9:00 AM",
  },
  {
    id: 2,
    sender: "user",
    type: "payment",
    property: "Sunset Villa",
    amount: "₵2,450",
    date: "Jan 30, 2026",
    time: "2:15 PM",
  },
  {
    id: 3,
    sender: "system",
    type: "statement",
    property: "Sunset Villa",
    date: "Feb 1, 2026",
    time: "10:00 AM",
  },
  {
    id: 4,
    sender: "system",
    type: "invoice",
    property: "Downtown Apt",
    amount: "₵1,850",
    dueDate: "Feb 10, 2026",
    date: "Feb 5, 2026",
    time: "9:00 AM",
  },
  {
    id: 5,
    sender: "system",
    type: "statement",
    property: "Downtown Apt",
    date: "Feb 8, 2026",
    time: "11:30 AM",
  },
  {
    id: 6,
    sender: "user",
    type: "payment",
    property: "Downtown Apt",
    amount: "₵1,850",
    date: "Feb 10, 2026",
    time: "3:45 PM",
  },
  {
    id: 7,
    sender: "system",
    type: "invoice",
    property: "Mountain Cabin",
    amount: "₵3,200",
    dueDate: "Feb 22, 2026",
    date: "Feb 15, 2026",
    time: "9:00 AM",
  },
  {
    id: 8,
    sender: "user",
    type: "payment",
    property: "Mountain Cabin",
    amount: "₵3,200",
    date: "Feb 22, 2026",
    time: "11:20 AM",
  },
];

// ── Months (used by StatementRequestModal) ──────────────────────────
export const MONTHS = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December",
];

// ── Notifications ───────────────────────────────────────────────────
export const notificationTypeMeta: Record<
  NotifType,
  { icon: string; color: string; bg: string }
> = {
  invoice:   { icon: "document-text",    color: "#D97706", bg: "#FEF3C7" },
  payment:   { icon: "checkmark-circle", color: "#22C55E", bg: "#DCFCE7" },
  statement: { icon: "document",         color: "#6C63FF", bg: "#EEECFF" },
  reminder:  { icon: "alarm-outline",    color: "#00CEC8", bg: "#E6FAFA" },
};

export const sampleNotifications: Notification[] = [
  {
    id: 1,
    type: "invoice",
    title: "New Invoice — Sunset Villa",
    body: "Your Q1 2026 tax invoice of ₵2,450 is ready.",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    type: "reminder",
    title: "Payment Due Soon",
    body: "Downtown Apt invoice is due in 3 days.",
    time: "2h ago",
    read: false,
  },
  {
    id: 3,
    type: "payment",
    title: "Payment Confirmed",
    body: "Your ₵3,200 payment for Mountain Cabin was received.",
    time: "Feb 22",
    read: true,
  },
  {
    id: 4,
    type: "statement",
    title: "Statement Ready",
    body: "Your Downtown Apt statement for Feb 2026 is ready to download.",
    time: "Feb 8",
    read: true,
  },
  {
    id: 5,
    type: "payment",
    title: "Payment Confirmed",
    body: "Your ₵1,850 payment for Downtown Apt was received.",
    time: "Feb 10",
    read: true,
  },
];

// ── Support contact info ────────────────────────────────────────────
export const contactInfo: ContactInfo[] = [
  { id: 1, label: "Phone",       value: "+1 (305) 555-0199",                    icon: "call",                color: "#22C55E", bg: "#DCFCE7" },
  { id: 2, label: "Email",       value: "support@propertytax.com",              icon: "mail",                color: "#6C63FF", bg: "#EEECFF" },
  { id: 3, label: "WhatsApp",    value: "+1 (305) 555-0199",                    icon: "logo-whatsapp",       color: "#25D366", bg: "#DCFCE7" },
  { id: 4, label: "Live Chat",   value: "Available in the app — Mon–Fri 8am–6pm", icon: "chatbubble-ellipses", color: "#00CEC8", bg: "#E6FAFA" },
  { id: 5, label: "Help Center", value: "help.propertytax.com",                 icon: "help-circle",         color: "#F59E0B", bg: "#FEF3C7" },
];

// ── Settings groups (legacy — kept for reference) ───────────────────
export const settingsGroups: SettingsGroup[] = [
  {
    section: "Account",
    items: [
      { label: "Profile",       icon: "person-outline",           color: "#6C63FF" },
      { label: "Notifications", icon: "notifications-outline",    color: "#F59E0B" },
      { label: "Security",      icon: "shield-checkmark-outline", color: "#22C55E" },
    ],
  },
  {
    section: "Preferences",
    items: [
      { label: "Payment Methods", icon: "card-outline",   color: "#00CEC8" },
      { label: "Documents",       icon: "folder-outline", color: "#6C63FF" },
      { label: "Language",        icon: "globe-outline",  color: "#64748B" },
    ],
  },
  {
    section: "Support",
    items: [
      { label: "Help Center", icon: "help-circle-outline", color: "#F59E0B" },
      { label: "Contact Us",  icon: "mail-outline",        color: "#00CEC8" },
      { label: "Sign Out",    icon: "log-out-outline",     color: "#EF4444" },
    ],
  },
];

// ── Mobile Money networks ───────────────────────────────────────────
export const mobileNetworks: {
  id: MobileNetwork;
  label: string;
  color: string;
  bg: string;
}[] = [
  { id: "mtn",     label: "MTN",         color: "#F59E0B", bg: "#FEF3C7" },
  { id: "telecel", label: "TelecelCash", color: "#EF4444", bg: "#FEE2E2" },
  { id: "aitel",   label: "AitelTigo",   color: "#3B82F6", bg: "#DBEAFE" },
];

// ── Profile info rows (settings page) ──────────────────────────────
export const profileRows: ProfileRow[] = [
  { icon: "person-outline",   label: "Full Name",  value: "John Doe" },
  { icon: "location-outline", label: "Location",   value: "Miami, FL 33101" },
  { icon: "mail-outline",     label: "Email",      value: "john.doe@example.com" },
  { icon: "call-outline",     label: "Phone",      value: "+1 (305) 555-0100" },
  { icon: "card-outline",     label: "Account ID", value: "PRO-2026-00147" },
];
