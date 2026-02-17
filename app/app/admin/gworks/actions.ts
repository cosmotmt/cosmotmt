"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Process tags and return an array of IDs.
 */
async function getOrCreateTags(db: D1Database, table: "techs" | "roles" | "platforms", names: string[]): Promise<number[]> {
  const ids: number[] = [];
  for (const name of names) {
    const trimmedName = name.trim();
    if (!trimmedName) continue;

    let tag = await db.prepare(`SELECT id FROM ${table} WHERE name = ?`).bind(trimmedName).first<{ id: number }>();
    if (!tag) {
      const result = await db.prepare(`INSERT INTO ${table} (name) VALUES (?)`).bind(trimmedName).run();
      tag = { id: Number(result.meta.last_row_id) };
    }
    ids.push(tag.id);
  }
  return ids;
}

/**
 * Update intermediate tables for tags.
 */
async function updateTags(db: D1Database, gworkId: number, table: "techs" | "roles" | "platforms", names: string[]) {
  const mapping = {
    techs: { intermediate: "gwork_techs", idCol: "tech_id" },
    roles: { intermediate: "gwork_roles", idCol: "role_id" },
    platforms: { intermediate: "gwork_platforms", idCol: "platform_id" },
  };
  const { intermediate, idCol } = mapping[table];

  await db.prepare(`DELETE FROM ${intermediate} WHERE gwork_id = ?`).bind(gworkId).run();
  const tagIds = await getOrCreateTags(db, table, names);
  for (const tagId of tagIds) {
    await db.prepare(`INSERT INTO ${intermediate} (gwork_id, ${idCol}) VALUES (?, ?)`).bind(gworkId, tagId).run();
  }
}

/**
 * Delete a file from R2 storage.
 */
async function deleteFromR2(url: string | null) {
  if (!url || !url.startsWith("/api/storage/")) return;
  const fileName = url.replace("/api/storage/", "");
  const bucket = process.env.R2 as R2Bucket;
  if (bucket) {
    try {
      await bucket.delete(fileName);
    } catch (err) {
      console.error(`Failed to delete R2 file: ${fileName}`, err);
    }
  }
}

export async function createGWork(prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) return { error: "Unauthorized" };

  const db = process.env.DB;
  if (!db) return { error: "Database connection failed" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const features = formData.get("features") as string;
  const development_type = formData.get("development_type") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const external_url = formData.get("external_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  const techNames = (formData.get("techs") as string)?.split(",").filter(Boolean) || [];
  const roleNames = (formData.get("roles") as string)?.split(",").filter(Boolean) || [];
  const platformNames = (formData.get("platform") as string)?.split(",").filter(Boolean) || [];

  if (!title) return { error: "Title is required" };

  try {
    const result = await db
      .prepare(`INSERT INTO gworks (title, description, features, development_type, thumbnail_url, external_url, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(title, description, features, development_type, thumbnail_url, external_url, start_date || null, end_date || null)
      .run();

    const gworkId = Number(result.meta.last_row_id);
    await updateTags(db, gworkId, "techs", techNames);
    await updateTags(db, gworkId, "roles", roleNames);
    await updateTags(db, gworkId, "platforms", platformNames);

    revalidatePath("/admin/gworks");
  } catch (err) {
    console.error("Create GWork error:", err);
    return { error: "Failed to create record" };
  }
  redirect("/admin/gworks");
}

export async function updateGWork(id: number, prevState: any, formData: FormData) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) return { error: "Unauthorized" };

  const db = process.env.DB;
  if (!db) return { error: "Database connection failed" };

  const oldWork = await db.prepare("SELECT thumbnail_url FROM gworks WHERE id = ?").bind(id).first<{ thumbnail_url: string }>();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const features = formData.get("features") as string;
  const development_type = formData.get("development_type") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const external_url = formData.get("external_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;

  const techNames = (formData.get("techs") as string)?.split(",").filter(Boolean) || [];
  const roleNames = (formData.get("roles") as string)?.split(",").filter(Boolean) || [];
  const platformNames = (formData.get("platform") as string)?.split(",").filter(Boolean) || [];

  if (!title) return { error: "Title is required" };

  try {
    await db
      .prepare(`UPDATE gworks SET title = ?, description = ?, features = ?, development_type = ?, thumbnail_url = ?, external_url = ?, start_date = ?, end_date = ? WHERE id = ?`)
      .bind(title, description, features, development_type, thumbnail_url, external_url, start_date || null, end_date || null, id)
      .run();

    if (oldWork && oldWork.thumbnail_url && oldWork.thumbnail_url !== thumbnail_url) {
      await deleteFromR2(oldWork.thumbnail_url);
    }

    await updateTags(db, id, "techs", techNames);
    await updateTags(db, id, "roles", roleNames);
    await updateTags(db, id, "platforms", platformNames);

    revalidatePath("/admin/gworks");
  } catch (err) {
    console.error("Update GWork error:", err);
    return { error: "Failed to update record" };
  }
  redirect("/admin/gworks");
}

export async function deleteGWork(id: number) {
  const cookieStore = await cookies();
  if (!cookieStore.get("admin_session")) throw new Error("Unauthorized");

  const db = process.env.DB;
  if (!db) throw new Error("Database connection failed");

  try {
    const work = await db.prepare("SELECT thumbnail_url FROM gworks WHERE id = ?").bind(id).first<{ thumbnail_url: string }>();
    await db.prepare("DELETE FROM gworks WHERE id = ?").bind(id).run();
    if (work?.thumbnail_url) await deleteFromR2(work.thumbnail_url);
    revalidatePath("/admin/gworks");
  } catch (err) {
    console.error("Delete GWork error:", err);
    throw new Error("Failed to delete record");
  }
}
