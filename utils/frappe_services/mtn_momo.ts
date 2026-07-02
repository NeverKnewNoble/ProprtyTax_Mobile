import { api } from "@/utils/config/api_client";
import { MomoPaymentRequest, MomoPaymentResponse } from "../../types/momo";


// ****** FUNCTION TO REQUEST PAYMENT FROM MOMO ******
export const PayWithMomo = async (number: string, amount: string): Promise<void> => {
  try {
    const payload: MomoPaymentRequest = {
      phone_number: number,
      amount: amount,
    };

    const res = await api.post("/api/method/property_collection.api.momo.request_to_pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data: MomoPaymentResponse = res.data;

    console.log("MoMo Response:", data);
  } catch (error) {
    console.error("MoMo Payment Error:", error);
  }
};


// ?? ******* UTILITY FUNCTIONS *******
// *** Function To Format phone number ************
export const formatGhanaPhone = (phone: string): string => {
  let cleaned = phone.replace(/\s+/g, "").replace("+", "");

  if (cleaned.startsWith("0")) {
    cleaned = "233" + cleaned.slice(1);
  }

  if (!cleaned.startsWith("233")) {
    throw new Error("Invalid Ghana phone number");
  }

  return cleaned;
};