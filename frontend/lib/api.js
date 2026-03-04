const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export async function api(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // IMPORTANT: cookie JWT
  });

  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}
