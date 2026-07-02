import { api } from "@/utils/config/api_client";
import { AddPropertyResult } from "@/types/addProperty";

export type { AddPropertyResult };

export async function addPropertyToUser(
  user_email: string,
  property_id: string
): Promise<AddPropertyResult> {
  try {
    const response = await api.post(
      "/api/v2/method/property_collection.api.users_properties.addPropertyToUser",
      { user_email, property_id }
    );

    const payload = response.data?.data ?? response.data;

    return {
      success: payload?.success === true,
      message: payload?.message ?? "Done",
    };
  } catch (err: any) {
    console.log("addPropertyToUser error:", err.message);
    return { success: false, message: err.message ?? "Network error" };
  }
}

