// utils/cookieUtils.js
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

const defaultOptions = {
  httpOnly: true,
  maxAge: ONE_WEEK,
  sameSite: "lax",
  signed: true,
  secure: process.env.NODE_ENV === "production",
};

export function setCookie(res, name, value, options = {}) {
  res.cookie(name, value, { ...defaultOptions, ...options });
}

export function getCookie(req, name, options = {}) {
  const finalOptions = { ...defaultOptions, ...options };
  return finalOptions.signed ? req.signedCookies[name] : req.cookies[name];
}

export function clearCookie(res, name) {
  res.clearCookie(name);
}