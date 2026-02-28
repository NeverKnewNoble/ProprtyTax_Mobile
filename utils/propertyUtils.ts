import { Property, PropertyType, UserProperty } from "../types/property";
import { TYPE_STYLE } from "./sampleData";

export const isPaid = (due: string): boolean => due === "Paid";

export const getTypeStyle = (type: PropertyType) => TYPE_STYLE[type];

export function mapUserProperty(p: UserProperty, index: number): Property {
  const rawType = p.property_type?.property_type ?? "";
  const type: PropertyType = rawType.toLowerCase().includes("commercial")
    ? "Commercial"
    : rawType.toLowerCase().includes("vacation")
    ? "Vacation"
    : "Residential";

  return {
    id: index,
    name: p.full_name || p.name,
    address: p.property_address || "—",
    type,
    balance: "—",
    due: "Active",
    dueDate: "—",
    progress: 0,
    taxYear: "—",
    parcelId: p.property_id || p.name,
    history: [],
  };
}
