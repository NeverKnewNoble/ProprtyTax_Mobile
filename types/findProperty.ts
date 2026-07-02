import { UserProperty } from "@/types/property";

export type FindPropertyParams = {
  search_term?: string;
  gps_id?: string;
  property_id?: string;
};

export type FindPropertyResult =
  | { success: true; property: UserProperty }
  | { success: false; message: string };
