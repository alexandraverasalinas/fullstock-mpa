import { getDb, saveDb, getNextId } from "../db.js";

export async function find(id) {
  const db = await getDb();

  if (!db.carts) {
    return null;
  }

  return db.carts.find((cart) => cart.id === id) || null;
}

export async function findByUserId(userId) {
  const db = await getDb();

  if (!db.carts) {
    return null;
  }

  return db.carts.find((cart) => cart.userId === userId) || null;
}

export async function create(userId = null) {
  const db = await getDb();

  if (!db.carts) {
    db.carts = [];
  }

  const id = await getNextId("carts");

  const newCart = { id, userId, items: [] };

  db.carts.push(newCart);
  await saveDb(db);

  return newCart;
}

export async function update(cart) {
  const db = await getDb();

  if (!db.carts) {
    db.carts = [];
  }

  const index = db.carts.findIndex((c) => c.id === cart.id);

  if (index >= 0) {
    db.carts[index] = cart;
  } else {
    db.carts.push(cart);
  }

  await saveDb(db);
}

export async function destroy(id) {
  const db = await getDb();

  if (!db.carts) {
    return;
  }

  db.carts = db.carts.filter((cart) => cart.id !== id);
  await saveDb(db);
}