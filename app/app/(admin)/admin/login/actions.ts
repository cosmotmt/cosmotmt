"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * PBKDF2 を使用してパスワードをハッシュ化する
 */
async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    256
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export type ActionState = {
  error?: string;
} | null;

/**
 * 管理者ログイン処理
 */
export async function login(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "メールアドレスとパスワードを入力してください。" };
  }

  const db = process.env.DB;
  if (!db) {
    console.error("D1 Database binding is missing.");
    return { error: "システムエラーが発生しました。" };
  }

  try {
    const admin = await db
      .prepare("SELECT id, password, salt FROM admins WHERE email = ?")
      .bind(email)
      .first<{ id: number; password: string; salt: string }>();

    if (!admin || (await hashPassword(password, admin.salt)) !== admin.password) {
      return { error: "メールアドレスかパスワードが間違っています。" };
    }

    const cookieStore = await cookies();
    cookieStore.set("admin_session", admin.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1日
      path: "/",
    });

  } catch (err) {
    console.error("Login action error:", err);
    return { error: "エラーが発生しました。" };
  }

  redirect("/admin/dashboard");
}
