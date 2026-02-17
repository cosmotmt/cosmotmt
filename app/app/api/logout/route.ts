import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
