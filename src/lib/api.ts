const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL as string; // e.g. https://xxxx.supabase.co/functions/v1

let sessionToken: string | null = null;

export function setSessionToken(token: string) {
  sessionToken = token;
  sessionStorage.setItem("tg_session", token);
}

export function getSessionToken(): string | null {
  if (sessionToken) return sessionToken;
  sessionToken = sessionStorage.getItem("tg_session");
  return sessionToken;
}

export async function authenticate(initData: string) {
  const res = await fetch(`${FUNCTIONS_URL}/telegram-auth`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ initData }),
  });
  if (!res.ok) throw new Error("auth failed");
  const data = await res.json();
  setSessionToken(data.token);
  return data;
}

async function api(path: string, opts: RequestInit = {}) {
  const token = getSessionToken();
  const res = await fetch(`${FUNCTIONS_URL}/miniapp-api${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(opts.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? `request failed (${res.status})`);
  }
  return res.json();
}

export function checkout(body: {
  variant_id: string;
  quantity?: number;
  recipient: { type: "self" | "username" | "user_id"; value?: string | number };
}) {
  return api("/checkout", { method: "POST", body: JSON.stringify(body) });
}

export function getOrder(id: string) {
  return api(`/orders/${id}`);
}

// Product catalog is public (RLS allows anon read of active products), so it
// is fetched directly from PostgREST rather than through miniapp-api.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export async function fetchProducts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=*,product_variants(*)&status=eq.active&order=sort_order`,
    { headers: { apikey: SUPABASE_ANON_KEY, authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
  );
  if (!res.ok) throw new Error("failed to load products");
  return res.json();
}
