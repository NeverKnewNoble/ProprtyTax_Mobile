export type HistoryItem = {
  period: string;
  amount: string;
  date: string;
};

export type PropertyType = "Residential" | "Commercial" | "Vacation";

export type Property = {
  id: number;
  name: string;
  address: string;
  type: PropertyType;
  balance: string;
  due: string;
  dueDate: string;
  progress: number;
  taxYear: string;
  parcelId: string;
  history: HistoryItem[];
};

// Shape returned by fetchUsersProperties API
export type UserProperty = {
  name: string;
  full_name: string;
  property_id: string;
  gps_id: string;
  property_address: string;
  land_size: string;
  ghana_card_tin_number: string;
  property_type: { name: string; property_type: string } | null;
  zone: { name: string; zone_name: string } | null;
  customer: { name: string; customer_name: string } | null;
  creation: string;
  modified: string;
};

export type FoundProperty = {
  name: string;
  address: string;
  type: string;
  parcelId: string;
  taxYear: string;
  estimatedTax: string;
  owner: string;
  assessedValue: string;
};
