import axios from "axios";
import { siteURL } from "./site_details";

let _sid = "";

export function saveSid(cookieHeaders: string | string[] | undefined) {
  if (!cookieHeaders) return;
  const raw = Array.isArray(cookieHeaders)
    ? cookieHeaders.join(" ")
    : cookieHeaders;
  const match = raw.match(/\bsid=([^;,\s]+)/);
  if (match?.[1] && match[1] !== "Guest") _sid = match[1];
}

export function clearSid() {
  _sid = "";
}

// Shared axios instance — every request gets the latest sid,
// every response updates it automatically (handles Frappe session rotation).
export const api = axios.create({ baseURL: siteURL });

api.interceptors.request.use((config) => {
  if (_sid) config.headers["Cookie"] = `sid=${_sid}`;
  return config;
});

api.interceptors.response.use((response) => {
  saveSid(response.headers["set-cookie"]);
  return response;
});
