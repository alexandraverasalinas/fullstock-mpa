export function cartContext(req, res, next) {
  const cartIdCookie = req.cookies.cartId;

  req.cartId = cartIdCookie ? Number(cartIdCookie) : null;

  next();
}