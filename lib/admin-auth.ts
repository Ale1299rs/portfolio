// Tiny HMAC-signed cookie for the password-only /admin area.
// Runs on the Edge runtime (Web Crypto only).

const COOKIE = "admin_session";
const DEFAULT_PASSWORD = "alex2027";
const DEFAULT_SECRET = "portfolio-admin-default-secret-change-me";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? DEFAULT_SECRET;
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD;
}

export const ADMIN_COOKIE = COOKIE;
export const ADMIN_SESSION_MAX_AGE = SESSION_MAX_AGE;

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const issued = Date.now();
  const payload = `v1.${issued}`;
  const sig = await hmac(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [v, issuedRaw, sig] = parts;
  if (v !== "v1") return false;
  const issued = Number(issuedRaw);
  if (!Number.isFinite(issued)) return false;
  const ageSec = (Date.now() - issued) / 1000;
  if (ageSec < 0 || ageSec > SESSION_MAX_AGE) return false;
  const expected = await hmac(`${v}.${issuedRaw}`);
  return timingSafeEqual(expected, sig);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}
