import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin-auth";
import { EDITABLE_FILES } from "@/lib/admin-github";
import { AdminApp } from "./AdminApp";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const authed = await verifySessionToken(token);

  return (
    <AdminApp
      authed={authed}
      files={EDITABLE_FILES.map(({ path, label }) => ({ path, label }))}
    />
  );
}
