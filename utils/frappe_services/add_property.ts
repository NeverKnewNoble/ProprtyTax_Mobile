import { getFrappeHeaders } from "@/utils/frappe_services/login";
import { siteURL } from "@/utils/config/site_details";
import axios from "axios";

export type AddPropertyResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function addPropertyToUser(
  user_email: string,
  property_id: string,
): Promise<AddPropertyResult> {
  try {
    console.log(
      "addPropertyToUser → user_email:",
      user_email,
      "property_id:",
      property_id,
    );
    const response = await axios.get(
      `${siteURL}/api/v2/method/property_collection.api.users_properties.addPropertyToUser`,

      { params: { user_email, property_id }, headers: getFrappeHeaders() },
    );

    console.log("addPropertyToUser API response:", response.data);
    console.log("addPropertyToUser response status:", response.status);
    console.log("addPropertyToUser response headers:", response.headers);

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
