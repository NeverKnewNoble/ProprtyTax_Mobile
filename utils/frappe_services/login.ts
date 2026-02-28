import { LoginStructure } from "@/types/auth";
import { siteURL } from "@/utils/config/site_details";
import axios from "axios";

let _sid = "";

export function getFrappeHeaders(): Record<string, string> {
  return _sid ? { Cookie: `sid=${_sid}` } : {};
}

export function clearSession() {
  _sid = "";
}

export async function Login(credentials: LoginStructure): Promise<any> {
  try {
    const { email, password } = credentials;

    // Step 1: Standard Frappe login — gets session cookie
    const sessionResponse = await axios.post(`${siteURL}/api/method/login`, {
      usr: email,
      pwd: password,
    });

    // Extract and save sid from Set-Cookie headers
    const cookieHeaders = sessionResponse.headers["set-cookie"];
    if (cookieHeaders) {
      const raw = Array.isArray(cookieHeaders)
        ? cookieHeaders.join(" ")
        : cookieHeaders;
      const sid = raw.match(/\bsid=([^;,\s]+)/)?.[1];
      if (sid) _sid = sid;
    }

    // Step 2: Fetch full user profile using the session we just got
    const userResponse = await axios.get(
      `${siteURL}/api/resource/User/${encodeURIComponent(email)}`,
      {
        params: { fields: JSON.stringify(["first_name", "last_name", "username", "full_name", "email", "name"]) },
        headers: getFrappeHeaders(),
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
