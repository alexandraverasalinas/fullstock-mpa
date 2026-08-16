import * as authService from "../services/authService.js";
import * as cartService from "../services/cartService.js";
import * as cartRepository from "../repositories/cartRepository.js";
import { setCookie, clearCookie } from "../utils/cookieUtils.js";

export function renderSignup(req, res) {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("signup");
}

export async function handleSignup(req, res) {
  const { email, password, confirmPassword } = req.body;

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
  const { email, password } = req.body;

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