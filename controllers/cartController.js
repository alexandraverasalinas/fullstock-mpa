import * as cartService from "../services/cartService.js";
import * as productRepository from "../repositories/productRepository.js";
import { AppError } from "../utils/errorUtils.js";
import { setCookie } from "../utils/cookieUtils.js";

export async function renderCart(req, res) {
  const cart = req.cart || { items: [], total: 0 };
  res.render("cart", { cartItems: cart.items, total: cart.total });
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

  const userId = req.user?.id;
  const cart = await cartService.addItemToCart(req.cartId, productId, userId);

  if (!req.user && cart.id !== req.cartId) {
    setCookie(res, "cartId", cart.id);
  }

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

  if (!req.cartId) {
    throw new AppError("No hay carrito activo", 400);
  }

  await cartService.updateItemQuantity(req.cartId, productId, newQuantity);

  res.redirect("/cart");
}

export async function deleteItem(req, res) {
  const productId = Number(req.body.productId);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError("ID de producto inválido", 400);
  }

  if (!req.cartId) {
    throw new AppError("No hay carrito activo", 400);
  }

  await cartService.deleteItemFromCart(req.cartId, productId);

  res.redirect("/cart");
}