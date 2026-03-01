import { LoginStructure } from "@/types/auth";
import { api, clearSid, saveSid } from "@/utils/config/api_client";

export function clearSession() {
  clearSid();
}

export async function Login(credentials: LoginStructure): Promise<any> {
  try {
    const { email, password } = credentials;

    // Step 1: Standard Frappe login — saves session sid
    const sessionResponse = await api.post("/api/method/login", {
      usr: email,
      pwd: password,
    });
    saveSid(sessionResponse.headers["set-cookie"]);

    // Step 2: Fetch full user profile with the session we just got
    const userResponse = await api.get(
      `/api/resource/User/${encodeURIComponent(email)}`,
      {
        params: {
          fields: JSON.stringify([
            "first_name",
            "last_name",
            "username",
            "full_name",
            "email",
            "name",
          ]),
        },
      }
    );

    const u = userResponse.data?.data;

    return {
      success: true,
      user: {
        email: u?.email ?? email,
        name: u?.full_name ?? u?.name ?? email,
        first_name: u?.first_name ?? "",
        last_name: u?.last_name ?? "",
        username: u?.username ?? "",
      },
    };
  } catch (err: any) {
    console.log(err, "Failed to establish login connection");
    throw err;
  }
}
