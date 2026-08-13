import { getDb } from "../db.js";
import * as cartService from "../services/cartService.js";

export async function globalData(req, res, next) {
  const db = await getDb();

  let cartItemsCount = 0;

  if (req.cartId) {
    const cart = await cartService.getCart(req.cartId);
    cartItemsCount = cart.items ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
  }

  res.locals.cartItemsCount = cartItemsCount;

  next();
}