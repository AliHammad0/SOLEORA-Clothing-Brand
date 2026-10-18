
import express from "express";
import morgan from "morgan";
import * as config from "./config/config.js";
import productRoutes from "./routes/product.js";
import DBconfig from "./config/DBconfig.js";
import userRouter from "./routes/users.js";

const app = express();
const port = config.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
//cors
import cors from "cors";
app.use(cors());

// Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRouter);

// Default Route
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

///database
DBconfig();

// Server
app.listen(port, () => {
  console.log(`Server is running successfully on http://localhost:${port}`);
});
