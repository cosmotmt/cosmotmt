import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("admin_session")?.value;

  if (!sessionId) {
    redirect("/admin/login");
  }

  const db = process.env.DB;
  if (db) {
    const session = await db
      .prepare("SELECT id FROM sessions WHERE id = ? AND expires_at > DATETIME('now')")
      .bind(sessionId)
      .first();

    if (!session) {
      // セッションが無効な場合はログアウトAPIへリダイレクト
      redirect("/api/logout");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
