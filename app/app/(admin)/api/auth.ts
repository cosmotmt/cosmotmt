import { cookies } from "next/headers";

/**
 * セッションが有効かDBで確認する
 */
export async function verifySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) return false;

  const db = process.env.DB;
  if (!db) return false;

  const session = await db
    .prepare("SELECT id FROM sessions WHERE id = ? AND expires_at > DATETIME('now')")
    .bind(sessionId)
    .first();

  return !!session;
}
