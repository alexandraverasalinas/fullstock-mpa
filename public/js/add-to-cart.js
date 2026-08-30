import { updateBadge } from "/js/header.js";

const addToCartForm = document.querySelector('[data-js="add-to-cart-form"]');

if (addToCartForm) {
  addToCartForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const button = e.submitter;
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Agregando...";

    try {
      const formData = new FormData(form);
      const body = JSON.stringify(Object.fromEntries(formData));

      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const { cart } = await response.json();

      updateBadge(cart);

      button.textContent = originalText;
      button.disabled = false;
    } catch (error) {
      console.error(
        "Fallo en el envío asíncrono, enviando de forma tradicional:",
        error,
      );
      form.submit();
    }
  });
}