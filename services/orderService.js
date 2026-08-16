import * as cartService from "./cartService.js";
import * as orderRepository from "../repositories/orderRepository.js";
import * as userService from "./userService.js";
import { AppError } from "../utils/errorUtils.js";

export async function processCheckout(cartId, shippingInfo, userId = null) {
  const cart = await cartService.getCart(cartId);

  if (!cart || cart.items.length === 0) {
    throw new AppError("El carrito está vacío", 400);
  }

  if (!userId) {
    const user = await userService.getUserByEmail(shippingInfo.email);
    if (user) userId = user.id;
  }

  const items = cart.items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    imgSrc: item.product.imgSrc,
    quantity: item.quantity,
  }));

  const order = {
    userId,
    items,
    shippingInfo,
    total: cart.total,
  };

  const newOrder = await orderRepository.create(order);

  await cartService.clearCart(cartId);

  return newOrder;
}

export async function getOrderById(id) {
  return await orderRepository.findById(id);
}

export async function linkPastOrdersToUser(email, userId) {
  await orderRepository.updateUserIdByEmail(email, userId);
}