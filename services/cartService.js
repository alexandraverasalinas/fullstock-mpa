import * as cartRepository from "../repositories/cartRepository.js";
import * as productRepository from "../repositories/productRepository.js";

export async function getCart(cartId) {
  if (!cartId) {
    return { items: [], total: 0 };
  }

  const cart = await cartRepository.find(cartId);

  if (!cart || !cart.items || cart.items.length === 0) {
    return { ...cart, items: [] };
  }

  const enrichedItems = [];

  for (const item of cart.items) {
    const product = await productRepository.findById(item.productId);

    enrichedItems.push({
      productId: item.productId,
      quantity: item.quantity,
      product: product || { name: "Producto no encontrado", price: 0, imgSrc: "" },
    });
  }

  return { ...cart, items: enrichedItems };
}

export async function calculateCartTotal(cartItems) {
  if (!cartItems || cartItems.length === 0) return 0;

  return cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + price * item.quantity;
  }, 0);
}

export async function addItemToCart(cartId, productId) {
  let cart = await cartRepository.find(cartId);

  if (!cart) {
    cart = await cartRepository.create();
  }

  const cartItem = cart.items.find((item) => item.productId === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  await cartRepository.update(cart);

  return cart;
}

export async function updateItemQuantity(cartId, productId, newQuantity) {
  const cart = await cartRepository.find(cartId);

  if (!cart) {
    return;
  }

  const cartItem = cart.items.find((item) => item.productId === productId);
  if (cartItem) {
    cartItem.quantity = newQuantity;
  }

  await cartRepository.update(cart);
}

export async function deleteItemFromCart(cartId, productId) {
  const cart = await cartRepository.find(cartId);

  if (!cart) {
    return;
  }

  cart.items = cart.items.filter((item) => item.productId !== productId);
  await cartRepository.update(cart);
}

export async function clearCart(cartId) {
  const cart = await cartRepository.find(cartId);

  if (!cart) {
    return;
  }

  cart.items = [];
  await cartRepository.update(cart);
}