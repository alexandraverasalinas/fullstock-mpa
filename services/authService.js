import * as userService from "./userService.js";
import { AppError } from "../utils/errorUtils.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";

export async function signup(email, password, confirmPassword) {
  if (password !== confirmPassword) {
    throw new AppError("Las contraseñas no coinciden", 400);
  }

  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    throw new AppError("El correo electrónico ya está registrado", 400);
  }

  const hashedPassword = await hashPassword(password);
  return await userService.createUser({
    email,
    password: hashedPassword,
  });
}

export async function login(email, password) {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new AppError("Credenciales inválidas", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Credenciales inválidas", 401);
  }

  return user;
}