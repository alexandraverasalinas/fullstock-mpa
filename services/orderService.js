import * as cartService from "./cartService.js";
import * as orderRepository from "../repositories/orderRepository.js";
import { AppError } from "../utils/errorUtils.js";

export async function processCheckout(shippingInfo) {
  const cart = await cartService.getCart();

  if (!cart || cart.items.length === 0) {
    throw new AppError("El carrito está vacío", 400);
  }

  const total = await cartService.calculateCartTotal(cart.items);

  const items = cart.items.map((item) => ({
    productId: item.productId,
    name: item.product.name,
    price: item.product.price,
    imgSrc: item.product.imgSrc,
    quantity: item.quantity,
  }));

  const order = {
    items,
    shippingInfo,
    total,
  };

  const newOrder = await orderRepository.create(order);

  await cartService.clearCart();

  return newOrder;
}

export async function getOrderById(id) {
  return await orderRepository.findById(id);
}