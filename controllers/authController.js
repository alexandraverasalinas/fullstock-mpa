import { z } from "zod";
import * as authService from "../services/authService.js";
import * as cartService from "../services/cartService.js";
import * as cartRepository from "../repositories/cartRepository.js";
import { setCookie, clearCookie } from "../utils/cookieUtils.js";
import { loginSchema, signupSchema } from "../public/js/shared/authSchemas.js";

export function renderSignup(req, res) {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("signup");
}

export async function handleSignup(req, res) {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors;
    return res.render("signup", { errors, values: req.body });
  }

  const { email, password, confirmPassword } = result.data;

  const user = await authService.signup(email, password, confirmPassword);

  if (req.cartId) {
    await cartService.mergeCarts(req.cartId, user.id);
  }

  const userCart = await cartRepository.findByUserId(user.id);

  setCookie(res, "userId", user.id);

  if (userCart) {
    setCookie(res, "cartId", userCart.id);
  } else {
    clearCookie(res, "cartId");
  }

  res.redirect("/");
}

export function renderLogin(req, res) {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("login");
}

export async function handleLogin(req, res) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const errors = z.flattenError(result.error).fieldErrors;
    return res.render("login", { errors, values: req.body });
  }

  const { email, password } = result.data;

  try {
    const user = await authService.login(email, password);

    if (req.cartId) {
      await cartService.mergeCarts(req.cartId, user.id);
    }

    const userCart = await cartRepository.findByUserId(user.id);

    setCookie(res, "userId", user.id);

    if (userCart) {
      setCookie(res, "cartId", userCart.id);
    } else {
      clearCookie(res, "cartId");
    }

    res.redirect("/");
  } catch (error) {
    res.render("login", { error: error.message, values: { email } });
  }
}

export function handleLogout(_req, res) {
  clearCookie(res, "userId");
  clearCookie(res, "cartId");
  res.redirect("/");
}