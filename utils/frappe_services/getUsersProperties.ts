import { api } from "@/utils/config/api_client";
import { GetPropertiesResult } from "@/types/getUsersProperties";

export type { GetPropertiesResult };

export async function fetchUsersProperties(): Promise<GetPropertiesResult> {
  try {
    const response = await api.get(
      "/api/v2/method/property_collection.api.users_properties.fetchUsersProperties"
    );

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
