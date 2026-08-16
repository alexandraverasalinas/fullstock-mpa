import { getCookie, clearCookie } from "../utils/cookieUtils.js";

export function cartContext(req, res, next) {
  const cartIdCookie = getCookie(req, "cartId");

  if (cartIdCookie === false) {
    clearCookie(res, "cartId");
    req.cartId = null;
    return next();
  }

  req.cartId = cartIdCookie ? Number(cartIdCookie) : null;

  next();
}