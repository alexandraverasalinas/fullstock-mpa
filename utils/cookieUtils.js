// utils/cookieUtils.js
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
 
export function setCookie(res, name, value, options = {}) {
  const defaultOptions = {
    httpOnly: true,
    maxAge: ONE_WEEK,
    sameSite: "lax",
  };
 
  // Combinamos las opciones por defecto con las que decida enviar el usuario.
  res.cookie(name, value, { ...defaultOptions, ...options });
}
 
export function clearCookie(res, name) {
  res.clearCookie(name);
}