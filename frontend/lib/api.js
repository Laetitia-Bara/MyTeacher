console.log("API_URL DEBUG", {
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NODE_ENV: process.env.NODE_ENV,
});

const isDev = process.env.NODE_ENV === "development";

const API_URL = isDev
  ? process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"
  : process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_URL) throw new Error("NEXT_PUBLIC_BACKEND_URL is missing");
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
