import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as config from "./config/config.js";
import productRoutes from "./routes/product.js";
import userRouter from "./routes/users.js";
import DBconfig from "./config/DBconfig.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("SOLEORA Server is running successfully");
});

DBconfig();

if (process.env.VERCEL !== "1") {
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
  });
}

export default app;