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

export type InvoicePropertyDetails = {
  property_id: string;
  full_name: string;
  property_address: string | null;
  gps_id: string;
};

export type Invoice = {
  name: string;
  customer: string;
  customer_name: string;
  posting_date: string;
  due_date: string;
  grand_total: number;
  outstanding_amount: number;
  status: string;
  custom_property: string;
  custom_zone: string;
  custom_billing_year: string;
  custom_property_type: string;
  custom_property_owner_email: string | null;
  custom_property_owner_mobile_number: string;
  creation: string;
  modified: string;
  property_details: InvoicePropertyDetails;
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
