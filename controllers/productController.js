import * as categoryService from "../services/categoryService.js";
import * as productService from "../services/productService.js";
import { AppError } from "../utils/errorUtils.js";
import { parsePriceToCents } from "../utils/priceUtils.js";

export async function renderCategory(req, res) {
  const { slug } = req.params;

  if (!slug || slug.trim() === "") {
    throw new AppError("Slug de categoría inválido", 400);
  }

  const category = await categoryService.getCategoryBySlug(slug);

  if (!category) {
    throw new AppError("Categoría no encontrada", 404);
  }

  const minPriceCents = parsePriceToCents(req.query.minPrice);
  const maxPriceCents = parsePriceToCents(req.query.maxPrice);

  const minPriceVal = minPriceCents !== null ? minPriceCents / 100 : "";
  const maxPriceVal = maxPriceCents !== null ? maxPriceCents / 100 : "";

  const products = await productService.getProductsByCategory(category.id);

  const productsWithVisibility = products.map((product) => {
    const price = product.price / 100;

    const isVisible =
      (minPriceVal === "" || price >= minPriceVal) &&
      (maxPriceVal === "" || price <= maxPriceVal);

    return { ...product, isVisible };
  });

  res.render("category", {
    category,
    products: productsWithVisibility,
    minPrice: minPriceVal,
    maxPrice: maxPriceVal,
  });
}

export async function renderProduct(req, res) {
  const productId = Number(req.params.id);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError("ID de producto inválido", 400);
  }

  const product = await productService.getProductById(productId);

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  res.render("product", { product });
}