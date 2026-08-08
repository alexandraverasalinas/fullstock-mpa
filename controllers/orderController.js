import * as cartService from "../services/cartService.js";
import * as orderService from "../services/orderService.js";
import { AppError } from "../utils/errorUtils.js";

export async function renderCheckout(req, res) {
  const cart = await cartService.getCart();

  const total = cart && cart.items.length > 0 
    ? await cartService.calculateCartTotal(cart.items) 
    : 0;

  res.render("checkout", { cartItems: cart?.items || [], total });
}

export async function placeOrder(req, res) {
  const shippingInfo = req.body;

  const order = await orderService.processCheckout(shippingInfo);

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