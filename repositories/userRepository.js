import { getDb, getNextId, saveDb } from "../db.js";

export async function findByEmail(email) {
  const db = await getDb();

  if (!db.users) {
    return null;
  }

  return db.users.find((user) => user.email === email) || null;
}

export async function findById(id) {
  const db = await getDb();

  if (!db.users) {
    return null;
  }

  return db.users.find((user) => user.id === id) || null;
}

export async function create(userData) {
  const db = await getDb();

  if (!db.users) {
    db.users = [];
  }

  const nextId = await getNextId("users");

  const newUser = { id: nextId, ...userData };
  db.users.push(newUser);
  await saveDb(db);

  return newUser;
}