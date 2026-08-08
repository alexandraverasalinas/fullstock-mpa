import { getDb } from "../db.js";

export async function findAll() {
  const db = await getDb();
  return db.products;
}

export async function findById(id) {
  const db = await getDb();
  return db.products.find((p) => p.id === id) || null;
}

export async function findAllByCategoryId(categoryId) {
  const db = await getDb();
  return db.products.filter((p) => p.categoryId === categoryId);
}