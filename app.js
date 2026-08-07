import express from "express";
import expressLayouts from "express-ejs-layouts";
import fs from "fs/promises";
import path from "node:path";
import { parsePriceToCents } from "./utils.js";
import { AppError } from "./utils/errorUtils.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("view cache", false);
app.use(expressLayouts);
app.set("layout", "layout");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

const DATA_PATH = path.join("data", "data.json");

// Global Data Middleware
app.use(async (_req, res, next) => {
  const dbJson = await fs.readFile(DATA_PATH, "utf-8");
  const db = JSON.parse(dbJson);

  const cart = db.carts[0];
  const cartItemsCount = cart
    ? cart.items.reduce((total, item) => total + item.quantity, 0)
    : 0;

  res.locals.cartItemsCount = cartItemsCount;

  next();
});

// RUTAS
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/categories/:slug", async (req, res) => {
  const categorySlug = req.params.slug;
  
  if (!categorySlug || categorySlug.trim() === "") {
    throw new AppError("Slug de categoría inválido", 400);
  }

  const { minPrice: minPriceQuery, maxPrice: maxPriceQuery } = req.query;

  const minPriceCents = parsePriceToCents(minPriceQuery);
  const maxPriceCents = parsePriceToCents(maxPriceQuery);

  const minPrice = minPriceCents ?? -Infinity;
  const maxPrice = maxPriceCents ?? Infinity;

  const dataJson = await fs.readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(dataJson);

  const category = data.categories.find((c) => c.slug === categorySlug);
  if (!category) {
    throw new AppError("Categoría no encontrada", 404);
  }

  const products = data.products.filter(
    (p) =>
      p.categoryId === category.id &&
      p.price >= minPrice &&
      p.price <= maxPrice,
  );

  const displayMinPrice = minPriceCents === null ? "" : minPriceCents / 100;
  const displayMaxPrice = maxPriceCents === null ? "" : maxPriceCents / 100;

  res.render("category", {
    category,
    products,
    minPrice: displayMinPrice,
    maxPrice: displayMaxPrice,
  });
});

app.get("/products/:id", async (req, res) => {
  const productId = Number(req.params.id);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError("ID de producto inválido", 400);
  }

  const dataJson = await fs.readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(dataJson);

  const product = data.products.find((product) => product.id === productId);

  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  res.render("product", { product });
});

app.post("/cart/add-item", async (req, res) => {
  const productId = Number(req.body.productId);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError("ID de producto inválido", 400);
  }

  const dbJson = await fs.readFile(DATA_PATH, "utf-8");
  const db = JSON.parse(dbJson);

  const product = db.products.find((p) => p.id === productId);
  if (!product) {
    throw new AppError("Producto no encontrado", 404);
  }

  let cart = db.carts[0] || { id: 1, items: [] };

  const cartItem = cart.items.find((item) => item.productId === productId);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.items.push({ productId, quantity: 1 });
  }

  db.carts[0] = cart;
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2));

  res.redirect("/products/" + productId);
});

app.get("/cart", async (req, res) => {
  const dbJson = await fs.readFile(DATA_PATH, "utf-8");
  const db = JSON.parse(dbJson);

  const cart = db.carts[0] || { id: 1, items: [] };

  const cartItems = cart.items.map((item) => {
    const product = db.products.find((p) => p.id === item.productId);
    return {
      ...item,
      name: product.name,
      price: product.price,
      imgSrc: product.imgSrc,
    };
  });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  res.render("cart", { cartItems, total });
});

app.post("/cart/update-item", async (req, res) => {
  const productId = Number(req.body.productId);
  const newQuantity = Number(req.body.quantity);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError("ID de producto inválido", 400);
  }

  if (!Number.isFinite(newQuantity) || newQuantity <= 0) {
    throw new AppError("Cantidad inválida", 400);
  }

  const dbJson = await fs.readFile(DATA_PATH, "utf-8");
  const db = JSON.parse(dbJson);

  const cart = db.carts[0];
  const cartItem = cart.items.find((item) => item.productId === productId);

  if (!cartItem) {
    throw new AppError("Producto no está en el carrito", 404);
  }

  cartItem.quantity = newQuantity;

  db.carts[0] = cart;
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2));

  res.redirect("/cart");
});

app.post("/cart/delete-item", async (req, res) => {
  const productId = Number(req.body.productId);

  if (!Number.isFinite(productId) || productId <= 0) {
    throw new AppError("ID de producto inválido", 400);
  }

  const dbJson = await fs.readFile(DATA_PATH, "utf-8");
  const db = JSON.parse(dbJson);

  const cart = db.carts[0];
  const initialLength = cart.items.length;
  
  cart.items = cart.items.filter((item) => item.productId !== productId);

  if (cart.items.length === initialLength) {
    throw new AppError("Producto no está en el carrito", 404);
  }

  db.carts[0] = cart;
  await fs.writeFile(DATA_PATH, JSON.stringify(db, null, 2));

  res.redirect("/cart");
});

// Middleware de errores (ORDEN IMPORTANTE)
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});