import * as cartRepository from "../repositories/cartRepository.js";
import * as productRepository from "../repositories/productRepository.js";

export async function getCart() {
  const cart = await cartRepository.findCart();
  
  if (!cart.items || cart.items.length === 0) {
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
    return sum + (price * item.quantity);
  }, 0);
}

export async function addItemToCart(productId) {
  const cart = await cartRepository.findCart();

  const cartItem = cart.items.find((item) => item.productId === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  await cartRepository.saveCart(cart);
}

export async function updateItemQuantity(productId, newQuantity) {
  const cart = await cartRepository.findCart();

  const cartItem = cart.items.find((item) => item.productId === productId);
  if (cartItem) {
    cartItem.quantity = newQuantity;
  }

  await cartRepository.saveCart(cart);
}

export async function deleteItemFromCart(productId) {
  const cart = await cartRepository.findCart();
  cart.items = cart.items.filter((item) => item.productId !== productId);
  await cartRepository.saveCart(cart);
}

export async function clearCart() {
  const cart = await cartRepository.findCart();

  if (!cart) {
    return;
  }

  cart.items = [];
  await cartRepository.saveCart(cart);
}