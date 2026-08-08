import * as categoryRepository from "../repositories/categoryRepository.js";

export async function getCategoryBySlug(slug) {
  return await categoryRepository.findBySlug(slug);
}