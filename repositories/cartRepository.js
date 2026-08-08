import { getDb, saveDb } from "../db.js";

export async function findCart() {
  const db = await getDb();
  return db.carts[0] || { id: 1, items: [] };
}

export async function saveCart(cart) {
  const db = await getDb();
  db.carts[0] = cart;
  await saveDb(db);
}