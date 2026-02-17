export const runtime = "edge";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ContactList from "./ContactList";

export default async function AdminContactsPage() {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) {
    redirect("/admin/login");
  }

  const db = process.env.DB;
  if (!db) return <div className="p-8 text-red-500">Database connection failed</div>;

  const { results: contacts } = await db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-sky-500 rounded-full"></span>
            お問い合わせ
          </h1>
          <Link
            href="/admin/dashboard"
            className="text-sm text-gray-500 hover:text-sky-600 transition"
          >
            戻る
          </Link>
        </div>

        <ContactList initialContacts={contacts} />
      </div>
    </div>
  );
}
