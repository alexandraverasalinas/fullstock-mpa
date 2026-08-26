import * as productRepository from "../repositories/productRepository.js";

export async function getProductsByCategory(categoryId) {
  return await productRepository.findAllByCategoryId(categoryId);
}

export async function getProductById(id) {
  return await productRepository.findById(id);
}