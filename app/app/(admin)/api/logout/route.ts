import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

async function logout() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (sessionId) {
    const db = process.env.DB;
    if (db) {
      // DBからセッションを削除
      await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
    }
    cookieStore.delete("admin_session");
  }

  redirect("/admin/login");
}

export async function POST() {
  return await logout();
}

export async function GET() {
  return await logout();
}
