// middlewares/authContext.js
import * as userService from "../services/userService.js";
import { getCookie, clearCookie } from "../utils/cookieUtils.js";

export async function authContext(req, res, next) {
  req.user = null;
  res.locals.user = null;

  const userId = getCookie(req, "userId");

  if (!userId) {
    return next();
  }

  if (userId === false) {
    clearCookie(res, "userId");
    return next();
  }

  const user = await userService.getUserById(Number(userId));

  if (!user) {
    clearCookie(res, "userId");
    return next();
  }

  req.user = user;
  res.locals.user = user;

  next();
}