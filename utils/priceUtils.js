export function parsePriceToCents(value) {
  if (value === undefined) {
    return null;
  }

  if (typeof value === "string" && value.trim() === "") {
    return null;
  }

  const num = Number(value);

  if (!Number.isFinite(num)) {
    return null;
  }

  return Math.round(num * 100);
}