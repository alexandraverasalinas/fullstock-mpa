import express from "express";
import expressLayouts from "express-ejs-layouts";
 
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { globalData } from "./middlewares/globalData.js";
import router from "./routes.js";
 
const PORT = 3000;
const app = express();
 

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
 
app.set("view engine", "ejs");
app.use(expressLayouts);
 
app.use(globalData);
 

app.use(router);
 

app.use(notFoundHandler);
app.use(errorHandler);
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});