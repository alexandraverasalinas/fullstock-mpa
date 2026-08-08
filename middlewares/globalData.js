import { getDb } from "../db.js";

export async function globalData(_req, res, next) {
  const db = await getDb();

  const cart = db.carts[0];
  const cartItemsCount = cart
    ? cart.items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  res.locals.cartItemsCount = cartItemsCount;

  next();
}