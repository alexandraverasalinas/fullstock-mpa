export function cartContext(req, res, next) {
  const cartIdCookie = req.signedCookies.cartId;

  if (cartIdCookie === false) {
    res.clearCookie("cartId");
    req.cartId = null;
    return next();
  }

  req.cartId = cartIdCookie ? Number(cartIdCookie) : null;

  next();
}