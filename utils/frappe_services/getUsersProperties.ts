import { UserProperty } from "@/types/property";
import axios from "axios";
import { getFrappeHeaders } from "./login";
import { siteURL } from "../config/site_details";

export type GetPropertiesResult =
  | { success: true; properties: UserProperty[] }
  | { success: false; message: string };

export async function fetchUsersProperties(): Promise<GetPropertiesResult> {
  try {
    const response = await axios.get(
      `${siteURL}/api/v2/method/property_collection.api.users_properties.fetchUsersProperties`,
      { headers: getFrappeHeaders() },
    );

    // Frappe wraps the return value inside response.data.data
    const payload = response.data?.data ?? response.data;

    if (payload?.success && Array.isArray(payload.properties)) {
      return { success: true, properties: payload.properties };
    }

    return {
      success: false,
      message: payload?.message ?? "Failed to fetch properties",
    };
  } catch (err: any) {
    console.log("fetchUsersProperties error:", err.message);
    return { success: false, message: err.message ?? "Network error" };
  }
}
