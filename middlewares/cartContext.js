import * as cartService from "../services/cartService.js";
import { getCookie, clearCookie } from "../utils/cookieUtils.js";

export async function cartContext(req, res, next) {
  const cartIdCookie = getCookie(req, "cartId");

  req.cart = null;
  req.cartId = null;
  res.locals.cartItemsCount = 0;

  const injectCart = (cart) => {
    if (!cart) return;
    req.cart = cart;
    req.cartId = cart.id;
    res.locals.cartItemsCount = cart.items.reduce(
      (acc, item) => acc + item.quantity,
      0,
    );
  };

  if (req.user) {
    if (cartIdCookie !== undefined) clearCookie(res, "cartId");
    const cart = await cartService.getCartByUserId(req.user.id);
    injectCart(cart);
    return next();
  }

  if (cartIdCookie === false) {
    clearCookie(res, "cartId");
    return next();
  }

  if (!cartIdCookie) return next();

  const cart = await cartService.getCart(Number(cartIdCookie));
  if (!cart) {
    clearCookie(res, "cartId");
  } else {
    injectCart(cart);
  }

  next();
}