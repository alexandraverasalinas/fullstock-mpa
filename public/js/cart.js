import { updateBadge } from "/js/header.js";

function renderQuantityControls(item) {
  const decrementForm =
    item.quantity === 1
      ? `<form action="/cart/delete-item" method="POST">
          <input type="hidden" name="productId" value="${item.productId}" />
          <button type="submit" class="button button--sm-icon button--outline" aria-label="Eliminar artículo">
            <img src="/images/icons/minus.svg" alt="Reducir" />
          </button>
        </form>`
      : `<form action="/cart/update-item" method="POST">
          <input type="hidden" name="productId" value="${item.productId}" />
          <input type="hidden" name="quantity" value="${item.quantity - 1}" />
          <button type="submit" class="button button--sm-icon button--outline" aria-label="Reducir cantidad">
            <img src="/images/icons/minus.svg" alt="Reducir" />
          </button>
        </form>`;

  return `
    <div class="cart__item-quantity">
      ${decrementForm}
      <span class="cart__item-quantity-display">${item.quantity}</span>
      <form action="/cart/update-item" method="POST">
        <input type="hidden" name="productId" value="${item.productId}" />
        <input type="hidden" name="quantity" value="${item.quantity + 1}" />
        <button type="submit" class="button button--sm-icon button--outline" aria-label="Aumentar cantidad">
          <img src="/images/icons/plus.svg" alt="Aumentar cantidad" />
        </button>
      </form>
    </div>`;
}

function renderCartItem(item) {
  return `
    <div class="cart__item" data-js="cart-item">
      <div class="cart__item-image">
        <img src="${item.product.imgSrc}" alt="${item.product.name}" class="cart__item-image-content" />
      </div>
      <div class="cart__item-details">
        <div class="cart__item-header">
          <h2 class="cart__item-title">${item.product.name}</h2>
          <form action="/cart/delete-item" method="POST">
            <input type="hidden" name="productId" value="${item.productId}" />
            <button type="submit" class="button button--sm-icon button--outline" aria-label="Eliminar artículo">
              <img src="/images/icons/trash.svg" alt="Eliminar artículo" />
            </button>
          </form>
        </div>
        <div class="cart__item-footer">
          <p class="cart__item-price">S/ ${(item.product.price / 100).toFixed(2)}</p>
          ${renderQuantityControls(item)}
        </div>
      </div>
    </div>`;
}

function renderCart(cart) {
  const { items, total } = cart;

  return `
    <h1 class="cart__title">Carrito de compras</h1>
    <div class="cart__container">
      ${items.map(renderCartItem).join("")}
      <div class="cart__total">
        <p>Total</p>
        <p>S/ ${(total / 100).toFixed(2)}</p>
      </div>
      <div class="cart__action">
        ${
          items.length > 0
            ? `<a href="/checkout" class="button button--lg cart__action-button">Continuar Compra</a>`
            : `<a href="/" class="button button--lg cart__action-button">Ir a la tienda</a>`
        }
      </div>
    </div>`;
}

export function mountCart(parent) {
  parent.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const itemContainer = form.closest('[data-js="cart-item"]');

    if (itemContainer) {
      itemContainer
        .querySelectorAll("button")
        .forEach((button) => (button.disabled = true));
    }

    const body = JSON.stringify(Object.fromEntries(new FormData(form)));

    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });

      if (!response.ok) throw new Error("Error en la petición");

      const { cart } = await response.json();

      parent.innerHTML = renderCart(cart);
      updateBadge(cart);
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      form.submit();
    }
  });
}