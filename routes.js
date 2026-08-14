import { Router } from "express";

import * as cartController from "./controllers/cartController.js";
import * as orderController from "./controllers/orderController.js";
import * as pagesController from "./controllers/pagesController.js";
import * as productController from "./controllers/productController.js";
import * as authController from "./controllers/authController.js";

const router = Router();

router.get("/", pagesController.renderHome);
router.get("/about", pagesController.renderAbout);
router.get("/terms", pagesController.renderTerms);
router.get("/privacy", pagesController.renderPrivacy);

router.get("/categories/:slug", productController.renderCategory);
router.get("/products/:id", productController.renderProduct);

router.get("/cart", cartController.renderCart);
router.post("/cart/add-item", cartController.addItem);
router.post("/cart/update-item", cartController.updateItem);
router.post("/cart/delete-item", cartController.deleteItem);

router.get("/checkout", orderController.renderCheckout);
router.post("/checkout/place-order", orderController.placeOrder);
router.get("/order-confirmation", orderController.renderOrderConfirmation);

router.get("/signup", authController.renderSignup);
router.post("/signup", authController.handleSignup);

router.get("/login", authController.renderLogin);
router.post("/login", authController.handleLogin);
router.post("/logout", authController.handleLogout);

export default router;