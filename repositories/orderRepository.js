import { getDb, saveDb, getNextId } from "../db.js";

export async function create(order) {
  const db = await getDb();

  if (!db.orders) {
    db.orders = [];
  }

  const id = await getNextId("orders");

  const newOrder = {
    id,
    ...order,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  db.orders.push(newOrder);
  await saveDb(db);

  return newOrder;
}

export async function findById(id) {
  const db = await getDb();

  if (!db.orders) return null;

  return db.orders.find((order) => order.id === id) || null;
}

export async function updateUserIdByEmail(email, userId) {
  const db = await getDb();

  if (!db.orders) return;

  db.orders.forEach((order) => {
    if (order.shippingInfo && order.shippingInfo.email === email) {
      order.userId = userId;
    }
  });

  await saveDb(db);
}