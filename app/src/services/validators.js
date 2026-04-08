const { AppError } = require("./errors");

function requireString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new AppError(400, `El campo ${fieldName} es obligatorio y debe ser texto.`);
  }
  return value.trim();
}

function requireInteger(value, fieldName) {
  const numeric = Number(value);
  if (!Number.isInteger(numeric)) {
    throw new AppError(400, `El campo ${fieldName} debe ser un numero entero.`);
  }
  if (numeric <= 0) {
    throw new AppError(400, `El campo ${fieldName} debe ser un numero mayor a 0.`);
  }
  return numeric;
}

function normalizeLikeNotLike(value) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value).trim().toLowerCase();
  if (["megusta", "true", "1", "yes", "si"].includes(normalized)) {
    return true;
  }
  if (["nomegusta", "false", "0", "no"].includes(normalized)) {
    return false;
  }
  throw new AppError(
    400,
    "likeNotLike solo permite megusta/nomegusta o true/false."
  );
}

function requireIsoDate(value, fieldName) {
  const normalized = requireString(value, fieldName);
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(400, `El campo ${fieldName} debe tener formato fecha ISO valido.`);
  }
  return normalized;
}

module.exports = {
  requireString,
  requireInteger,
  normalizeLikeNotLike,
  requireIsoDate,
};
