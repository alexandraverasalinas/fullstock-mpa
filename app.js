import express from "express";
import expressLayouts from "express-ejs-layouts";
import cookieParser from "cookie-parser";

import router from "./routes.js";
import { cartContext } from "./middlewares/cartContext.js";
import { globalData } from "./middlewares/globalData.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const PORT = 3000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("view cache", false);
app.use(expressLayouts);
app.set("layout", "layout");

app.use(cartContext);
app.use(globalData);

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});