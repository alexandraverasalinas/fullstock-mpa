import * as cartRepository from "../repositories/cartRepository.js";
import * as productRepository from "../repositories/productRepository.js";

async function hydrateCart(cart) {
  const products = await productRepository.findAll();

  const enrichedItems = cart.items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      quantity: item.quantity,
      product: product || { name: "Producto no encontrado", price: 0, imgSrc: "" },
    };
  });

  const total = enrichedItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0,
  );

  return { ...cart, items: enrichedItems, total };
}

export async function getCart(cartId) {
  if (!cartId) return null;
  const cart = await cartRepository.find(cartId);
  return cart ? hydrateCart(cart) : null;
}

export async function getCartByUserId(userId) {
  const cart = await cartRepository.findByUserId(userId);
  return cart ? hydrateCart(cart) : null;
}

export async function getOrCreateCart(cartId, userId = null) {
  let cart;

  if (cartId) {
    cart = await cartRepository.find(cartId);
  }

  if (!cart && userId) {
    cart = await cartRepository.findByUserId(userId);
  }

  if (!cart) {
    cart = await cartRepository.create(userId);
  }

  return cart ? await hydrateCart(cart) : null;
}

export async function addItemToCart(cartId, productId, userId = null) {
  const cart = await getOrCreateCart(cartId, userId);

  const rawCart = await cartRepository.find(cart.id);

  const cartItem = rawCart.items.find((item) => item.productId === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    rawCart.items.push({ productId, quantity: 1 });
  }

  await cartRepository.update(rawCart);

  return await hydrateCart(rawCart);
}

export async function updateItemQuantity(cartId, productId, newQuantity) {
  const cart = await cartRepository.find(cartId);

  if (!cart) return;

  const cartItem = cart.items.find((item) => item.productId === productId);
  if (cartItem) {
    cartItem.quantity = newQuantity;
  }

  await cartRepository.update(cart);
}

export async function deleteItemFromCart(cartId, productId) {
  const cart = await cartRepository.find(cartId);

  if (!cart) return;

  cart.items = cart.items.filter((item) => item.productId !== productId);
  await cartRepository.update(cart);
}

export async function clearCart(cartId) {
  const cart = await cartRepository.find(cartId);

  if (!cart) return;

  cart.items = [];
  await cartRepository.update(cart);
}

export async function mergeCarts(guestCartId, userId) {
  const guestCart = await cartRepository.find(guestCartId);
  if (!guestCart || guestCart.items.length === 0) return;

  let userCart = await cartRepository.findByUserId(userId);
  if (!userCart) {
    userCart = await cartRepository.create(userId);
  }

  for (const guestItem of guestCart.items) {
    const existingItem = userCart.items.find(
      (item) => item.productId === guestItem.productId,
    );
    if (existingItem) {
      existingItem.quantity += guestItem.quantity;
    } else {
      userCart.items.push({ ...guestItem });
    }
  }

  await cartRepository.update(userCart);
  await cartRepository.destroy(guestCartId);
}