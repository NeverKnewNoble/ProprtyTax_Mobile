import { UserProperty } from "@/types/property";
import { api } from "@/utils/config/api_client";

type FindPropertyParams = {
  search_term?: string;
  gps_id?: string;
  property_id?: string;
};

export type FindPropertyResult =
  | { success: true; property: UserProperty }
  | { success: false; message: string };

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
