import { api } from "@/utils/config/api_client";
import { FindPropertyParams, FindPropertyResult } from "@/types/findProperty";

export type { FindPropertyParams, FindPropertyResult };

export async function findProperty(
  params: FindPropertyParams
): Promise<FindPropertyResult> {
  try {
    const response = await api.get(
      "/api/v2/method/property_collection.api.properties.findProperty",
      { params }
    );

    const payload = response.data?.data ?? response.data;

    if (payload?.success && payload.property) {
      return { success: true, property: payload.property };
    }

    return {
      success: false,
      message: payload?.message ?? "Property not found",
    };
  } catch (err: any) {
    console.log("findProperty error:", err.message);
    return { success: false, message: err.message ?? "Network error" };
  }
}
