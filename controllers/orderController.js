import { z } from "zod";
import * as cartService from "../services/cartService.js";
import * as orderService from "../services/orderService.js";
import { AppError } from "../utils/errorUtils.js";
import { clearCookie } from "../utils/cookieUtils.js";
import { orderSchema } from "../public/js/shared/orderSchema.js";

export async function renderCheckout(req, res) {
  const cart = req.cart || { items: [], total: 0 };
  res.render("checkout", {
    cartItems: cart.items,
    total: cart.total,
    errors: {},
    values: {},
  });
}

export async function placeOrder(req, res) {
  if (!req.cartId) {
    throw new AppError("No hay carrito activo", 400);
  }

  const result = orderSchema.safeParse(req.body);

  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors;
    const cart = req.cart || { items: [], total: 0 };

    return res.render("checkout", {
      cartItems: cart.items,
      total: cart.total,
      errors,
      values: req.body,
    });
  }

  const order = await orderService.processCheckout(
    req.cartId,
    result.data,
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