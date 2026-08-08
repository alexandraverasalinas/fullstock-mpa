import * as productRepository from "../repositories/productRepository.js";

export async function getProductsByCategory(categoryId, filters = {}) {
  const products = await productRepository.findAllByCategoryId(categoryId);

  const minPrice = filters.minPrice ?? -Infinity;
  const maxPrice = filters.maxPrice ?? Infinity;

  return products.filter((product) => {
    const meetsMinPrice = product.price >= minPrice;
    const meetsMaxPrice = product.price <= maxPrice;
    return meetsMinPrice && meetsMaxPrice;
  });
}

export async function getProductById(id) {
  return await productRepository.findById(id);
}