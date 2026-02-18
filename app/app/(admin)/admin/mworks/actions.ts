"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifySession } from "../../api/auth";

/**
 * Process tags and return an array of IDs.
 */
async function getOrCreateTags(db: D1Database, table: "roles" | "genres", names: string[]): Promise<number[]> {
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
async function updateTags(db: D1Database, mworkId: number, table: "roles" | "genres", names: string[]) {
  const mapping = {
    roles: { intermediate: "mwork_roles", idCol: "role_id" },
    genres: { intermediate: "mwork_genres", idCol: "genre_id" },
  };
  const { intermediate, idCol } = mapping[table];

  await db.prepare(`DELETE FROM ${intermediate} WHERE mwork_id = ?`).bind(mworkId).run();
  const tagIds = await getOrCreateTags(db, table, names);
  for (const tagId of tagIds) {
    await db.prepare(`INSERT INTO ${intermediate} (mwork_id, ${idCol}) VALUES (?, ?)`).bind(mworkId, tagId).run();
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

export async function createMWork(prevState: any, formData: FormData) {
  if (!(await verifySession())) return { error: "Unauthorized" };

  const db = process.env.DB;
  if (!db) return { error: "Database connection failed" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const audio_url = formData.get("audio_url") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const external_url = formData.get("external_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const development_type = formData.get("development_type") as string;

  const roleNames = (formData.get("roles") as string)?.split(",").filter(Boolean) || [];
  const genreNames = (formData.get("genres") as string)?.split(",").filter(Boolean) || [];

  if (!title) return { error: "Title is required" };

  try {
    const result = await db
      .prepare(`INSERT INTO mworks (title, description, audio_url, thumbnail_url, external_url, start_date, end_date, development_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(title, description, audio_url, thumbnail_url, external_url, start_date || null, end_date || null, development_type)
      .run();

    const mworkId = Number(result.meta.last_row_id);
    await updateTags(db, mworkId, "roles", roleNames);
    await updateTags(db, mworkId, "genres", genreNames);

    revalidatePath("/admin/mworks");
  } catch (err) {
    console.error("Create MWork error:", err);
    return { error: "Failed to create record" };
  }
  redirect("/admin/mworks");
}

export async function updateMWork(id: number, prevState: any, formData: FormData) {
  if (!(await verifySession())) return { error: "Unauthorized" };

  const db = process.env.DB;
  if (!db) return { error: "Database connection failed" };

  const oldWork = await db.prepare("SELECT audio_url, thumbnail_url FROM mworks WHERE id = ?").bind(id).first<{ audio_url: string, thumbnail_url: string }>();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const audio_url = formData.get("audio_url") as string;
  const thumbnail_url = formData.get("thumbnail_url") as string;
  const external_url = formData.get("external_url") as string;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string;
  const development_type = formData.get("development_type") as string;

  const roleNames = (formData.get("roles") as string)?.split(",").filter(Boolean) || [];
  const genreNames = (formData.get("genres") as string)?.split(",").filter(Boolean) || [];

  if (!title) return { error: "Title is required" };

  try {
    await db
      .prepare(`UPDATE mworks SET title = ?, description = ?, audio_url = ?, thumbnail_url = ?, external_url = ?, start_date = ?, end_date = ?, development_type = ? WHERE id = ?`)
      .bind(title, description, audio_url, thumbnail_url, external_url, start_date || null, end_date || null, development_type, id)
      .run();

    // Clean up old files if changed
    if (oldWork) {
      if (oldWork.audio_url && oldWork.audio_url !== audio_url) await deleteFromR2(oldWork.audio_url);
      if (oldWork.thumbnail_url && oldWork.thumbnail_url !== thumbnail_url) await deleteFromR2(oldWork.thumbnail_url);
    }

    await updateTags(db, id, "roles", roleNames);
    await updateTags(db, id, "genres", genreNames);

    revalidatePath("/admin/mworks");
  } catch (err) {
    console.error("Update MWork error:", err);
    return { error: "Failed to update record" };
  }
  redirect("/admin/mworks");
}

export async function deleteMWork(id: number) {
  if (!(await verifySession())) throw new Error("Unauthorized");

  const db = process.env.DB;
  if (!db) throw new Error("Database connection failed");

  try {
    const work = await db.prepare("SELECT audio_url, thumbnail_url FROM mworks WHERE id = ?").bind(id).first<{ audio_url: string, thumbnail_url: string }>();
    await db.prepare("DELETE FROM mworks WHERE id = ?").bind(id).run();
    
    if (work) {
      if (work.audio_url) await deleteFromR2(work.audio_url);
      if (work.thumbnail_url) await deleteFromR2(work.thumbnail_url);
    }

    revalidatePath("/admin/mworks");
  } catch (err) {
    console.error("Delete MWork error:", err);
    throw new Error("Failed to delete record");
  }
}
