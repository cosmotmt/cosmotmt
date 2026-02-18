"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "../../api/auth";

/**
 * お問い合わせメッセージの削除
 */
export async function deleteContact(id: number) {
  if (!(await verifySession())) {
    throw new Error("Unauthorized");
  }

  const db = process.env.DB;
  if (!db) throw new Error("Database connection failed");

  try {
    await db.prepare("DELETE FROM contacts WHERE id = ?").bind(id).run();
    revalidatePath("/admin/contacts");
    revalidatePath("/admin/dashboard");
  } catch (err) {
    console.error("Delete contact error:", err);
    throw new Error("Failed to delete record");
  }
}
