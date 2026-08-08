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

  const minPrice = parsePriceToCents(req.query.minPrice);
  const maxPrice = parsePriceToCents(req.query.maxPrice);

  const products = await productService.getProductsByCategory(category.id, {
    minPrice: minPrice ?? -Infinity,
    maxPrice: maxPrice ?? Infinity,
  });

  res.render("category", {
    category,
    products,
    minPrice: minPrice !== null ? minPrice / 100 : "",
    maxPrice: maxPrice !== null ? maxPrice / 100 : "",
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