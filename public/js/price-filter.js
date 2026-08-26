const filterForm = document.querySelector('[data-js="filter-form"]');
const productCards = document.querySelectorAll('[data-js="product-card"]');

filterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const { minPrice, maxPrice } = e.currentTarget.elements;

  const min = minPrice.value;
  const max = maxPrice.value;

  const minVal = parseFloat(min) || 0;
  const maxVal = parseFloat(max) || Infinity;

  productCards.forEach((card) => {
    const price = parseFloat(card.dataset.price);
    const isVisible = price >= minVal && price <= maxVal;
    card.dataset.visible = isVisible;
  });

  const url = new URL(window.location);
  if (min) {
    url.searchParams.set("minPrice", min);
  } else {
    url.searchParams.delete("minPrice");
  }

  if (max) {
    url.searchParams.set("maxPrice", max);
  } else {
    url.searchParams.delete("maxPrice");
  }

  window.history.pushState({}, "", url);
});