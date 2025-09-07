import Constants from "expo-constants";
import { acceptLanguageHeader } from "../i18n";

const extra: any = Constants.expoConfig?.extra || {};
const API = (process.env.EXPO_PUBLIC_API_BASE as string) || (extra.apiBase as string) || "";

export class HttpError extends Error {
  constructor(public status: number, public body?: any) { super(`HTTP ${status}`); }
}

async function parseJSON(res: Response) {
  const text = await res.text();
  try { return text ? JSON.parse(text) : null; } catch { return text; }
}

export async function http(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Accept", "application/json");
  headers.set("Accept-Language", acceptLanguageHeader());
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  const res = await fetch(`${API}${path}`, { ...init, headers });
  const body = await parseJSON(res);
  if (!res.ok) throw new HttpError(res.status, body);
  return body;
}

export { API };
