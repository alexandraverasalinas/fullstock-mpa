import * as authService from "../services/authService.js";
import { setCookie, clearCookie } from "../utils/cookieUtils.js";

export function renderSignup(req, res) {
  if (req.user) {
    return res.redirect("/");
  }

  res.render("signup");
}

export async function handleSignup(req, res) {
  const { email, password, confirmPassword } = req.body;

  await authService.signup(email, password, confirmPassword);

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

    setCookie(res, "userId", user.id);

    res.redirect("/");
  } catch (error) {
    res.render("login", { error: error.message, values: { email } });
  }
}

export function handleLogout(_req, res) {
  clearCookie(res, "userId");
  res.redirect("/");
}