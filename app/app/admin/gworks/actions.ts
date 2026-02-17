"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * タグ（techs または roles）を処理し、IDの配列を返す
 */
async function getOrCreateTags(db: D1Database, table: "techs" | "roles", names: string[]): Promise<number[]> {
  const ids: number[] = [];
  
  for (const name of names) {
    const trimmedName = name.trim();
    if (!trimmedName) continue;

    let tag = await db
      .prepare(`SELECT id FROM ${table} WHERE name = ?`)
      .bind(trimmedName)
      .first<{ id: number }>();

    if (!tag) {
      const result = await db
        .prepare(`INSERT INTO ${table} (name) VALUES (?)`)
        .bind(trimmedName)
        .run();
      tag = { id: Number(result.meta.last_row_id) };
    }
    
    ids.push(tag.id);
  }
  
  return ids;
}

/**
 * ゲーム実績の新規登録
 */
export async function createGWork(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) return { error: "認証が必要です。" };

  const db = process.env.DB;
  if (!db) return { error: "データベースに接続できません。" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const platform = formData.get("platform") as string;
  const features = formData.get("features") as string;
  const development_type = formData.get("development_type") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const external_url = formData.get("external_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  const techNames = (formData.get("techs") as string)?.split(",").filter(Boolean) || [];
  const roleNames = (formData.get("roles") as string)?.split(",").filter(Boolean) || [];

  if (!title) return { error: "タイトルは必須です。" };

  try {
    const result = await db
      .prepare(
        `INSERT INTO gworks (title, description, platform, features, development_type, thumbnail_url, external_url, start_date, end_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(title, description, platform, features, development_type, thumbnail_url, external_url, start_date || null, end_date || null)
      .run();

    const gworkId = result.meta.last_row_id;

    const techIds = await getOrCreateTags(db, "techs", techNames);
    for (const techId of techIds) {
      await db.prepare("INSERT INTO gwork_techs (gwork_id, tech_id) VALUES (?, ?)").bind(gworkId, techId).run();
    }

    const roleIds = await getOrCreateTags(db, "roles", roleNames);
    for (const roleId of roleIds) {
      await db.prepare("INSERT INTO gwork_roles (gwork_id, role_id) VALUES (?, ?)").bind(gworkId, roleId).run();
    }

    revalidatePath("/admin/gworks");
  } catch (err) {
    console.error("Create GWork error:", err);
    return { error: "登録中にエラーが発生しました。" };
  }

  redirect("/admin/gworks");
}

/**
 * ゲーム実績の更新
 */
export async function updateGWork(id: number, prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) return { error: "認証が必要です。" };

  const db = process.env.DB;
  if (!db) return { error: "データベースに接続できません。" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const platform = formData.get("platform") as string;
  const features = formData.get("features") as string;
  const development_type = formData.get("development_type") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const external_url = formData.get("external_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  const techNames = (formData.get("techs") as string)?.split(",").filter(Boolean) || [];
  const roleNames = (formData.get("roles") as string)?.split(",").filter(Boolean) || [];

  if (!title) return { error: "タイトルは必須です。" };

  try {
    // 1. 本体を更新
    await db
      .prepare(
        `UPDATE gworks SET title = ?, description = ?, platform = ?, features = ?, development_type = ?, thumbnail_url = ?, external_url = ?, start_date = ?, end_date = ? 
         WHERE id = ?`
      )
      .bind(title, description, platform, features, development_type, thumbnail_url, external_url, start_date || null, end_date || null, id)
      .run();

    // 2. 技術タグの更新（一度全部消して、付け直すのが一番確実なのだ！）
    await db.prepare("DELETE FROM gwork_techs WHERE gwork_id = ?").bind(id).run();
    const techIds = await getOrCreateTags(db, "techs", techNames);
    for (const techId of techIds) {
      await db.prepare("INSERT INTO gwork_techs (gwork_id, tech_id) VALUES (?, ?)").bind(id, techId).run();
    }

    // 3. 役割タグの更新
    await db.prepare("DELETE FROM gwork_roles WHERE gwork_id = ?").bind(id).run();
    const roleIds = await getOrCreateTags(db, "roles", roleNames);
    for (const roleId of roleIds) {
      await db.prepare("INSERT INTO gwork_roles (gwork_id, role_id) VALUES (?, ?)").bind(id, roleId).run();
    }

    revalidatePath("/admin/gworks");
  } catch (err) {
    console.error("Update GWork error:", err);
    return { error: "更新中にエラーが発生しました。" };
  }

  redirect("/admin/gworks");
}

/**
 * ゲーム実績の削除
 */
export async function deleteGWork(id: number) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) throw new Error("認証が必要です。");

  const db = process.env.DB;
  if (!db) throw new Error("データベースに接続できません。");

  try {
    await db.prepare("DELETE FROM gworks WHERE id = ?").bind(id).run();
    revalidatePath("/admin/gworks");
  } catch (err) {
    console.error("Delete GWork error:", err);
    throw new Error("削除中にエラーが発生しました。");
  }
}
