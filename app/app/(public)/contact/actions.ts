"use server";

import { revalidatePath } from "next/cache";

export type ContactState = {
  success?: boolean;
  error?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export async function sendContact(prevState: any, formData: FormData): Promise<ContactState> {
  const db = process.env.DB;
  if (!db) {
    return { error: "データベース接続に失敗しました。" };
  }

  // ハニーポットチェック (ボット対策)
  // フォームには存在しないはずの「電話番号(tel)」フィールドに値が入っていたらスパムとみなす
  const honeypot = formData.get("tel") as string;
  if (honeypot) {
    // ボットには成功したように見せかけて、実際には何もしない
    return { success: true }; 
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  const errors: ContactState["errors"] = {};

  if (!name || name.length < 2) {
    errors.name = ["お名前は2文字以上で入力してください。"];
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = ["有効なメールアドレスを入力してください。"];
  }

  if (!message || message.length < 10) {
    errors.message = ["お問い合わせ内容は10文字以上で入力してください。"];
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  try {
    await db
      .prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)")
      .bind(name, email, message)
      .run();

    revalidatePath("/admin/contacts");
    
    return { success: true };
  } catch (err) {
    console.error("Contact submission error:", err);
    return { error: "送信中に予期せぬエラーが発生しました。時間をおいて再度お試しください。" };
  }
}
