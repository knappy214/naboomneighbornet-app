import { acceptLanguageHeader } from "../i18n";
import { clearTokens, getTokens, setTokens } from "./auth";
import { API } from "./http";

const RETRY_ONCE = true;

export async function authFetch(path: string, init: RequestInit = {}, retry = RETRY_ONCE): Promise<Response> {
  const tokens = await getTokens();
  const headers = new Headers(init.headers || {});
  if (tokens?.access) headers.set("Authorization", `Bearer ${tokens.access}`);
  headers.set("Accept-Language", acceptLanguageHeader());
  const res = await fetch(`${API}${path}`, { ...init, headers });

  if (res.status !== 401 || !tokens?.refresh || !retry) return res;
  const r = await fetch(`${API}/auth/jwt/refresh`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ refresh: tokens.refresh }) });
  if (!r.ok) { await clearTokens(); return res; }
  const data = await r.json();
  await setTokens({ access: data.access, refresh: tokens.refresh });
  headers.set("Authorization", `Bearer ${data.access}`);
  return await fetch(`${API}${path}`, { ...init, headers });
}
