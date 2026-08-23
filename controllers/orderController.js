import * as orderService from "../services/orderService.js";
import { AppError } from "../utils/errorUtils.js";
import { clearCookie } from "../utils/cookieUtils.js";

export async function renderCheckout(req, res) {
  const cart = req.cart || { items: [], total: 0 };
  res.render("checkout", { cartItems: cart.items, total: cart.total });
}

export async function placeOrder(req, res) {
  if (!req.cartId) {
    throw new AppError("No hay carrito activo", 400);
  }

  const order = await orderService.processCheckout(
    req.cartId,
    req.body,
    req.user?.id,
  );

  clearCookie(res, "cartId");

  res.redirect("/order-confirmation?orderId=" + order.id);
}

export async function renderOrderConfirmation(req, res) {
  const orderId = Number(req.query.orderId);

  if (!orderId) {
    throw new AppError("ID de orden inválido", 400);
  }

  const order = await orderService.getOrderById(orderId);

  if (!order) {
    throw new AppError("Orden no encontrada", 404);
  }

  res.render("order-confirmation", { orderId });
}