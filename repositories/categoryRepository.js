import { getDb } from "../db.js";

export async function findAll() {
  const db = await getDb();
  return db.categories;
}

export async function findBySlug(slug) {
  const db = await getDb();
  return db.categories.find((c) => c.slug === slug) || null;
}