import * as userRepository from "../public/userRepository.js";

export async function getUserByEmail(email) {
  return await userRepository.findByEmail(email);
}

export async function getUserById(id) {
  return await userRepository.findById(id);
}

export async function createUser(userData) {
  return await userRepository.create(userData);
}