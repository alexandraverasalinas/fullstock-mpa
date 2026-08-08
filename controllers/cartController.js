import * as cartService from "../services/cartService.js";
import * as productRepository from "../repositories/productRepository.js";
import { AppError } from "../utils/errorUtils.js";

export async function renderCart(req, res) {
  const cart = await cartService.getCart();
  const total = await cartService.calculateCartTotal(cart.items);

  res.render("cart", { cartItems: cart.items, total });
}

export async function addItem(req, res) {
  const productId = Number(req.body.productId);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError("ID de producto inválido", 400);
  }

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  await cartService.addItemToCart(productId);

  res.redirect("/products/" + productId);
}

export async function updateItem(req, res) {
  const productId = Number(req.body.productId);
  const newQuantity = Number(req.body.quantity);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError("ID de producto inválido", 400);
  }

  if (!Number.isFinite(newQuantity) || newQuantity <= 0) {
    throw new AppError("Cantidad inválida", 400);
  }

  await cartService.updateItemQuantity(productId, newQuantity);

  res.redirect("/cart");
}

export async function deleteItem(req, res) {
  const productId = Number(req.body.productId);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError("ID de producto inválido", 400);
  }

  await cartService.deleteItemFromCart(productId);

  res.redirect("/cart");
}