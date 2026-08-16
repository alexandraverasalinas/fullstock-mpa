// middlewares/authContext.js
import * as userService from "../services/userService.js";

export async function authContext(req, res, next) {
  req.user = null;
  res.locals.user = null;

  const userId = req.signedCookies.userId;

  if (!userId) {
    return next();
  }

  if (userId === false) {
    console.error("¡Alerta de seguridad! Cookie manipulada.");
    res.clearCookie("userId");
    return next();
  }

  const user = await userService.getUserById(Number(userId));

  if (!user) {
    res.clearCookie("userId");
    return next();
  }

  req.user = user;
  res.locals.user = user;

  next();
}